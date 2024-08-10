function deleteControl(controlID) {
    let data = { id: controlID };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-control-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(controlID);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting control:", xhttp.statusText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

function deleteRow(controlID) {
    let table = document.getElementById("controls-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == controlID) {
            table.deleteRow(i);
            break;
        }
    }
}