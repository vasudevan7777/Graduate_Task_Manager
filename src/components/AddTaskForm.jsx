import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddTaskForm({ user }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task title.');
      return;
    }

    if (!user || !user.uid) {
      setError('User not authenticated.');
      return;
    }

    const taskTitleToSave = trimmedTitle;

    // 1. Instantly reset title so input clears immediately
    setTitle('');
    setError(null);

    // 2. Keep focus on input for typing next task immediately
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // 3. Perform Firestore write using local cache latency-compensation (instant 0ms UX)
    addDoc(collection(db, 'tasks'), {
      title: taskTitleToSave,
      status: 'Planned',
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }).catch((err) => {
      console.error('Error adding task:', err);
      setError(err.message || 'Failed to create task. Please try again.');
    });
  };

  return (
    <div className="mb-7 bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-200/80">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        Add a new task
      </h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-3 border border-red-200 font-medium flex items-center gap-1.5">
            <span>⚠️</span> {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            placeholder="What needs to be done?"
            className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white placeholder-slate-400 text-slate-900 transition-all shadow-2xs"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-5 py-2.5 text-sm rounded-lg shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
