import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import TaskItem from './TaskItem';

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort newest tasks first
        fetchedTasks.sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
          return tB - tA;
        });

        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore task subscription error:', err);
        setError('Failed to load tasks from database. Please check your network or Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Summary Metrics
  const totalCount = tasks.length;
  const plannedCount = tasks.filter((t) => t.status === 'Planned').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completeCount = tasks.filter((t) => t.status === 'Complete').length;

  // Completion Progress percentage
  const progressPercent = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
        <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 text-center font-medium">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* 5. Summary Cards */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="bg-slate-100/90 p-2.5 rounded-xl border border-slate-200/80 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total</span>
          <span className="text-base sm:text-lg font-extrabold text-slate-800">{totalCount}</span>
        </div>
        <div className="bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/80 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Planned</span>
          <span className="text-base sm:text-lg font-extrabold text-amber-900">{plannedCount}</span>
        </div>
        <div className="bg-blue-50/90 p-2.5 rounded-xl border border-blue-200/80 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider block">In Progress</span>
          <span className="text-base sm:text-lg font-extrabold text-blue-900">{inProgressCount}</span>
        </div>
        <div className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200/80 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Complete</span>
          <span className="text-base sm:text-lg font-extrabold text-emerald-900">{completeCount}</span>
        </div>
      </div>

      {/* 6. Completion Progress Section */}
      <div className="mb-6 p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="text-slate-600">Overall Progress</span>
          <span className="text-slate-700">
            {completeCount} of {totalCount} {totalCount === 1 ? 'task' : 'tasks'} completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 7. Task List Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span>Your Tasks</span>
          <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
          </span>
        </h2>
      </div>

      {/* 8. Task Cards or 9. Empty State */}
      {tasks.length === 0 ? (
        <div className="py-10 px-4 text-center bg-slate-50/60 border border-dashed border-slate-300 rounded-xl">
          <h3 className="text-sm font-bold text-slate-700 mb-1">No tasks yet</h3>
          <p className="text-xs text-slate-500">Create your first task above.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
