import { Task } from "../models/task.js"
import { parseTaskFromText } from "../services/aiService.js"

export const getTasks = async (req, res) => {
    try {
        const task = await Task.find().sort({ createdAt: -1 })
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate
        })
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const parseVoiceTask = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "No text provided" });
        }
        const parsedData = await parseTaskFromText(text);
        res.status(200).json({ ...parsedData, transcript: text });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};