import { Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import React from "react";

export default React.memo(function TaskCard({ task, index, onClick, onDeleteTask }) {

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}

                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1
                    }}

                    className={`bg-white p-4 relative rounded-lg shadow-sm border cursor-pointer transition
                        ${snapshot.isDragging ? "shadow-xl ring-2 ring-indigo-300" : "hover:shadow-md"}
                    `}
                >
                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task._id);
                        }}
                        className="absolute top-3 right-3 p-1.5 text-gray-800 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer group-hover:opacity-100 transition-all"
                        title="Delete Task"
                    >
                        <Trash2 size={16} />
                    </button>

                    <div className="flex justify-between items-center mt-3">
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${task.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                        >
                            {task.priority}
                        </span>

                        {task.dueDate && (
                            <span className="text-xs text-gray-400">
                                {new Date(task.dueDate).toLocaleDateString("en-GB")}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
});