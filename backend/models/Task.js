import mongoose from 'mongoose';

export const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a task title'],
            trim: true,
        },
        description: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Done'],
            default: 'To Do',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        dueDate: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model("Task", taskSchema);
