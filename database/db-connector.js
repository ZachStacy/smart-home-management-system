// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// // Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_hew2',
    password        : '4977',
    database        : 'cs340_hew2'
})


// // Create a 'connection pool' using the provided credentials
// var pool = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'classmysql.engr.oregonstate.edu',
//     user            : 'cs340_stacyz',
//     password        : '5296',
//     database        : 'cs340_stacyz'
// })

// Export it for use in our application
module.exports.pool = pool;