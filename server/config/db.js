const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
dotenv.config();




const dbname = process.env.DATABASE_NAME;
const dbpassword = process.env.DATABASE_PASSWORD;
const dbhost = process.env.HOST;
const dbport = process.env.SQL_PORT;
const dbuser = process.env.DATABASE_USERNAME;

const db = new Sequelize(dbname, dbuser, dbpassword, {
  host: dbhost,
  dialect: "mysql",
  port: dbport,
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {

    
    charset:'utf8',
    timestamps: false,
    freezeTableName: true
  },
  logging: false,
  
  
});

async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();




module.exports = db;
