import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminCampus = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadCampuses();
  }, [isAdmin, navigate]);

  const loadCampuses = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/campuses`);
      setCampuses(response.data);
    } catch (error) {
      console.error('Error loading campuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingCampus) {
        await axios.put(
          `${BACKEND_URL}/api/campuses/${editingCampus._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: "Campus mis à jour",
          description: "Le campus a été modifié avec succès",
        });
      } else {
        await axios.post(
          `${BACKEND_URL}/api/campuses`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: "Campus créé",
          description: "Le nouveau campus a été ajouté avec succès",
        });
      }
      setDialogOpen(false);
      resetForm();
      loadCampuses();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.detail || "Une erreur est survenue",
      });
    }
  };

  const handleEdit = (campus) => {
    setEditingCampus(campus);
    setFormData({
      name: campus.name,
      location: campus.location,
      image: campus.image,
      description: campus.description
    });
    setDialogOpen(true);
  };

  const handleDelete = async (campusId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce campus?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BACKEND_URL}/api/campuses/${campusId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Campus supprimé",
        description: "Le campus a été supprimé avec succès",
      });
      loadCampuses();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le campus",
      });
    }
  };

  const resetForm = () => {
    setEditingCampus(null);
    setFormData({
      name: '',
      location: '',
      image: '',
      description: ''
    });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Campus</h1>
            <p className="text-gray-600">{campuses.length} campus au total</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Campus
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCampus ? 'Modifier le Campus' : 'Nouveau Campus'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du campus</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Campus México"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="Mexico City, Roma"
                  />
                </div>
                <div>
                  <Label htmlFor="image">URL de l'image</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                    placeholder="Description du campus..."
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                  >
                    {editingCampus ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campuses.map((campus) => (
            <Card key={campus._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={campus.image}
                  alt={campus.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{campus.name}</h3>
                  <p className="text-teal-200 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {campus.location}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{campus.description}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(campus)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(campus._id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {campuses.length === 0 && (
          <Card className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun campus disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre premier campus
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
