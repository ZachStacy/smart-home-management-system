function deleteType(typeID) {
    let data = { id: typeID };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(typeID);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting device type:", xhttp.statusText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

function deleteRow(typeID) {
    let table = document.getElementById("types-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == typeID) {
            table.deleteRow(i);
            break;
        }
    }
}