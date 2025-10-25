import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TrendingUp, Users, BookOpen, Award, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminStats = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    webinar_listeners: 0,
    virtual_classes: 0,
    key_opinion_leaders: 0,
    subscribers: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadStats();
  }, [isAdmin, navigate]);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_URL}/api/stats`,
        stats,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Statistiques mises à jour",
        description: "Les statistiques de la page d'accueil ont été mises à jour",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour les statistiques",
      });
    } finally {
      setSaving(false);
    }
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Statistiques</h1>
          <p className="text-gray-600">Modifiez les statistiques affichées sur la page d'accueil</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="w-8 h-8 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Modifier les Statistiques</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="webinar_listeners" className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Auditeurs de Webinaires</span>
                </Label>
                <Input
                  id="webinar_listeners"
                  type="number"
                  value={stats.webinar_listeners}
                  onChange={(e) => setStats({ ...stats, webinar_listeners: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="virtual_classes" className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Classes Virtuelles</span>
                </Label>
                <Input
                  id="virtual_classes"
                  type="number"
                  value={stats.virtual_classes}
                  onChange={(e) => setStats({ ...stats, virtual_classes: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="key_opinion_leaders" className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>Leaders d'Opinion Clés</span>
                </Label>
                <Input
                  id="key_opinion_leaders"
                  type="number"
                  value={stats.key_opinion_leaders}
                  onChange={(e) => setStats({ ...stats, key_opinion_leaders: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="subscribers" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Abonnés</span>
                </Label>
                <Input
                  id="subscribers"
                  type="number"
                  value={stats.subscribers}
                  onChange={(e) => setStats({ ...stats, subscribers: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-6 text-lg"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les Modifications'}
              </Button>
            </form>
          </Card>

          <div>
            <Card className="p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Aperçu en Direct</h3>
              <p className="text-gray-600 mb-6">Ces statistiques seront affichées sur la page d'accueil:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <div className="text-3xl font-bold text-teal-600 mb-1">
                    {stats.webinar_listeners.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Auditeurs</p>
                </div>
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="text-3xl font-bold text-cyan-600 mb-1">
                    {stats.virtual_classes}
                  </div>
                  <p className="text-sm text-gray-600">Classes</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {stats.key_opinion_leaders}
                  </div>
                  <p className="text-sm text-gray-600">Experts</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {stats.subscribers.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Abonnés</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Conseil</h3>
              <p className="text-teal-50">
                Mettez à jour ces statistiques régulièrement pour refléter la croissance de votre académie. 
                Des chiffres impressionnants renforcent la crédibilité auprès des nouveaux visiteurs.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
