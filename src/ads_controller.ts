import { Db } from "mongodb";
import { Request, Response, Router } from "express";
import { Server } from "socket.io";

export class AdsController {
    constructor(private db: Db, private socketServer: Server) {}
    router = Router();
    updateCounts = (req: Request, res: Response) => {
        const body = req.body.data;
        console.log(body);
    };

    createAd = async (req: Request, res: Response) => {
        let ad = req.body.ad;
        ad.timestamp = Date.now();
        ad.approvalStatus = true;
        ad.modifiedTimestamp = ad.timestamp;

        try {
            const advert = await this.db.collection("ads").insertOne(ad);
            const advertId = advert.insertedId;

            res.json({ success: true, advertId: advertId });
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    getAllAds = async (req: Request, res: Response) => {
        try {
            const ads = await this.db
                .collection("ads")
                .find()
                .toArray();

            res.json({ success: true, adverts: ads });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false });
        }
    };

    getAdsOfCompany = async (req: Request, res: Response) => {
        const companyId = req.params.companyId;

        try {
            const ads = await this.db
                .collection("ads")
                .find({ companyId: companyId })
                .toArray();

            res.json({ success: true, adverts: ads });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false });
        }
    };

    register() {
        this.router.post("/analytics", this.updateCounts);
        this.router.post("/", this.createAd);

        this.router.get("/", this.getAllAds);
        this.router.get("/:companyId", this.getAdsOfCompany);

        return this.router;
    }
}
