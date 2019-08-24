import { UploadService } from "./upload_service";
import { Request, Response, Router } from "express";

import * as path from "path";

import * as Busboy from "busboy";
import { Server } from "socket.io";

export class UploadController {
    router = Router();
    constructor(
        private uploadService: UploadService,
        private socketServer: Server
    ) {}

    upload = (req: Request, res: Response) => {
        const busboy = new Busboy({ headers: req.headers });
        const advertId = req.params.advertId;

        busboy.on("file", (fieldname, file, filename) => {
            let chunks: Buffer[] = [];
            let completeData: Buffer;
            file.on("data", (data: Buffer) => {
                chunks.push(data);
            });

            file.on("end", async () => {
                completeData = Buffer.concat(chunks);

                const url = await this.uploadService.upload(
                    advertId + filename.slice(filename.lastIndexOf(".")),
                    completeData
                );

                res.json({
                    success: true,
                    url: url
                });

                this.socketServer.sockets.emit("new-advert", url);
            });
        });

        busboy.on("error", err => {
            console.error(err);

            res.json({
                success: false
            });
        });

        req.pipe(busboy);
    };

    register() {
        this.router.post("/:advertId", this.upload);

        return this.router;
    }
}
