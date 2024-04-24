import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.get('/',
    handleInputErrors,
    ProjectController.getAllProjects
);

router.post('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
);

router.get('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.getProjectById
);

/** Routes for task */
router.param('projectId', projectExists);

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('Id no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updatedProject
);

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProjectById
);

router.post('/:projectId/tasks',
    hasAuthorization,
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
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
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

/** Routes fom team */
router.get('/:projectId/team',
    TeamController.getProjectTeam
)

router.post('/:projectId/team/find',
    body('email').isEmail().withMessage('Email no valido'),
    handleInputErrors,
    TeamController.findMemberFromEmail
)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('Usuario no valido'),
    TeamController.removeMemberById
)

/** Routes for notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Id no válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router;