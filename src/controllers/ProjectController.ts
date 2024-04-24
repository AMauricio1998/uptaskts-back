import type { Request, Response } from "express";
import Project from "../models/Proyect";

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user?.id } },
                    { team: { $in: req.user?.id }}
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error);
        }
    }
    
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id).populate('tasks').exec();

            if(!project) {
                const error = new Error('Proyecto no valido');
                return res.status(404).json({ error: error.message });
            }

            if(project.manager.toString() !== req.user?._id.toString() && !project.team.includes(req.user?._id)) {
                const error = new Error('No autorizado');
                return res.status(404).json({ error: error.message });
            }

            res.json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        project.manager = req.user?._id;

        try {
            await project.save();
            res.send("Proyecto creado correctamente");
        } catch (error) {
            console.log(error);
        }
    }

    static updatedProject = async (req: Request, res: Response) => {

        try {
            req.project.projectName = req.body.projectName;
            req.project.clientName = req.body.clientName;
            req.project.description = req.body.description;
            await req.project.save();

            res.send("Projecto Actualizado");
        } catch (error) {
            console.log(error);
        }
    }
    
    static deleteProjectById = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne();
            res.send("Proyecto eliminado");
        } catch (error) {
            console.log(error);
        }
    }
}