const Duolingo = require('duolingo-api')

var duo = {
    getMetadata: async function (user) {
        return await user.getRawData();
    },

    getInfoOnLanguage: function (data, language) {
        for (let course of data.courses) {
            if (course.title == language) {
                return {
                    "title": course.title,
                    "xp": course.xp,
                    "crowns": course.crowns,
                    "level": course.level
                }
            }
        }
        console.log("Couldn't get info on that language! Try a different one")
    },

    getDuolingoUser: function(username) {
        let user = new Duolingo({"username": username});
        return user
    }
}


module.exports = duo;