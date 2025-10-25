import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Mail, MailOpen, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminMessages = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadMessages();
  }, [isAdmin, navigate, filter]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${BACKEND_URL}/api/contact/messages`
        : `${BACKEND_URL}/api/contact/messages?status_filter=${filter}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_URL}/api/contact/messages/${messageId}/status?new_status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Statut mis à jour",
        description: "Le statut du message a été modifié",
      });
      loadMessages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BACKEND_URL}/api/contact/messages/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });
      loadMessages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le message",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  const newCount = messages.filter(m => m.status === 'new').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages de Contact</h1>
          <p className="text-gray-600">{messages.length} messages au total</p>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Tous ({messages.length})
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'outline'}
            onClick={() => setFilter('new')}
          >
            Nouveaux ({newCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            onClick={() => setFilter('read')}
          >
            Lus ({readCount})
          </Button>
          <Button
            variant={filter === 'replied' ? 'default' : 'outline'}
            onClick={() => setFilter('replied')}
          >
            Répondus ({repliedCount})
          </Button>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message._id} className={`p-6 ${message.status === 'new' ? 'border-l-4 border-teal-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {message.status === 'new' ? (
                      <Mail className="w-5 h-5 text-teal-600" />
                    ) : (
                      <MailOpen className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="text-lg font-bold text-gray-900">{message.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      message.status === 'new' ? 'bg-teal-100 text-teal-800' :
                      message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {message.status === 'new' ? 'Nouveau' :
                       message.status === 'read' ? 'Lu' : 'Répondu'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">{message.name}</span> ({message.email})
                    <span className="mx-2">•</span>
                    {new Date(message.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {message.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(message._id, 'read')}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Marquer lu
                    </Button>
                  )}
                  {message.status === 'read' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(message._id, 'replied')}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Répondu
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMessage(message._id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {messages.length === 0 && (
          <Card className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun message
            </h3>
            <p className="text-gray-600">
              Les messages de contact apparaîtront ici
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
