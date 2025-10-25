import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppChat } from "./components/WhatsAppChat";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Courses } from "./pages/Courses";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminUserManagement } from "./pages/AdminUserManagement";
import { AdminCampus } from "./pages/AdminCampus";
import { AdminStats } from "./pages/AdminStats";
import { AdminMessages } from "./pages/AdminMessages";
import { StudentDashboard } from "./pages/StudentDashboard";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/admin/user-management" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminUserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/courses" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminCourses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/stats" element={<ProtectedRoute adminOnly><div className="pt-32 pb-20 px-4 text-center"><h1 className="text-4xl font-bold">Gestion des Statistiques - Bient\u00f4t disponible</h1></div></ProtectedRoute>} />
          </Routes>
          <Footer />
          <WhatsAppChat />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
