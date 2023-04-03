import express, {Application} from 'express';
// import userRouter from "./router/userRouter";
import dotenv from 'dotenv';
import userRouter from './Users/UserRouter';

const app: Application = express();
dotenv.config({
    path: "./.env"
});
// const port:string|Number = process.env.PORT ||9000;

console.log(`${process.env.EXPRESS_HOST_NAME}:${process.env.EXPRESS_PORT}`)

const hostName: string | undefined = process.env.EXPRESS_HOST_NAME;
const port: string | undefined = process.env.EXPRESS_PORT;

app.use(express.json());

app.use('/api/users', userRouter);

if (port && hostName) {
    app.listen(Number(port), hostName, () => {
        console.log(`Express Server is started at http://${hostName}:${port}`);
    });
}