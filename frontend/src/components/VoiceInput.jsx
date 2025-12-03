import React, { useEffect, useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import useSpeechToText from '../hooks/useSpeechToText';
import api from '../api/axios';

export default function VoiceInput({ onTaskParsed }) {
    const { isListening, transcript, startListening } = useSpeechToText();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isListening && transcript) {
            processVoiceCommand(transcript);
        }
    }, [isListening, transcript]);

    const processVoiceCommand = async (text) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/api/tasks/parse-voice', { text });
            onTaskParsed(response.data);
        } catch (error) {
            console.error("AI Parse Error:", error);
            alert("Failed to understand. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={startListening}
            disabled={isListening || isProcessing}
            className={`
        p-2 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-sm
        ${isListening
                    ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-200'
                    : isProcessing
                        ? 'bg-indigo-100 text-indigo-400 cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
      `}
            title="Create with Voice"
        >
            {isProcessing ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <Mic size={20} />
            )}
            <span className="hidden md:inline">
                {isListening ? "Listening..." : isProcessing ? "Thinking..." : "Voice Add"}
            </span>
        </button>
    );
}