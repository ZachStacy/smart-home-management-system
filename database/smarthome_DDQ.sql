SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;


/*
    CREATE A USERS TABLE
*/
CREATE OR REPLACE TABLE Users (
    userID int NOT NULL UNIQUE AUTO_INCREMENT,
    username varchar(50) NOT NULL UNIQUE,
    email varchar(100) NOT NULL UNIQUE,
    phone varchar(15),
    PRIMARY KEY (userID)
);


/*
    CREATE A DEVICETYPES TABLE
*/
CREATE OR REPLACE TABLE DeviceTypes (
    typeID int NOT NULL UNIQUE AUTO_INCREMENT,
    typeName varchar(50) NOT NULL,
    PRIMARY KEY (typeID)
);


/*
    CREATE A CONTROLS TABLE
*/
CREATE OR REPLACE TABLE Controls (
    controlID int NOT NULL UNIQUE AUTO_INCREMENT,
    controlName varchar(20) NOT NULL,
    startTime datetime NOT NULL,
    endTime datetime, 
    rep varchar(20),
    userID int,
    typeID int,
    PRIMARY KEY (controlID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE SET NULL,
    FOREIGN KEY (typeID) REFERENCES DeviceTypes(typeID) ON DELETE SET NULL
);


/*
    CREATE A DEVICES TABLE
*/
CREATE OR REPLACE TABLE Devices (
    deviceID int NOT NULL UNIQUE AUTO_INCREMENT,
    deviceName varchar(50) NOT NULL,
    status varchar(10),
    typeID int,
    PRIMARY KEY (deviceID),
    FOREIGN KEY (typeID) REFERENCES DeviceTypes(typeID) ON DELETE SET NULL
);


/*
    CREATE A OPERATIONS TABLE
*/
CREATE OR REPLACE TABLE Operations (
    operationID int NOT NULL UNIQUE AUTO_INCREMENT,
    timeStamp datetime NOT NULL,
    controlID int NOT NULL,
    deviceID int NOT NULL,
    PRIMARY KEY (operationID),
    FOREIGN KEY (controlID) REFERENCES Controls(controlID) ON DELETE CASCADE,
    FOREIGN KEY (deviceID) REFERENCES Devices(deviceID) ON DELETE CASCADE
);


/*
    INSERT INTO USERS TABLE
*/
INSERT INTO Users (
    username,
    email,
    phone
)
VALUES
(
    'johnsmith',
    'johnsmith@example.com',
    '123-456-7890'
),
(
    'janedoe',
    'janedoe@example.com',
    '234-567-8901'
),
(
    'markbrown',
    'markbrown@example.com',
    '345-678-9012'
),
(
    'susanclark',
    'susanclark@example.com',
    '456-789-0123'
);


/*
    INSERT INTO DEVICETYPES TABLE
*/
INSERT INTO DeviceTypes (
    typeName
)
VALUES
('TV'), ('Light'), ('Music'), ('HVAC');


/*
    INSERT INTO CONTROLS TABLE
*/
INSERT INTO Controls (
    controlName,
    startTime,
    endTime,
    rep,
    userID,
    typeID
)
VALUES
(
    'Turn On',
    ('2024-07-17 06:00:00'),
    ('2024-07-17 07:00:00'),
    'daily',
    1,
    2
),
(
    'Turn Off',
    ('2024-07-17 22:00:00'),
    ('2024-07-17 23:00:00'),
    'daily',
    2,
    1
),
(
    'Adjust Temp',
    ('2024-07-17 12:00:00'),
    ('2024-07-17 12:15:00'),
    'weekly',
    3,
    4
),
(
    'Play Music',
    ('2024-07-17 18:00:00'),
    ('2024-07-17 19:00:00'),
    'daily',
    4,
    3
);


/*
    INSERT INTO DEVICES TABLE
*/
INSERT INTO Devices (
    deviceName,
    status,
    typeID
)
VALUES
(
    'Living Room TV',
    'off',
    1
),
(
    'Bedroom Light',
    'on',
    2
),
(
    'Kitchen Speaker',
    'off',
    3
),
(
    'HVAC System',
    'on',
    4
);


/*
    INSERT INTO EVENTS TABLE
*/
INSERT INTO Operations (
    timeStamp,
    deviceID,
    controlID
)
VALUES
(
    ('2024-07-17 06:00:00'),
    2,
    1
),
(
    ('2024-07-17 22:00:00'),
    1,
    2
),
(
    ('2024-07-17 12:00:00'),
    4,
    3
),
(
    ('2024-07-17 18:00:00'),
    3,
    4
);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;