import express ,{Request,Response} from 'express';
import 'dotenv/config';
import cors from 'cors';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';

const app = express();
const PORT = 3000;

const corsOptions = {
      origin : process.env.TRUSTED_ORIGINS?.split(',') || [],
      credentials : true,
}
app.use(cors(corsOptions));

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json({limit:'50mb'}));

app.get('/',(req:Request,res:Response)=>{
      res.send('Server is Live!');
})

app.use('/api/user',userRouter);
app.use('/api/project',projectRouter);

app.listen(PORT,()=>{
      console.log(`Server is running on http://localhost:${PORT}`);
})