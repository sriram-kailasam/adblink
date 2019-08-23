import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { UploadController } from "./upload_controller";
import { FSUploadService } from "./upload_service";

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const uploadService = new FSUploadService();
const uploadController = new UploadController(uploadService);

app.use("/api/upload", uploadController.register());

const port = +process.env.PORT;
app.listen(port, () => {
    console.log("Server started on port", port);
});
