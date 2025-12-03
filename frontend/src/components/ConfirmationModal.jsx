import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    const confirmButtonRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => confirmButtonRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in fade-in zoom-in duration-200">

                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
                    >
                        Delete Task
                    </button>
                </div>
            </div>
        </div>
    );
}