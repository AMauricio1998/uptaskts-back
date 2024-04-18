import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Proyect';
import { populate } from 'dotenv';

export class TeamController {
    static findMemberFromEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({ email }).select('_id name email');

        if(!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ message: error.message });
        }

        res.json(user);
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project._id).populate({
            path: 'team',
            select: '_id name email'
        })

        res.json(project.team);
    }
   
    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;

        const user = await User.findById(id).select('_id');

        if(!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ message: error.message });
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya pertenece al equipo');
            return res.status(409).json({ message: error.message });
        }

        req.project.team.push(user._id);
        await req.project.save();

        res.send("Usuario agregado correctamente");
    }
    
    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;

        if(!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no pertenece al equipo');
            return res.status(409).json({ message: error.message });
        }

        req.project.team = req.project.team.filter(team => team.toString() !== userId);

        await req.project.save();

        res.send("Usuario eliminado correctamente");
    }
}