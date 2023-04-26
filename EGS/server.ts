/*ejs , mustache , handelbars*/
//npm install @types/ejs  ejs
//npm install @types/mustache mustache
//npm install @type/handelbars handelbars



import express,{Request,Response} from "express";
// import ejs from "ejs";
import mustacheExpress from "mustache-express";
import Handlebars from "handlebars";



const app:express.Application = express()

const hostname :string = "127.0.0.1";
const port:number = 8080;



// app.set("view engine","ejs");

// app.engine("mustache",mustacheExpress());
// app.set("view engine","mustache")

app.engine("Handlebars",handlebars());
app.set("view engine","Handlebars");

// app.get("/",(req:Request,res:Response)=>{
//     let model={x:1000,y:20};
//     res.render("index",model)
// });

// app.get("/login",(req:Request,res:Response)=>{
//     let model={uname:"qode",upwd:"qoude@123"};
//     res.render("login",model)
// })

app.get("/student",(req:Request,res:Response)=>{
    let model={
        studentId:"S011",
        studentName:"Ramesh",
        studentMarks:40,
        subjects:[
            {name:"math",marks:"54"},
            {name:"science",marks:"53"},
            {name:"english",marks:"55"},
        ],

        
    };
    res.render("student",model);
})



// app.get("/",(req,res)=>{
//     res.json({"msg":"welcome to express"})
// })

app.listen(port,hostname,()=>{
    console.log(`Server started at http://${hostname}:${port}`);
});






































// const app:express.Application=express();

// app.use(express.json());

// dotenv.config({
//     path:"./.env"
// });

// const port :number|undefined=Number(process.env.EXPRESS_PORT)||9000;
// // const dbUrl:string|undefined=process.env.EXPRESS_MONGODB_URL;
// // const dbName:string|undefined=process.env.EXPRESS_MONGODB_DB_NAME;


// app.get("/",(request:express.Request,response:express.Response)=>{
//     response.status(200)
//     response.json({
//         msg:"Welcome to  express "
//     });
// });





// if(port&&dbUrl&&dbName){
//     app.listen(port,()=>{
//         if(dbUrl&&dbName){
//             DBUtil.connectToDB(dbUrl,dbName).then((dbResponse)=>{
//                 console.log(dbResponse);
//             },(error)=>{
//                 console.error(error);
//                 process.exit(0);
//             })
//         }
//         console.log(`server started at ${port}`);
//     })
// }
