import { Request, Response, NextFunction, request } from "express";
import Project, { IProyect } from "../models/Proyect";

declare global {
    namespace Express {
        interface Request {
            project: IProyect
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId).exec();

        if(!project) {
            const error = new Error('Proyecto no encontrado');
            return res.status(404).json({ error: error.message });
        }

        req.project = project;

        next();
    } catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}