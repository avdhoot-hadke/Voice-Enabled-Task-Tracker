import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export function TaskColumn({ title, tasks, id, onTaskClick, onDeleteTask }) {
    const handleClick = (task) => {
        onTaskClick(task);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm border min-h-[500px]">
            <h2 className="font-semibold text-gray-600 mb-4 flex justify-between">
                {title}
                <span className="bg-gray-200 px-2 py-0.5 rounded-full text-sm">
                    {tasks.length}
                </span>
            </h2>

            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`rounded-xl transition-colors min-h-[500px] p-1
              ${snapshot.isDraggingOver
                                ? "bg-indigo-50 border-2 border-dashed border-indigo-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                index={index}
                                onClick={() => handleClick(task)}
                                onDeleteTask={onDeleteTask}
                            />
                        ))}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </div>
    );
}

export default TaskColumn;
