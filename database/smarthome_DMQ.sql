-- Group 77 -- smarthome database.


-- Users
-- get information of all users
SELECT * FROM Users;

-- read or get one user's data for the update form
SELECT * FROM Users WHERE userID = :userID_selected;

-- create a new user
INSERT INTO users (username, email, phone) VALUES (:username_from_input, :email_from_input, :phone_from_input);

-- delete one user
DELETE FROM Users WHERE userID = :userID_selected;

-- update users
UPDATE Users SET username = :username_from_input, email = :email_from_input, phone = :phone_from_input WHERE userID = :userID_selected;


-- Device types
-- get information of all device types
SELECT * FROM DeviceTypes;

-- read or get one DeviceType's data for the update form
SELECT * FROM DeviceTypes WHERE typeID = :typeID_selected;

-- create a new device type
INSERT INTO DeviceTypes (typeName) VALUES (:typeName_from_input);

-- delete one device type
DELETE FROM DeviceTypes WHERE typeID = :typeID_selected;

-- update a device type
UPDATE DeviceTypes SET typeName = :typeName_from_input;


-- Devices
-- get information of all devices
SELECT Devices.deviceID, Devices.deviceName, Devices.status, DeviceTypes.typeName FROM Devices
LEFT JOIN DeviceTypes ON Devices.typeID = DeviceTypes.typeID;

-- read or get one device's data for the update form
SELECT Devices.deviceID, Devices.deviceName, Devices.status, DeviceTypes.typeName FROM Devices
LEFT JOIN DeviceTypes ON Devices.typeID = DeviceTypes.typeID
WHERE Devices.deviceID = :deviceID_selected;

-- create a new device type
INSERT INTO Devices (deviceName, status, typeID) VALUES (:deviceName_from_input, :status_from_input, (SELECT typeID FROM DeviceTypes WHERE typeName = :typeName_selected));

-- delete one device
DELETE FROM Devices WHERE deviceID = :deviceID_selected;

-- update a device
UPDATE Devices SET deviceName = :typeName_from_input status = :status_from_input, typeID = (SELECT typeID FROM DeviceTypes WHERE typeName = :typeName_selected) WHERE deviceID = :deviceID_selected;


-- Controls
-- get information of all Controls
SELECT Controls.controlID, Controls.controlName, Controls.startTime, Controls.endTime,
Controls.rep, Users.username, DeviceTypes.typeName 
FROM Controls
LEFT JOIN Users ON Controls.userID = Users.userID
LEFT JOIN DeviceTypes ON Controls.typeID = DeviceTypes.typeID;

-- read or get information of one Control for the update form
SELECT Controls.controlName, Controls.startTime, Controls.endTime,
Controls.rep, Users.username, DeviceTypes.typeName 
FROM Controls
LEFT JOIN Users ON Controls.userID = Users.userID
LEFT JOIN DeviceTypes ON Controls.typeID = DeviceTypes.typeID
WHERE Controls.controlID = :controlID_selected;

-- create a new control
INSERT INTO Controls (controlName, startTime, endTime, rep, userID, typeID) 
VALUES (:controlName_from_input, :startTime_from_input, :endTime_from_input, :rep_from_input, 
        (SELECT userID FROM Users WHERE username = :username_selected), (SELECT typeID FROM DeviceTypes WHERE typeName = :typeName_selected));

-- delete a control, corresponding operations will be deleted as ON DELETE CASCADE is set
DELETE FROM Controls WHERE controlID = :controlID_selected;

-- update a control, will also update an operation as FK set
UPDATE Controls 
SET controlName = :controlName_from_input, 
    startTime = :startTime_from_input 
    endTime = :endTime_from_input rep = :rep_from_input 
    userID = (SELECT userID FROM Users WHERE username = :username_selected)
    typeID = (SELECT typeID FROM DeviceTypes WHERE typeName = :typeName_selected)
    WHERE controlID = :controlID_selected;


--Opeartions
--Browse all operations latest first
SELECT Operations.operationID, Operations.timeStamp, Controls.controlName, Devices.deviceName FROM Operations
LEFT JOIN Devices ON Operations.deviceID = Devices.deviceID
LEFT JOIN Controls ON Operations.controlID = Controls.controlID;

-- read information of one operation, this is more detailed than the Operations page
SELECT Operations.operationID, Operations.timeStamp, Controls.controlName, Controls.startTime, 
    Controls.endTime, Controls.rep, Devices.deviceName, Devices.status 
FROM Operations
LEFT JOIN Devices ON Operations.deviceID = Devices.deviceID
LEFT JOIN Controls ON Operations.controlID = Controls.controlID 
WHERE operationID = :operationID_selected;

-- insert an oeperation
INSERT INTO Operations (timeStamp, controlID, deviceID)
VALUES (:timeStamp_from_input, 
        (SELECT controlID FROM Controls WHERE controlName = :controlName_selected),
        (SELECT deviceID FROM Devices WHERE deviceName = :deviceName_selected));


-- table information for update page
SELECT Operations.operationID, Operations.timeStamp, Controls.controlName, Devices.deviceName FROM Operations
LEFT JOIN Devices ON Operations.deviceID = Devices.deviceID
LEFT JOIN Controls ON Operations.controlID = Controls.controlID
WHERE operationID = :operationID_selected;
-- and the following will help to fill the dropdown list when update
SELECT * FROM Controls;  
SELECT * FROM Devices;

-- update an operation
UPDATE Operations 
SET timeStamp = :timeStamp_from_input, 
    controlID = (SELECT controlID FROM Controls WHERE controlName = :controlName_selected)
    deviceID = (SELECT deviceID FROM Devices WHERE deviceName = :deviceName_selected)
    WHERE operationID = :operationID_selected;

--Delete an operation
DELETE FROM Operations WHERE operationID = :operationID_selected;