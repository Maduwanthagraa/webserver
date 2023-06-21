const express = require('express');
const mysql = require('mysql');

// Create an Express application
const app = express();
const port = process.env.PORT || 80; // Use the PORT environment variable or default to 3000

// Set up middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure the database connection
const config = {
  host: 'energydatabase.cqxazh8m1xkm.ap-southeast-1.rds.amazonaws.com',
  user: 'admin',
  password: 'dilshan2000',
  database: 'energy_meter',
  port: 3306
};

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');

  // Define your API routes and request handling logic
  app.get('/', (req, res) => {
    res.send('Welcome to your API');
  });

  app.post('/data', (req, res) => {
    const { device_id, billdate, energyvalue } = req.body; // Assuming you have three fields in your data
    console.log(req.body);

    const insertQuery = 'INSERT INTO energydata (device_id, billdate, energyvalue) VALUES (?, ?, ?)';
    const values = [device_id, billdate, energyvalue];

    pool.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });

    connection.release(); // Release the connection back to the pool
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
