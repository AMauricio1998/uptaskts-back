import type { Request, Response } from "express";
import Project from "../models/Proyect";

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({});
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

            res.json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        
        try {
            await project.save();
            res.send("Proyecto creado correctamente");
        } catch (error) {
            console.log(error);
        }
    }

    static updatedProject = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            if(!project) {
                const error = new Error('Proyecto no valido');
                return res.status(404).json({ error: error.message });
            }

            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;
            await project.save();

            res.send("Projecto Actualizado");
        } catch (error) {
            console.log(error);
        }
    }
    
    static deleteProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            if(!project) {
                const error = new Error('Proyecto no valido');
                return res.status(404).json({ error: error.message });
            }

            await project.deleteOne();
            res.send("Proyecto eliminado");
        } catch (error) {
            console.log(error);
        }
    }
}