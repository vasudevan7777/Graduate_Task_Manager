import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function TaskItem({ task }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;

    setIsUpdating(true);
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Planned':
        return 'bg-amber-50 text-amber-800 border-amber-300 focus:ring-amber-400 hover:bg-amber-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-300 focus:ring-blue-400 hover:bg-blue-100';
      case 'Complete':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-400 hover:bg-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-300 focus:ring-slate-400';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-100">
          {task.status === 'Complete' ? (
            <span className="text-emerald-600 font-bold text-xs">✓</span>
          ) : task.status === 'In Progress' ? (
            <span className="text-blue-600 font-bold text-[10px]">⏳</span>
          ) : (
            <span className="text-amber-600 font-bold text-[10px]">📋</span>
          )}
        </div>
        <span
          className={`font-medium text-sm break-words text-slate-800 leading-snug ${
            task.status === 'Complete' ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </span>
      </div>

      <div className="flex items-center justify-end shrink-0">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 transition-all cursor-pointer ${getStatusBadgeStyle(
            task.status
          )} ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
        >
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
      </div>
    </div>
  );
}
