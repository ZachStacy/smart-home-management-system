function deleteDevice(deviceID) {
    let data = { id: deviceID };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-device-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(deviceID);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting device:", xhttp.statusText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

function deleteRow(deviceID) {
    let table = document.getElementById("devices-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == deviceID) {
            table.deleteRow(i);
            break;
        }
    }
}