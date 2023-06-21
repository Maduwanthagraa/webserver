const express = require('express');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 80; // Use the PORT environment variable or default to 80


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({
  host: 'energydatabase.cqxazh8m1xkm.ap-southeast-1.rds.amazonaws.com', 
  user: 'admin',
  password: 'dilshan2000',
  database: 'energy_meter',
  port: 3306
});

console.log('Connecting to the Energy Meter database...');

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  setupServer();
});

function setupServer() {
  app.get('/', (req, res) => {
    res.send('Welcome to energy meter server');
  });

  app.post('/data', (req, res) => {
    const { device_id, billdate, energyvalue } = req.body;
    console.log(req.body);

    const insertQuery = 'INSERT INTO energydata (device_id, billdate, energyvalue) VALUES (?, ?, ?)';
    const values = [device_id, billdate, energyvalue];

    pool.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        console.log("Error occured")
        return res.json(500);
      }else{
        console.log("Data inserted succefully");
        res.json(200);
      }
    });
  });

  app.post('/getDate', (req,res) => {
    return res.json("Function call");
  })

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}