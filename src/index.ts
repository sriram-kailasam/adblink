import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as path from "path";

import { MongoClient } from "mongodb";

import { UploadController } from "./upload_controller";
import { FSUploadService } from "./upload_service";
import { AdsController } from "./ads_controller";

import { Server } from "socket.io";
import { CompaniesController } from "./companies_controller";

if (process.env.NODE_ENV !== "production") require("dotenv").config();

(async () => {
    const app = express();
    const httpServer = require("http").createServer(app);
    const io: Server = require("socket.io")(httpServer);

    const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log("Connected to database");
    const db = client.db();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cors());

    io.on("connection", socket => {
        socket.on("message", message => {
            console.log("Received:", message);
            socket.emit("message", "Received: " + message);
        });
    });

    const uploadService = new FSUploadService();
    const uploadController = new UploadController(uploadService, io);
    const adsController = new AdsController(db, io);
    const companiesController = new CompaniesController(db);

    app.get("/uploads/:filename", (req, res) => {
        const filename = req.params.filename;

        res.sendFile(path.join(__dirname, "..", "uploads", filename));
    });

    app.use((req, res, next) => {
        console.dir("req received");
        next();
    });
    app.use("/api/upload", uploadController.register());
    app.use("/api/adverts", adsController.register());
    app.use("/api/companies", companiesController.register());

    const port = +process.env.PORT;
    httpServer.listen(port, () => {
        console.log("Server started on port", port);
    });
})();
