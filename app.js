/*
---  Set up Section  ---
*/

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



/*
---  Homepage Route Section  ---
*/

// Route for homepage
app.get('/', function(req, res) {
    res.render('index');
});



/*
---  Users Routes Section  ---
*/

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



/*
---  Device Routes Section  ---
*/

// Route for Devices
app.get('/devices', function(req, res) {
    let deviceQuery = "SELECT Devices.deviceID, Devices.deviceName, Devices.status, DeviceTypes.typeName " 
    + "FROM Devices LEFT JOIN DeviceTypes ON Devices.typeID = DeviceTypes.typeID";


    db.pool.query(deviceQuery, function(error, deviceRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('devices', { data: deviceRows});
    });
});

// Route to read device details
app.get('/read_device', function(req, res) {
    let deviceID = parseInt(req.query.deviceID);
    if (!deviceID) {
        res.send("Device ID is missing.");
        return;
    }

    let deviceQuery = "SELECT Devices.deviceID, Devices.deviceName, Devices.status, DeviceTypes.typeName "
                    + "FROM Devices LEFT JOIN DeviceTypes ON Devices.typeID = DeviceTypes.typeID " 
                    + "WHERE Devices.deviceID = ?";
    db.pool.query(deviceQuery, [deviceID], function(error, deviceRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        if (deviceRows.length === 0) {
            res.send("Device not found.");
            return;
        }
        res.render('read_device', { device: deviceRows[0] });
    });
});

// Route for creating a new device
app.get('/create_device', function(req, res) {
    let createDeviceQuery = "SELECT * FROM DeviceTypes";
    db.pool.query(createDeviceQuery, function(error, typeRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('create_device', { data: typeRows });
    });
});

// Route for adding a new device
app.post('/add_device', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO Devices (deviceName, status, typeID) VALUES (?, ?, ?)`;
    let values = [data['input-deviceName'], data['input-status'], data['input-typeID']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/devices');
        }
    });
});



/*
---  Control Routes Section  ---
*/

// Route for Controls
app.get('/controls', function(req, res) {
    let controlQuery = "SELECT Controls.controlID, Controls.controlName, Controls.startTime, Controls.endTime, "
                     + "Controls.rep, Users.username, DeviceTypes.typeName FROM Controls LEFT JOIN Users ON "
                     + "Controls.userID = Users.userID LEFT JOIN DeviceTypes ON Controls.typeID = "
                     + "DeviceTypes.typeID";

    db.pool.query(controlQuery, function(error, controlRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('controls', { controls: controlRows });
    });
});

// Route to read control details
app.get('/read_control', function(req, res) {
    let controlID = parseInt(req.query.controlID);
    if (!controlID) {
        res.send("Control ID is missing.");
        return;
    }

    let controlQuery = "SELECT Controls.controlID, Controls.controlName, Controls.startTime, Controls.endTime, "
                     + "Controls.rep, Users.username, DeviceTypes.typeName FROM Controls LEFT JOIN Users ON "
                     + "Controls.userID = Users.userID LEFT JOIN DeviceTypes ON Controls.typeID = "
                     + "DeviceTypes.typeID WHERE Controls.controlID = ?";

    db.pool.query(controlQuery, [controlID], function(error, controlRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        if (controlRows.length === 0) {
            res.send("Control not found.");
            return;
        }
        res.render('read_control', { control: controlRows[0] });
    });
});

// Route for creating a new control
app.get('/create_control', function(req, res) {
    let query1 = "SELECT * FROM Users";
    let query2 = "SELECT * FROM DeviceTypes";

    db.pool.query(query1, function(error, userRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        db.pool.query(query2, function(error, typeRows, fields) {
            if (error) {
                console.error(error);
                res.send("Error occurred while querying the database.");
                return;
            }
            res.render('create_control', { users: userRows, types: typeRows });
        });
    });
});

// Route for adding a new control
app.post('/add_control', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO Controls (controlName, startTime, endTime, rep, userID, typeID) VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [data['input-controlName'], data['input-startTime'], data['input-endTime'], 
                 data['input-rep'], data['input-user'], data['input-type']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/controls');
        }
    });
});



/*
---  Control Routes Section  ---
*/

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

// Route to read device type details
app.get('/read_type', function(req, res) {
    let typeID = parseInt(req.query.typeID);
    if (!typeID) {
        res.send("Device Type ID is missing.");
        return;
    }

    let typeQuery = "SELECT * FROM DeviceTypes WHERE typeID = ?";

    db.pool.query(typeQuery, [typeID], function(error, typeRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        if (typeRows.length === 0) {
            res.send("Device type not found.");
            return;
        }
        res.render('read_type', { type: typeRows[0] });
    });
});

// Route for creating a device type
app.get('/create_type', function(req, res) {
    res.render('create_type'); // Render the form template
});

// Route to handle form submission for create_user
app.post('/add_type', function(req, res) {
    let data = req.body;

    // Use query
    let query = `INSERT INTO DeviceTypes (typeName) VALUES (?)`;
    let values = [data['input-typeName']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/deviceTypes');
        }
    });
});



/*
---  Operation Routes Section  ---
*/

// Route for Operations History
app.get('/operations', function(req, res) {
    let operationQuery = "SELECT Operations.operationID, Operations.timeStamp, Devices.deviceName, "
                       + "Controls.controlName FROM Operations LEFT JOIN Devices ON "
                       + "Operations.deviceID = Devices.deviceID LEFT JOIN Controls ON "
                       + "Operations.controlID = Controls.controlID";

    db.pool.query(operationQuery, function(error, operationRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        res.render('operations', { operations: operationRows });
    });
});

// Route to read operation details
app.get('/read_operation', function(req, res) {
    let opID = parseInt(req.query.operationID);
    if (!opID) {
        res.send("Operation ID is missing.");
        return;
    }

    let opQuery = "SELECT Operations.operationID, Operations.timeStamp, Devices.deviceName, "
                + "Controls.controlName FROM Operations LEFT JOIN Devices ON "
                + "Operations.deviceID = Devices.deviceID LEFT JOIN Controls ON "
                + "Operations.controlID = Controls.controlID WHERE Operations.operationID = ?";

    db.pool.query(opQuery, [opID], function(error, opRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        if (opRows.length === 0) {
            res.send("Operation not found.");
            return;
        }
        res.render('read_operation', { operation: opRows[0] });
    });
});

// Route for creating a new operation
app.get('/create_operation', function(req, res) {
    let query1 = "SELECT * FROM Devices";
    let query2 = "SELECT * FROM Controls";

    db.pool.query(query1, function(error, deviceRows, fields) {
        if (error) {
            console.error(error);
            res.send("Error occurred while querying the database.");
            return;
        }
        db.pool.query(query2, function(error, controlRows, fields) {
            if (error) {
                console.error(error);
                res.send("Error occurred while querying the database.");
                return;
            }
            res.render('create_operation', { devices: deviceRows, controls: controlRows });
        });
    });
});

// Route for adding a new operation
app.post('/add_operation', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO Operations (timeStamp, deviceID, controlID) VALUES (?, ?, ?)`;
    let values = [data['input-timeStamp'], data['input-device'], data['input-control']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.redirect('/operations');
        }
    });
});



/*
---  Start Server Section  ---
*/
// Start the server
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});

// test