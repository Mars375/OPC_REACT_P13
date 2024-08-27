const express = require('express')
const dotEnv = require('dotenv')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('./swagger.yaml')
const dbConnection = require('./database/connection')
const mongoose = require('mongoose');

dotEnv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Connect to the database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Handle CORS issues
const allowedOrigins = [
  'https://argent-bank-chi.vercel.app',
  'https://argent-bank-mars375s-projects.vercel.app',
  'https://argent-bank-git-main-mars375s-projects.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'] // En-têtes exposés
};

app.use(cors(corsOptions));

// Request payload middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handle custom routes
app.use('/api/v1/user', require('./routes/userRoutes'))

// API Documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

// Test database connection endpoint
app.get('/test-db', async (req, res) => {
  try {
    const result = await mongoose.connection.db.admin().ping();
    res.send('Database connection is working: ' + JSON.stringify(result));
  } catch (err) {
    res.status(500).send('Database connection failed: ' + err.message);
  }
});

app.get('/', (req, res, next) => {
  res.send('Hello from my Express server v2!')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})