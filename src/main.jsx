import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import AdminLayout from './routes/admin/AdminLayout';
import AdminLogin from './routes/admin/AdminLogin';
import AdminSignup from './routes/admin/AdminSignup';
import AdminDashboard from './routes/admin/AdminDashboard';
import AdminUsers from './routes/admin/AdminUsers';
import AdminStudents from './routes/admin/AdminStudents';
import AdminInstructors from './routes/admin/AdminInstructors';
import AdminRoute from './routes/admin/AdminRoute';
import ProtectedRoute from './routes/admin/ProtectedRoute';
import { AuthProvider } from './routes/admin/AuthContext';
import AdminForgot from './routes/admin/AdminForgot';
import AdminIndex from './routes/admin/AdminIndex';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminIndex /> },
      { path: 'login', element: <AdminLogin /> },
      { path: 'forgot', element: <AdminForgot /> },
      { path: 'signup', element: <AdminSignup /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'usuarios',
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'alunos',
        element: (
          <ProtectedRoute>
            <AdminStudents />
          </ProtectedRoute>
        ),
      },
      {
        path: 'instrutores',
        element: (
          <ProtectedRoute>
            <AdminInstructors />
          </ProtectedRoute>
        ),
      },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
