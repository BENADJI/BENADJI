import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentsAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'student') {
      navigate('/');
      return;
    }
    loadEnrollments();
  }, [user, navigate]);

  const loadEnrollments = async () => {
    try {
      const data = await enrollmentsAPI.getMyCourses();
      setEnrollments(data);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.enrollment.progress >= 100).length;
  const inProgressCourses = enrollments.filter(e => e.enrollment.progress > 0 && e.enrollment.progress < 100).length;
  const averageProgress = enrollments.length > 0
    ? enrollments.reduce((sum, e) => sum + e.enrollment.progress, 0) / enrollments.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Tableau de Bord</h1>
          <p className="text-gray-600">Bienvenue, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cours Inscrits</p>
                <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Cours</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressCourses}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terminés</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progression Moyenne</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round(averageProgress)}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Cours</h2>
          {enrollments.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vous n'êtes inscrit à aucun cours
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez votre parcours d'apprentissage en vous inscrivant à nos cours
              </p>
              <Button
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
              >
                Explorer les Cours
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map(({ enrollment, course }) => (
                <Card key={enrollment._id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration}</span>
                        <span className="mx-2">•</span>
                        <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                          {course.level}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-semibold text-teal-600">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                      {enrollment.progress >= 100 && (
                        <div className="mt-3 flex items-center text-green-600">
                          <Award className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">Cours terminé!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
