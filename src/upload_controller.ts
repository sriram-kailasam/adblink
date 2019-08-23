import { UploadService } from "./upload_service";
import { Request, Response, Router } from "express";

import * as Busboy from "busboy";

export class UploadController {
    router = Router();
    constructor(private uploadService: UploadService) {}

    upload = (req: Request, res: Response) => {
        const busboy = new Busboy({ headers: req.headers });

        busboy.on("file", (fieldname, file, filename) => {
            let chunks: Buffer[] = [];
            let completeData: Buffer;
            file.on("data", (data: Buffer) => {
                chunks.push(data);
            });

            file.on("end", async () => {
                completeData = Buffer.concat(chunks);

                const url = await this.uploadService.upload(
                    filename,
                    completeData
                );

                res.json({
                    success: true,
                    url: url
                });
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
        this.router.post("/", this.upload);

        return this.router;
    }
}
