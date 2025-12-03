import express from "express"
import { createTask, deleteTask, getTasks, updateTask, parseVoiceTask } from "../controllers/taskcontroller.js";

export const router = express.Router();

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

router.post('/parse-voice', parseVoiceTask);

