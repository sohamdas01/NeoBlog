// import 'dotenv/config';
// import {app} from './app.js';
// import connectDB from './db/db.js';
// import path from 'path';
//  await connectDB()

// const __dirname=path.resolve();
// app.use(express.static(path.join(__dirname,'./frontend/dist')))
// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'frontend','dist','index.html'))
// })

// const PORT=process.env.PORT || 3000;

// app.listen(PORT,()=>{
//     console.log('Server is running on port:',PORT)
// })


import 'dotenv/config';
import express from 'express';
import { app } from './app.js';
import connectDB from './db/db.js';
import path from 'path';

const __dirname = path.resolve();

// connect DB
await connectDB();

// serve static frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port:', PORT);
});
