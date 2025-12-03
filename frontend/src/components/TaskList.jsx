import React from "react";
import { Clock, MoreVertical, Edit, Trash2 } from "lucide-react";

export default function TaskListView({ tasks, onTaskClick, onDeleteTask }) {


    const getPriorityColor = (p) => {
        switch (p) {
            case "High": return "text-red-600 bg-red-50";
            case "Medium": return "text-amber-600 bg-amber-50";
            case "Low": return "text-blue-600 bg-blue-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case "To Do": return "bg-gray-200 text-gray-700";
            case "In Progress": return "bg-indigo-100 text-indigo-700";
            case "Done": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (tasks.length === 0) {
        return <div className="text-center py-10 text-gray-500">No tasks found matching your filters.</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                        <th className="p-4 w-1/2">Title</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => (
                        <tr
                            key={task._id}
                            onClick={() => onTaskClick(task)}
                            className="hover:bg-gray-50 transition cursor-pointer group"
                        >
                            <td className="p-4 font-medium text-gray-800">
                                {task.title}
                                {task.description && (
                                    <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{task.description}</p>
                                )}
                            </td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </td>
                            <td className="p-4 text-gray-500 text-sm">
                                {task.dueDate ? (
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <span className="text-gray-300">-</span>
                                )}
                            </td>
                            <td className="p-4 text-right relative">
                                <div className="flex relative items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteTask(task._id)
                                        }
                                        }
                                        className="p-2 absolute cursor-pointer hover:bg-red-50 text-red-500 rounded-lg transition"
                                        title="Delete Task"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}