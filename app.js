import 'dotenv/config'
import express from 'express';

import userRouter from './src/app/routes/user.route.js'
const app = express(); 

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cors());

app.use('/api/v1/users', userRouter)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







