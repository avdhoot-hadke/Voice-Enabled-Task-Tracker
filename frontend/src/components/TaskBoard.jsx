import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import { fetchTasks, updateTask, addTask, deleteTask } from "../features/tasks/taskSlice.js";
import TaskColumn from "../components/TaskColumn";
import TaskFormModal from "../components/TaskFormModal";
import { moveTaskOptimistically } from "../features/tasks/taskSlice.js";
import { LayoutGrid, List, Search, Filter, CheckCircle2, Calendar } from "lucide-react";
import TaskListView from "../components/TaskList.jsx";
import { isToday, isThisWeek, isPast, parseISO, isFuture } from "date-fns";
import ConfirmationModal from "./ConfirmationModal.jsx";
import VoiceInput from "./VoiceInput.jsx";

export default function TaskBoard() {
    const dispatch = useDispatch();
    const { items: tasks, status, error } = useSelector((state) => state.tasks);

    const [viewMode, setViewMode] = useState("board");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dueDateFilter, setDueDateFilter] = useState("All");


    useEffect(() => {
        if (status === "idle") dispatch(fetchTasks());
    }, [status, dispatch]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { draggableId, destination, source } = result;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }
        if (source.droppableId !== destination.droppableId) {
            dispatch(moveTaskOptimistically({
                id: draggableId,
                newStatus: destination.droppableId
            }));

            dispatch(updateTask({
                id: draggableId,
                updates: { status: destination.droppableId }
            }));
        }
    };

    const handleCreateClick = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (taskId) => {
        const task = tasks.find(t => t._id === taskId);
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            dispatch(deleteTask(taskToDelete._id));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleTaskClick = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    }

    const handleFormSubmit = (formData) => {
        if (editingTask && editingTask._id) {
            dispatch(updateTask({ id: editingTask._id, updates: formData }));
        } else {
            dispatch(addTask(formData));
        }
    };

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
        const matchesStatus = statusFilter === "All" || t.status === statusFilter;

        let matchesDate = true;
        if (dueDateFilter !== "All" && t.dueDate) {
            const date = parseISO(t.dueDate);

            if (dueDateFilter === "Today") matchesDate = isToday(date);
            else if (dueDateFilter === "This Week") matchesDate = isThisWeek(date, { weekStartsOn: 1 });
            else if (dueDateFilter === "Overdue") matchesDate = isPast(date) && !isToday(date);
            else if (dueDateFilter === "Future") matchesDate = isFuture(date);
        } else if (dueDateFilter !== "All" && !t.dueDate) {
            matchesDate = false;
        }

        return matchesSearch && matchesPriority && matchesStatus && matchesDate;
    });

    const columns = {
        "To Do": filteredTasks.filter((t) => t.status === "To Do"),
        "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
        "Done": filteredTasks.filter((t) => t.status === "Done"),
    };

    const handleVoiceParsed = (parsedTask) => {
        setEditingTask(parsedTask);
        setIsModalOpen(true);
    };

    if (status === "failed") return <div className="text-red-500">Error: {error}</div>;

    return (
        <div>
            {/* navbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:bg-slate-200 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                        {/* priority */}
                        <div className="relative min-w-[140px]">
                            <select
                                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-sm focus:bg-slate-200 outline-none cursor-pointer"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Status */}
                        <div className="relative min-w-[140px]">
                            <select
                                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-sm focus:bg-slate-200 outline-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            <CheckCircle2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Date */}
                        <div className="relative min-w-[140px]">
                            <select
                                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-sm focus:bg-slate-200 outline-none cursor-pointer"
                                value={dueDateFilter}
                                onChange={(e) => setDueDateFilter(e.target.value)}
                            >
                                <option value="All">All Dates</option>
                                <option value="Today">Due Today</option>
                                <option value="This Week">Due This Week</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Future">Future</option>
                            </select>
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreateClick}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                    + Add Task
                </button>
                <VoiceInput onTaskParsed={handleVoiceParsed} />
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode("board")}
                        className={`p-2 rounded-md transition ${viewMode === "board" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                        title="Board View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {viewMode === "board" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(columns).map(([statusId, list]) => (
                            <TaskColumn
                                key={statusId}
                                id={statusId}
                                title={statusId}
                                tasks={list}
                                onTaskClick={handleTaskClick}
                                onDeleteTask={handleDeleteRequest}
                            />
                        ))}
                    </div>
                </DragDropContext>
            ) : (
                <TaskListView
                    tasks={filteredTasks}
                    onTaskClick={handleTaskClick}
                    onDeleteTask={handleDeleteRequest}
                />)}

            <TaskFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingTask}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
            />
        </div>

    );
}