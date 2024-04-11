import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExist } from "../middleware/task";

const router = Router();

router.get('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.getAllProjects
);

router.post('/', ProjectController.createProject);

router.get('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updatedProject
);

router.delete('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.deleteProjectById
);

/** Routes for task */
router.param('projectId', projectExists);

router.post('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Id no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.getProjectTasks
);

router.param('taskId', taskExist);
router.param('taskId', taskBelongsToProject);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
);

export default router;