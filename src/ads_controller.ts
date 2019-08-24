import { Db } from "mongodb";
import { Request, Response, Router } from "express";

export class AdsController {
    constructor(private db: Db) {}
    router = Router();
    updateCounts = (req: Request, res: Response) => {
        const body = req.body.data;
        console.log(body);
    };

    updateAd = async (req: Request, res: Response) => {
        let ad = req.body.ad;
        ad.timestamp = Date.now();
        ad.approvalStatus = true;
        ad.modifiedTimestamp = ad.timestamp;

        try {
            await this.db.collection("ads").insertOne(ad);
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    register() {
        this.router.post("/analytics", this.updateCounts);
        this.router.post("/", this.updateAd);

        return this.router;
    }
}
