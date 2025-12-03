import { Layers } from "lucide-react";
import TaskBoard from "./components/TaskBoard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Voice Task Manager</h1>
      </div>

      <TaskBoard />
    </div>
  );
}