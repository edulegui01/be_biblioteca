import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import { specs } from './src/app/config/swagger.js';
import swaggerUi from 'swagger-ui-express';

import userRouter from './src/app/routes/user.route.js'
import bookRouter from './src/app/routes/book.route.js'
const app = express(); 

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/users', userRouter)
app.use('/api/books', bookRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});







