import type { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Proyect";

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);

            await Promise.allSettled([ task.save(), req.project.save() ]);

            res.send("Tarea almacenada correctamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.json(req.task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save();

            res.send("Tarea actualizada ccorrectamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString());

            await Promise.allSettled([Task.deleteOne(), req.project.save()]);

            res.send("Tarea eliminada ccorrectamente");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body

            req.task.status = status;
            await req.task.save();

            res.send("Tarea actualizada");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}