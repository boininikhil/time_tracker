const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password@123',
  database: 'time_tracking',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

// Middleware
app.use(bodyParser.json());

// Register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [username, password];
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
        return;
      }
  
      res.status(201).json({ userId: results.insertId });
    });
  });


  // User login
// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT userId FROM users WHERE username = ? AND password = ?';
    const values = [username, password];
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
        return;
      }
  
      if (results.length === 0) {
        res.status(401).send('Invalid username or password');
        return;
      }
  
      const userId = results[0].userId;
  
      // User is logged in successfully
      res.status(200).json({ userId });
    });
  });

// Create a new time entry
app.post('/time-entries', (req, res) => {
  const { userId, task, startTime, endTime } = req.body;

  const query = 'INSERT INTO time_entries (userId, task, startTime, endTime) VALUES (?, ?, ?, ?)';
  const values = [userId, task, startTime, endTime];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating time entry:', err);
      res.status(500).send('Error creating time entry');
      return;
    }

    res.status(201).json({ id: results.insertId });
  });
});

// Get all time entries
app.get('/time-entries', (req, res) => {
  const query = 'SELECT * FROM time_entries';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving time entries:', err);
      res.status(500).send('Error retrieving time entries');
      return;
    }

    res.json(results);
  });
});

// Get a specific time entry by ID
app.get('/time-entries/:id', (req, res) => {
  const id = req.params.id;

  const query = 'SELECT * FROM time_entries WHERE id = ?';
  const values = [id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error retrieving time entry:', err);
      res.status(500).send('Error retrieving time entry');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Time entry not found');
      return;
    }

    res.json(results[0]);
  });
});

// Update a specific time entry by ID
app.put('/time-entries/:id', (req, res) => {
    const id = req.params.id;
  const { userId, task, startTime, endTime } = req.body;

  const query = 'UPDATE time_entries SET userId = ?, task = ?, startTime = ?, endTime = ? WHERE id = ?';
  const values = [userId, task, startTime, endTime, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating time entry:', err);
      res.status(500).send('Error updating time entry');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Time entry not found');
      return;
    }

    res.status(200).send('Time entry updated');
    
  });
});

// Delete a specific time entry by ID
app.delete('/time-entries/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM time_entries WHERE id = ?';
  const values = [id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error deleting time entry:', err);
      res.status(500).send('Error deleting time entry');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Time entry not found');
      return;
    }

    res.status(200).send( "Time entry deleted" );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});