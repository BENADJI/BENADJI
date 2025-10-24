import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Users as UsersIcon, Search, Shield, User, Trash2, Crown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState({
    manage_courses: false,
    manage_users: false,
    manage_content: false,
    manage_stats: false,
    manage_campus: false,
    view_analytics: false,
    can_delete: false
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadUsers();
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = (user) => {
    setSelectedUser(user);
    setPermissions({
      manage_courses: false,
      manage_users: false,
      manage_content: false,
      manage_stats: false,
      manage_campus: false,
      view_analytics: false,
      can_delete: false
    });
    setDialogOpen(true);
  };

  const handleSavePermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BACKEND_URL}/api/admin/users/${selectedUser._id}/make-admin`,
        permissions,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Utilisateur promu",
        description: `${selectedUser.name} est maintenant administrateur`,
      });
      setDialogOpen(false);
      loadUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de promouvoir l'utilisateur",
      });
    }
  };

  const handleRevokeAdmin = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir révoquer les privilèges admin ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BACKEND_URL}/api/admin/users/${userId}/revoke-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Privilèges révoqués",
        description: "L'utilisateur n'est plus administrateur",
      });
      loadUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de révoquer",
      });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ? Cette action est irréversible.`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BACKEND_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
      loadUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSuperAdmin = currentUser?.role === 'super_admin';

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion Avancée des Utilisateurs</h1>
          <p className="text-gray-600">{users.length} utilisateurs au total</p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-full ${
                    user.role === 'super_admin' ? 'bg-purple-100' :
                    user.role === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {user.role === 'super_admin' ? (
                      <Crown className="w-8 h-8 text-purple-600" />
                    ) : user.role === 'admin' ? (
                      <Shield className="w-8 h-8 text-blue-600" />
                    ) : (
                      <User className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' :
                         user.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                      </span>
                    </div>
                    {user.permissions && (
                      <div className="mt-3 text-xs text-gray-600">
                        <p className="font-semibold mb-1">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(user.permissions).filter(([_, v]) => v).map(([key]) => (
                            <span key={key} className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                              {key.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isSuperAdmin && user._id !== currentUser.id && (
                  <div className="flex flex-col space-y-2 ml-4">
                    {user.role === 'student' && (
                      <Button
                        size="sm"
                        onClick={() => handlePromoteToAdmin(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Promouvoir
                      </Button>
                    )}
                    {user.role === 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeAdmin(user._id)}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        Révoquer
                      </Button>
                    )}
                    {user.role !== 'super_admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Promouvoir {selectedUser?.name} en Administrateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">Sélectionnez les permissions à accorder:</p>
              {Object.entries(permissions).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                    className="w-5 h-5 text-teal-600 rounded"
                  />
                  <span className="text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleSavePermissions}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                >
                  Promouvoir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
          </Card>
        )}
      </div>
    </div>
  );
};
