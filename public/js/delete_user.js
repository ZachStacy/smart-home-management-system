function deleteUser(userID) {
    let data = { id: userID };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(userID);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting user:", xhttp.statusText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

function deleteRow(userID) {
    let table = document.getElementById("users-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == userID) {
            table.deleteRow(i);
            break;
        }
    }
}