document.addEventListener("DOMContentLoaded", function() {
    // Attach event listener to the delete buttons
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', function() {
            let userID = this.getAttribute('data-id');

            if (confirm("Are you sure you want to delete this user?")) {
                // Prepare data for sending
                let data = { id: userID };

                // Setup AJAX request
                var xhttp = new XMLHttpRequest();
                xhttp.open("DELETE", "/delete-user-ajax", true);
                xhttp.setRequestHeader("Content-type", "application/json");

                // Handle response
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 204) {
                        alert("User deleted successfully!");
                        // Remove the deleted user's row from the table
                        document.querySelector(`tr[data-value="${userID}"]`).remove();
                    } else if (xhttp.readyState == 4) {
                        console.log("Error deleting user:", xhttp.statusText);
                    }
                };

                // Send the request
                xhttp.send(JSON.stringify(data));
            }
        });
    });
});