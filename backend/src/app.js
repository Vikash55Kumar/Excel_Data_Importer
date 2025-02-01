import express from "express";
import cors from "cors"
import path from 'path'
import bodyParser from "body-parser"
const app = express()

app.use(cors({
    origin:[process.env.CORES_ORIGIN || "https://exel-data-importer.netlify.app/"],
    methods: "DELETE, POST, GET, PUT",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials:true
}))

app.use(express.json({limit:"15kb"}))
app.use(express.urlencoded({extended:true, limit:'15kb'}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(bodyParser.json())

const __dirname = path.resolve();

const buildPath = path.join(__dirname, '../../frontend/dist');

app.use(express.static(buildPath)); 

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // Skip static file serving for API routes
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

// routes imported
import sheetRouter from "./routers/sheets.router.js"
import cookieParser from "cookie-parser";

//route decleration
app.use("/api/v1/sheets", sheetRouter)

export {app}