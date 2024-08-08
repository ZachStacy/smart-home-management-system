function deleteOperation(operationID) {
    let data = { id: operationID };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-operation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(operationID);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting operation:", xhttp.statusText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

function deleteRow(operationID) {
    let table = document.getElementById("operations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == operationID) {
            table.deleteRow(i);
            break;
        }
    }
}