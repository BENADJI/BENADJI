import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileEdit, Save, Eye } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminPageEditor = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Page Accueil
  const [homePage, setHomePage] = useState({
    hero_title: 'APPRENONS ENSEMBLE',
    hero_subtitle: 'Devenez le chirurgien que vous voulez être',
    hero_cta: 'PROGRAMME DE FORMATION EN CATARACTE',
    community_title: 'Nous sommes là pour vous aider à développer vos connaissances',
    community_text: 'Avec des collègues dans plus de 30 pays...',
    hybrid_title: 'Éducation Hybride Mixte',
    hybrid_text: 'À l\'Académie OMS, nous regardons toujours vers l\'avenir...',
    cta_title: 'Arrêtez de perdre du temps à réfléchir à comment progresser',
    cta_subtitle: 'Arrêtez de rêver d\'être chirurgien. Maintenant vous pouvez! Commencez aujourd\'hui!',
    cta_button: 'PROGRAMME DE FORMATION PHACO'
  });

  // Page À Propos
  const [aboutPage, setAboutPage] = useState({
    page_title: 'À Propos de Nous',
    page_subtitle: 'Academy OMS est un écosystème d\'apprentissage dédié à l\'excellence en ophtalmologie',
    mission_title: 'Notre Mission',
    mission_text: 'Former la prochaine génération d\'ophtalmologistes...',
    story_title: 'Notre Histoire',
    story_text: 'Fondée par des leaders d\'opinion clés en ophtalmologie...'
  });

  // Page Contact
  const [contactPage, setContactPage] = useState({
    page_title: 'Contactez-nous',
    page_subtitle: 'Une question? N\'hésitez pas à nous contacter',
    email_primary: 'info@academy.oms-dz.com',
    email_support: 'support@academy.oms-dz.com',
    phone_primary: '+213 (0) 555 123 456',
    phone_secondary: '+213 (0) 555 789 012',
    address: 'Bureaux internationaux au Mexique et à Barcelone'
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadAllPages();
  }, [isAdmin, navigate]);

  const loadAllPages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load home page
      const homeRes = await axios.get(`${BACKEND_URL}/api/config/page/home`);
      if (homeRes.data.sections && Object.keys(homeRes.data.sections).length > 0) {
        setHomePage(homeRes.data.sections);
      }

      // Load about page
      const aboutRes = await axios.get(`${BACKEND_URL}/api/config/page/about`);
      if (aboutRes.data.sections && Object.keys(aboutRes.data.sections).length > 0) {
        setAboutPage(aboutRes.data.sections);
      }

      // Load contact page
      const contactRes = await axios.get(`${BACKEND_URL}/api/config/page/contact`);
      if (contactRes.data.sections && Object.keys(contactRes.data.sections).length > 0) {
        setContactPage(contactRes.data.sections);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  };

  const savePage = async (pageName, sections) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_URL}/api/config/page`,
        {
          page_name: pageName,
          sections: sections
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast({
        title: "Contenu sauvegardé",
        description: `La page ${pageName} a été mise à jour avec succès`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de sauvegarder",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Éditeur de Pages</h1>
            <p className="text-gray-600">Gérez le contenu de toutes les pages de votre site</p>
          </div>
          <Button
            onClick={() => window.open('/', '_blank')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Prévisualiser le Site</span>
          </Button>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="home">Page d'Accueil</TabsTrigger>
            <TabsTrigger value="about">À Propos</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* HOME PAGE */}
          <TabsContent value="home">
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileEdit className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Page d'Accueil</h2>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4">Section Hero (En-tête principal)</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre Principal</Label>
                      <Input
                        value={homePage.hero_title}
                        onChange={(e) => setHomePage({...homePage, hero_title: e.target.value})}
                        placeholder="APPRENONS ENSEMBLE"
                      />
                    </div>
                    <div>
                      <Label>Sous-titre</Label>
                      <Input
                        value={homePage.hero_subtitle}
                        onChange={(e) => setHomePage({...homePage, hero_subtitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Texte du Bouton</Label>
                      <Input
                        value={homePage.hero_cta}
                        onChange={(e) => setHomePage({...homePage, hero_cta: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4">Section Communauté</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre</Label>
                      <Input
                        value={homePage.community_title}
                        onChange={(e) => setHomePage({...homePage, community_title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Texte</Label>
                      <Textarea
                        value={homePage.community_text}
                        onChange={(e) => setHomePage({...homePage, community_text: e.target.value})}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4">Section Éducation Hybride</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre</Label>
                      <Input
                        value={homePage.hybrid_title}
                        onChange={(e) => setHomePage({...homePage, hybrid_title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Texte</Label>
                      <Textarea
                        value={homePage.hybrid_text}
                        onChange={(e) => setHomePage({...homePage, hybrid_text: e.target.value})}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4">Section CTA Final</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre</Label>
                      <Input
                        value={homePage.cta_title}
                        onChange={(e) => setHomePage({...homePage, cta_title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Sous-titre</Label>
                      <Textarea
                        value={homePage.cta_subtitle}
                        onChange={(e) => setHomePage({...homePage, cta_subtitle: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Texte du Bouton</Label>
                      <Input
                        value={homePage.cta_button}
                        onChange={(e) => setHomePage({...homePage, cta_button: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => savePage('home', homePage)}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder la Page d\'Accueil'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ABOUT PAGE */}
          <TabsContent value="about">
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileEdit className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Page À Propos</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Titre de la Page</Label>
                  <Input
                    value={aboutPage.page_title}
                    onChange={(e) => setAboutPage({...aboutPage, page_title: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Sous-titre</Label>
                  <Textarea
                    value={aboutPage.page_subtitle}
                    onChange={(e) => setAboutPage({...aboutPage, page_subtitle: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-4">Section Mission</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre Mission</Label>
                      <Input
                        value={aboutPage.mission_title}
                        onChange={(e) => setAboutPage({...aboutPage, mission_title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Texte Mission</Label>
                      <Textarea
                        value={aboutPage.mission_text}
                        onChange={(e) => setAboutPage({...aboutPage, mission_text: e.target.value})}
                        rows={5}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-4">Section Histoire</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre Histoire</Label>
                      <Input
                        value={aboutPage.story_title}
                        onChange={(e) => setAboutPage({...aboutPage, story_title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Texte Histoire</Label>
                      <Textarea
                        value={aboutPage.story_text}
                        onChange={(e) => setAboutPage({...aboutPage, story_text: e.target.value})}
                        rows={5}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => savePage('about', aboutPage)}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder la Page À Propos'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* CONTACT PAGE */}
          <TabsContent value="contact">
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileEdit className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Page Contact</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Titre de la Page</Label>
                  <Input
                    value={contactPage.page_title}
                    onChange={(e) => setContactPage({...contactPage, page_title: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Sous-titre</Label>
                  <Input
                    value={contactPage.page_subtitle}
                    onChange={(e) => setContactPage({...contactPage, page_subtitle: e.target.value})}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-4">Emails</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Email Principal</Label>
                      <Input
                        type="email"
                        value={contactPage.email_primary}
                        onChange={(e) => setContactPage({...contactPage, email_primary: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Email Support</Label>
                      <Input
                        type="email"
                        value={contactPage.email_support}
                        onChange={(e) => setContactPage({...contactPage, email_support: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-4">Téléphones</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Téléphone Principal</Label>
                      <Input
                        type="tel"
                        value={contactPage.phone_primary}
                        onChange={(e) => setContactPage({...contactPage, phone_primary: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Téléphone Secondaire</Label>
                      <Input
                        type="tel"
                        value={contactPage.phone_secondary}
                        onChange={(e) => setContactPage({...contactPage, phone_secondary: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Adresse</Label>
                  <Textarea
                    value={contactPage.address}
                    onChange={(e) => setContactPage({...contactPage, address: e.target.value})}
                    rows={2}
                  />
                </div>

                <Button
                  onClick={() => savePage('contact', contactPage)}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder la Page Contact'}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
