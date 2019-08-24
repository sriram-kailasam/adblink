import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { MongoClient } from "mongodb";

import { UploadController } from "./upload_controller";
import { FSUploadService } from "./upload_service";
import { AdsController } from "./ads_controller";

import { Server } from "socket.io";

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

    const uploadService = new FSUploadService();
    const uploadController = new UploadController(uploadService);
    const adsController = new AdsController(db);

    app.use("/api/upload", uploadController.register());
    app.use("/api/adverts", adsController.register());

    io.on("connection", socket => {
        socket.on("message", message => {
            console.log("Received:", message);
            socket.emit("message", "Received: " + message);
        });
    });

    const port = +process.env.PORT;
    httpServer.listen(port, () => {
        console.log("Server started on port", port);
    });
})();
