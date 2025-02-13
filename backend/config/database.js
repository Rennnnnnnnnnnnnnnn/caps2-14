import mysql from 'mysql2';

// Create a database connection (using a connection pool for better scalability)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mpf_db',
}).promise();  // Using promise-based queries

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }).promise()

// Connect to the database (although with a pool, explicit connection is handled automatically)
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release();  // Release the connection after use (for pool management)
});

// Export the db connection to be used in other files
export default db;

