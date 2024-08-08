const express = require('express');
const { engine } = require('express-handlebars');
const db = require('./database/db-connector');

const app = express();
const PORT = 62829;

// Handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', '.hbs');

// Configure Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route for homepage
app.get('/', function(req, res) {
    res.render('index');
});

// Route for Users
app.get('/users', function(req, res) {
    let userQuery = "SELECT * FROM Users";

    db.pool.query(userQuery, function(error, userRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('users', { data: userRows });
    });
});

// Route for creating_user
app.get('/create_user', function(req, res) {
    res.render('create_user'); // Render the form template
});

// Route to handle form submission for create_user
app.post('/add_user', function(req, res) {
    let data = req.body;

    // Use query
    let query = `INSERT INTO Users (username, email, phone) VALUES (?, ?, ?)`;
    let values = [data['input-username'], data['input-email'], data['input-phone']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/users');
        }
    });
});

// Route to handle deleting user via AJAX
app.delete('/delete-user-ajax', function(req, res) {
    let userID = parseInt(req.body.id);
    let deleteUserQuery = 'DELETE FROM Users WHERE userID = ?';

    db.pool.query(deleteUserQuery, [userID], function(error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


// Route to read user details
app.get('/read_user', function(req, res) {
    let userID = req.query.userID;
    if (!userID) {
        res.send("User ID is missing.");
        return;
    }

    let userQuery = "SELECT * FROM Users WHERE userID = ?";
    db.pool.query(userQuery, [userID], function(error, userRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        if (userRows.length === 0) {
            res.send("User not found.");
            return;
        }
        res.render('read_user', { user: userRows[0] });
    });
});


// Route to edit user details
app.get('/edit_user', function(req, res) {
    let userID = req.query.userID;
    if (!userID) {
        res.send("User ID is missing.");
        return;
    }

    let userQuery = "SELECT * FROM Users WHERE userID = ?";
    db.pool.query(userQuery, [userID], function(error, userRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        if (userRows.length === 0) {
            res.send("User not found.");
            return;
        }
        res.render('edit_user', { user: userRows[0] });
    });
});



// Route to handle form submission for edit_user to update users
// source : https://stackoverflow.com/questions/41168942/how-to-input-a-nodejs-variable-into-an-sql-query
app.post('/update_user', function(req, res) {
    let userID = req.body['input-update-userID'];
    let username = req.body['input-update-username'];
    let email = req.body['input-update-email'];
    let phone = req.body['input-update-phone'];

    // Use query
    let query_update = "UPDATE Users SET username = ?, email = ?, phone = ? WHERE userID = ?";

    db.pool.query(query_update, [username, email, phone, userID], function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/users');
        }
    });
});



// Route for Devices
app.get('/devices', function(req, res) {
    let deviceQuery = "SELECT * FROM Devices";
    let deviceTypeQuery = "SELECT * FROM DeviceTypes";

    db.pool.query(deviceQuery, function(error, deviceRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }

        db.pool.query(deviceTypeQuery, function(error, deviceTypeRows, fields) {
            if (error) {
                console.error(error);
                res.send("Error occurred while querying the database.");
                return;
            }

            res.render('devices', { devices: deviceRows, deviceTypes: deviceTypeRows });
        });
    });
});

// Route for Controls
app.get('/controls', function(req, res) {
    let controlQuery = "SELECT * FROM Controls";

    db.pool.query(controlQuery, function(error, controlRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('controls', { controls: controlRows });
    });
});

// Route for Device Types
app.get('/devicetypes', function(req, res) {
    let deviceTypeQuery = "SELECT * FROM DeviceTypes";

    db.pool.query(deviceTypeQuery, function(error, deviceTypeRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('deviceTypes', { deviceTypes: deviceTypeRows });
    });
});

// Route for Operations History
app.get('/operations', function(req, res) {
    let operationQuery = "SELECT * FROM Operations";

    db.pool.query(operationQuery, function(error, operationRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('operations', { operations: operationRows });
    });
});

// Route for creating a new device
app.post('/add-device', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO Devices (deviceName, status, typeID) VALUES (?, ?, ?)`;
    let values = [data['input-deviceName'], data['input-status'], data['input-deviceType']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/devices');
        }
    });
});


// Start the server
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});

// test