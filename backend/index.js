import 'dotenv/config';
import {app} from './app.js';
import connectDB from './db/db.js';

 await connectDB()

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log('Serveer is running on port:',PORT)
})


