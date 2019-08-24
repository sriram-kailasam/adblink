import { Db } from "mongodb";
import { Request, Response, Router } from "express";

export class CompaniesController {
    constructor(private db: Db) {}
    router = Router();
    createCompany = async (req: Request, res: Response) => {
        const company = req.body.company;

        company.timestamp = Date.now();
        company.moodifiedTimestamp = company.timestamp;

        try {
            await this.db.collection("companies").insertOne(company);
            res.status(201).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false });
        }
    };

    getCompany = async (req: Request, res: Response) => {
        const company = await this.db
            .collection("companies")
            .findOne({ companyId: req.params.companyId });

        if (company == null) {
            res.status(404).json({
                success: false,
                error: "Company not found"
            });
        } else {
            res.json({ success: true, company: company });
        }
    };

    getAllCompanies = async (req: Request, res: Response) => {
        try {
            const companies = await this.db
                .collection("companies")
                .find()
                .toArray();

            res.json({ success: true, companies: companies });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false });
        }
    };

    register() {
        this.router.post("/", this.createCompany);
        this.router.get("/:companyId", this.getCompany);
        this.router.get("/", this.getAllCompanies);

        return this.router;
    }
}
