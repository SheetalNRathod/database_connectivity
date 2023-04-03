
import express, {Application} from 'express';
// import userRouter from "./router/userRouter";
import dotenv from 'dotenv';
import userRouter from './Users/UserRouter';
import { DBUtil } from './Util/DBUtil';
const app: Application = express();
dotenv.config({
    path: "./.env"
});
// const port:string|Number = process.env.PORT ||9000;
const dbUrl:string | undefined = process.env.MONGO_DB_CLOUD_URL;
const dbName:string| undefined = process.env.MONGO_DB_DATABASE;
console.log(`${process.env.EXPRESS_HOST_NAME}:${process.env.EXPRESS_PORT}`)

const hostName: string | undefined = process.env.EXPRESS_HOST_NAME;
const port: string | undefined = process.env.EXPRESS_PORT;

app.use(express.json());

app.use('/api/users', userRouter);

if (port && hostName)
    app.listen(Number(port),  () => {
        if (dbUrl && dbName){
            DBUtil.connectToDB(dbUrl,dbName).then((dbResponse)=>{
                console.log (dbResponse);
            }).catch((error)=>{
                console.error(error);
                process.exit(0);
            });
        }
        console.log(`Express Server is started at http://${hostName}:${port}`);
    });

