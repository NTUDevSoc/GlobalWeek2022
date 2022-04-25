const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const url = require('url')
const duo = require('./duo.js');
const app = new express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/site/index.html'));
});

app.get('/new-entry', (req, res) => {
    res.sendFile(path.join(__dirname, '/site/newEntry.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '/site/settings.html'));
});

app.post('/submit', (req, res) => {
    let user = req.body;
    let duoUser = duo.getDuolingoUser(user.username); 
    duo.getMetadata(duoUser).then(data => {
        userData = data.users[0];
        duoUserInfo = duo.getInfoOnLanguage(userData, user.language);
        let entry = {
            "Name": user.name,
            "NNumber": user.NNumber,
            "Username": user.username,
            "Language": user.language,
            "Experience": duoUserInfo.xp,
            "Crowns": duoUserInfo.crowns,
            "Level": duoUserInfo.level
        };
        
        fs.readFile(path.join(__dirname, '/public/players.json'), (err, data) => {
            let json = JSON.parse(data);
            json.players.push(entry);

            fs.writeFileSync(path.join(__dirname, '/public/players.json'), JSON.stringify(json), err => {
                if (err) throw err
                });
        });
    });
    

    res.redirect('/update');
});

app.get('/delete', (req, res) => {
    let uName = url.parse(req.url, true);
    uName = uName.search.substring(1);

    fs.readFile(path.join(__dirname, '/public/players.json'), (err, data) => {
        let json = JSON.parse(data);

        for (i = 0; i < json.players.length; i++) {
            if (json.players[i].Username == uName) {
                json.players.splice(i, 1)
            }
        }

        fs.writeFileSync(path.join(__dirname, '/public/players.json'), JSON.stringify(json), err => {
            if (err) throw err
        });
    });

    res.redirect('/');
});

app.get('/update', (req, res) => {
    fs.readFile(path.join(__dirname, '/public/players.json'), (err, data) => {
        let json = JSON.parse(data);

        const forLoop = async _ => {
            for (i = 0; i < json.players.length; i++) {
                user = duo.getDuolingoUser(json.players[i].Username);
                metadata = await duo.getMetadata(user);
    
                userData = metadata.users[0];
                duoUserInfo = duo.getInfoOnLanguage(userData, json.players[i].Language);
                let entry = {
                    "Name": json.players[i].Name,
                    "Username":json.players[i].Username,
                    "Language": json.players[i].Language,
                    "Experience": duoUserInfo.xp,
                    "Crowns": duoUserInfo.crowns,
                };                
                json.players[i] = entry;
            }            
            fs.writeFile(path.join(__dirname, '/public/players.json'), JSON.stringify(json), err => {
                if (err) throw err
            });
        }
        forLoop();        
    });
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Node.js server is running on port: ${port}`);
    console.log(`http://localhost:${port}`);
});
