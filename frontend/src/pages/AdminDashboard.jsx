import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BookOpen, GraduationCap, UserCheck, LogOut } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadStats();
  }, [isAdmin, navigate]);

  const loadStats = async () => {
    try {
      const data = await adminAPI.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de Bord Admin</h1>
            <p className="text-gray-600">Bienvenue, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cours</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_courses || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inscriptions</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_enrollments || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Étudiants</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_students || 0}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg">
                <UserCheck className="w-8 h-8 text-teal-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/admin/courses')}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gérer les Cours</h3>
                <p className="text-sm text-gray-600">Créer, modifier et supprimer des cours</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/admin/user-management')}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gérer les Utilisateurs</h3>
                <p className="text-sm text-gray-600">Promouvoir, révoquer permissions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/admin/stats')}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Statistiques du Site</h3>
                <p className="text-sm text-gray-600">Mettre à jour les statistiques</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/admin/campus')}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gérer les Campus</h3>
                <p className="text-sm text-gray-600">Ajouter et modifier campus</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/admin/messages')}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Messages de Contact</h3>
                <p className="text-sm text-gray-600">Voir et gérer les messages</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/admin/theme')}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personnaliser le Thème</h3>
                <p className="text-sm text-gray-600">Modifier couleurs et contenu</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
