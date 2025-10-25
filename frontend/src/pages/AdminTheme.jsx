import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Palette, Save, RotateCcw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const AdminTheme = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState({
    siteName: 'Academy OMS',
    siteTagline: 'Plateforme de Formation en Ophtalmologie',
    primaryColor: '#14b8a6',
    secondaryColor: '#06b6d4',
    accentColor: '#f59e0b',
    logoUrl: '',
    heroTitle: 'APPRENONS ENSEMBLE',
    heroSubtitle: 'Devenez le chirurgien que vous voulez être',
    footerText: 'Donner aux ophtalmologistes du monde entier une formation et une éducation de pointe.',
    contactEmail: 'info@academy.oms-dz.com',
    contactPhone: '+213 (0) 555 123 456',
    whatsappNumber: '525512915514'
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadConfig();
  }, [isAdmin, navigate]);

  const loadConfig = () => {
    // Charger depuis localStorage pour le moment
    const saved = localStorage.getItem('siteConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  };

  const handleSave = () => {
    // Sauvegarder dans localStorage
    localStorage.setItem('siteConfig', JSON.stringify(config));
    
    // Appliquer les couleurs CSS
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', config.accentColor);
    
    toast({
      title: "Configuration sauvegardée",
      description: "Les modifications ont été appliquées. Actualisez la page pour voir tous les changements.",
    });
  };

  const handleReset = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir réinitialiser la configuration par défaut ?')) return;
    
    localStorage.removeItem('siteConfig');
    loadConfig();
    toast({
      title: "Configuration réinitialisée",
      description: "Les paramètres par défaut ont été restaurés",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Personnalisation du Thème</h1>
            <p className="text-gray-600">Modifiez l'apparence et le contenu de votre site</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informations Générales */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Informations Générales</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName">Nom du Site</Label>
                <Input
                  id="siteName"
                  value={config.siteName}
                  onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                  placeholder="Academy OMS"
                />
              </div>

              <div>
                <Label htmlFor="siteTagline">Slogan du Site</Label>
                <Input
                  id="siteTagline"
                  value={config.siteTagline}
                  onChange={(e) => setConfig({ ...config, siteTagline: e.target.value })}
                  placeholder="Plateforme de Formation..."
                />
              </div>

              <div>
                <Label htmlFor="logoUrl">URL du Logo (optionnel)</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={config.logoUrl}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="heroTitle">Titre de la Page d'Accueil</Label>
                <Input
                  id="heroTitle"
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Sous-titre de la Page d'Accueil</Label>
                <Input
                  id="heroSubtitle"
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="footerText">Texte du Footer</Label>
                <Textarea
                  id="footerText"
                  value={config.footerText}
                  onChange={(e) => setConfig({ ...config, footerText: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Couleurs */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Couleurs du Thème</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Couleur Principale</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-20 h-12"
                  />
                  <Input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Couleur Secondaire</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="w-20 h-12"
                  />
                  <Input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Couleur d'Accent</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                    className="w-20 h-12"
                  />
                  <Input
                    type="text"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Aperçu des Couleurs</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Principale
                  </div>
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: config.secondaryColor }}
                  >
                    Secondaire
                  </div>
                  <div 
                    className="h-20 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    Accent
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de Contact</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contactEmail">Email de Contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Téléphone de Contact</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={config.contactPhone}
                  onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="whatsappNumber">Numéro WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  placeholder="525512915514"
                />
                <p className="text-xs text-gray-500 mt-1">Format international sans +</p>
              </div>
            </div>
          </Card>

          {/* Aide */}
          <Card className="p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
            <h2 className="text-2xl font-bold mb-4">💡 Conseils</h2>
            <ul className="space-y-3 text-teal-50">
              <li>✓ Testez les changements avant de les sauvegarder</li>
              <li>✓ Utilisez des couleurs contrastées pour la lisibilité</li>
              <li>✓ Les changements s'appliquent immédiatement après sauvegarde</li>
              <li>✓ Vous pouvez réinitialiser à tout moment</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
