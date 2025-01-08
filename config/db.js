const mysql = require("mysql2/promise")

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"Mayur@2002",
    database:"mern_app"
})

module.exports = db;