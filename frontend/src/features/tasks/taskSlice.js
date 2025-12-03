import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await api.get('/api/tasks');
    return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updates }) => {
    const response = await api.put(`/api/tasks/${id}`, updates);
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
    await api.delete(`/api/tasks/${id}`);
    return id;
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        moveTaskOptimistically: (state, action) => {
            const { id, newStatus } = action.payload;
            const taskIndex = state.items.findIndex((t) => t._id === id);
            if (taskIndex !== -1) {
                state.items[taskIndex].status = newStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(addTask.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.items.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })

            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(task => task._id !== action.payload);
            });
    },
}
);

export const { moveTaskOptimistically } = taskSlice.actions;

export default taskSlice.reducer;