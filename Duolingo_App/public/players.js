const table = document.getElementById('participants')

function readFile(file, callback) {
    // Open a file and read the contents
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function updatePage() {
    window.location.href = "/update";
}

function createTableCell(text, row) {
    // Create a table cell to be added to a table row
    let cell = document.createElement("td");
    cell.innerHTML = text;
    row.appendChild(cell);
}

function delete_entry(buttonID) {
    if(confirm("Are you sure you want to delete this entry?")) {
        let userID = `${buttonID}`.replace('_button', '');
        window.location.href = `/delete?${userID}`;
    }
}

function createTableEntry(data) {
    // Create an entire table row to be appended to a table
    let row = document.createElement("tr");
    row.setAttribute("id", data.Username);

    let header = document.createElement("th");
    header.setAttribute("scope", "row");
    header.innerHTML = data.Name;
    row.appendChild(header);

    createTableCell(data.NNumber, row);
    createTableCell(data.Username, row);
    createTableCell(data.Language, row);
    createTableCell(data.Experience, row);
    createTableCell(data.Crowns, row);

    let del = document.createElement("td");
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", `${data.Username}_button`);
    button.setAttribute("class", "btn btn-danger");
    button.setAttribute("onclick", "delete_entry(this.id)");
    button.innerHTML = "Delete";
    del.appendChild(button);
    row.appendChild(del);

    table.appendChild(row);
}

readFile("./players.json", (text) => {
    // Read the players.json file, and for each object create a line in a table
    let data = JSON.parse(text);
    
    data.players.forEach(player => {
        createTableEntry(player);
    });
});