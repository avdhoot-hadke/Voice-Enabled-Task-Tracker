import { useState, useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";

export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const titleRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        status: "To Do"
    });

    const derivedData = useMemo(() => {
        if (!initialData) {
            return {
                title: "",
                description: "",
                status: "To Do",
                priority: "Medium",
                dueDate: "",
            };
        }

        const formattedDate = initialData.dueDate
            ? new Date(initialData.dueDate).toISOString().split("T")[0]
            : "";

        return {
            title: initialData.title || "",
            description: initialData.description || "",
            status: initialData.status || "",
            priority: initialData.priority || "Medium",
            dueDate: formattedDate,
        };
    }, [initialData]);

    useEffect(() => {
        setFormData(derivedData);
    }, [derivedData]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.dataset.close) onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { title, description, status, priority, dueDate } = formData;
        onSubmit({ title, description, status, priority, dueDate });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            data-close
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            ref={titleRef}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:bg-slate-50 outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Fix Navigation Bug"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:bg-slate-50 outline-none h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add details..."
                        />
                    </div>

                    {/* Priority & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg  focus:bg-slate-50 outline-none bg-white"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:bg-slate-50 outline-none"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:bg-slate-50 outline-none"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                        >
                            {initialData ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
