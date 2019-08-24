import { promises as fs } from "fs";
import * as path from "path";

export interface UploadService {
    upload(filename: string, data: Buffer): Promise<string>;
}

export class FSUploadService implements UploadService {
    async upload(filename: string, data: Buffer): Promise<string> {
        const filePath = path.join(__dirname, "..", "uploads", filename);
        const prefix = "http://192.168.43.226:9000/uploads/";
        await fs.writeFile(filePath, data);
        return prefix + filename;
    }
}
