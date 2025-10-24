import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { BookOpen, Clock, Star, Users, Search } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [selectedLevel]);

  const loadCourses = async () => {
    try {
      const params = {};
      if (selectedLevel) params.level = selectedLevel;
      const data = await coursesAPI.getAll(params);
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les cours",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour vous inscrire",
      });
      navigate('/login');
      return;
    }

    setEnrolling(courseId);
    try {
      await enrollmentsAPI.enroll(courseId);
      toast({
        title: "Inscription réussie!",
        description: "Vous êtes maintenant inscrit à ce cours",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.response?.data?.detail || "Impossible de s'inscrire au cours",
      });
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-lg">Chargement des cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Nos Cours</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos programmes de formation en ophtalmologie conçus par des experts
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === '' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('')}
            >
              Tous
            </Button>
            <Button
              variant={selectedLevel === 'Débutant' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('Débutant')}
            >
              Débutant
            </Button>
            <Button
              variant={selectedLevel === 'Intermédiaire' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('Intermédiaire')}
            >
              Intermédiaire
            </Button>
            <Button
              variant={selectedLevel === 'Avancé' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('Avancé')}
            >
              Avancé
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{course.enrolled_count} étudiants inscrits</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    <span className="text-sm font-semibold">{course.rating}/5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-3xl font-bold text-teal-600">{course.price}€</span>
                  </div>
                  <Button
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrolling === course._id}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                  >
                    {enrolling === course._id ? 'Inscription...' : 'S\'inscrire'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Aucun cours trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};
