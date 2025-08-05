const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/api/routes/auth.routes');
const interviewRoutes = require('./src/api/routes/interview.routes');
const testRoutes = require('./src/api/routes/test.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Main function to connect to DB and start the server ---
const startServer = async () => {
  try {
    // Wait for the database to connect
    await connectDB();

    // Start listening for requests only after the DB is connected
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/tests', testRoutes);

app.get('/', (req, res) => {
    res.send('Your communication coach server is running!');
});


// --- Call the function to start the server ---
startServer();