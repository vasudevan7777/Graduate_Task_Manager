import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logoutUser } from './firebase';
import Login from './components/Login';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100/70 via-slate-50 to-blue-100/60 flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
        <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="font-medium">Loading application state...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100/60 via-slate-50 to-blue-100/60 text-slate-800 flex flex-col items-center py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative ambient background glowing shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl pointer-events-none"></div>

      {!user ? (
        <div className="w-full max-w-md my-auto relative z-10">
          <Login />
        </div>
      ) : (
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-100/80 border border-slate-200/80 p-5 sm:p-8 my-auto relative z-10">
          {/* Header Section */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-150 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Graduate Task Manager
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Streamlined Task Management
              </p>
            </div>

            {/* Profile Area */}
            <div className="flex items-center justify-between sm:justify-end gap-3 bg-slate-50/90 p-2 sm:p-1.5 sm:pl-3 rounded-xl border border-slate-200/70 shrink-0">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User Profile'}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden max-w-[130px] sm:max-w-[150px]">
                  <h2 className="font-semibold text-slate-800 text-xs truncate leading-tight">
                    {user.displayName || 'Authenticated User'}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate leading-tight">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs px-2.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                Sign out
              </button>
            </div>
          </header>

          {/* Core App View */}
          <main>
            <AddTaskForm user={user} />
            <TaskList user={user} />
          </main>
        </div>
      )}
    </div>
  );
}
