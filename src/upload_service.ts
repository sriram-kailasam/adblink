import { promises as fs } from "fs";
import { Storage } from "@google-cloud/storage";
import * as path from "path";

export interface UploadService {
    upload(filename: string, data: Buffer): Promise<string>;
}

export class FSUploadService implements UploadService {
    async upload(filename: string, data: Buffer): Promise<string> {
        const filePath = path.join(__dirname, "..", "uploads", filename);
        await fs.writeFile(filePath, data);
        return filePath;
    }
}

// export class CloudStorageService implements UploadService {

//     async upload(filename: string, data: Buffer): Promise<string> {}
// }
