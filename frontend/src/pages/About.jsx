import React from 'react';
import { Card } from '../components/ui/card';
import { Award, Users, Globe, TrendingUp, Heart, Target } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">\u00c0 Propos de Nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acad\u00e9mie Oftalmo est un \u00e9cosyst\u00e8me d'apprentissage d\u00e9di\u00e9 \u00e0 l'excellence en ophtalmologie
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="p-12 bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6">Notre Mission</h2>
              <p className="text-xl leading-relaxed">
                Former la prochaine g\u00e9n\u00e9ration d'ophtalmologistes gr\u00e2ce \u00e0 une approche innovante 
                combinant technologie de pointe, mentorat expert et pratique clinique. Nous nous engageons 
                \u00e0 rendre l'\u00e9ducation ophtalmologique accessible et excellente pour tous les professionnels, 
                partout dans le monde.
              </p>
            </div>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Nous visons l'excellence dans tout ce que nous faisons, de nos programmes de formation 
                \u00e0 notre support \u00e9tudiant.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Passion</h3>
              <p className="text-gray-600">
                Notre passion pour l'ophtalmologie et l'\u00e9ducation guide chaque d\u00e9cision et 
                inspire nos \u00e9tudiants.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Communaut\u00e9</h3>
              <p className="text-gray-600">
                Nous cr\u00e9ons une communaut\u00e9 mondiale de professionnels qui s'entraident et 
                partagent leurs connaissances.
              </p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <Card className="p-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Notre Impact</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  30+
                </div>
                <p className="text-gray-600 font-semibold">Pays</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  8000+
                </div>
                <p className="text-gray-600 font-semibold">\u00c9tudiants</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  45+
                </div>
                <p className="text-gray-600 font-semibold">Experts</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <p className="text-gray-600 font-semibold">Cours</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                Fond\u00e9e par des leaders d'opinion cl\u00e9s en ophtalmologie, l'Acad\u00e9mie Oftalmo 
                est n\u00e9e d'une vision simple : rendre l'\u00e9ducation ophtalmologique de qualit\u00e9 
                accessible \u00e0 tous les professionnels, o\u00f9 qu'ils se trouvent.
              </p>
              <p>
                En combinant l'apprentissage en ligne avec des exp\u00e9riences pratiques dans nos 
                campus internationaux, nous avons cr\u00e9\u00e9 un mod\u00e8le d'\u00e9ducation hybride unique 
                qui pr\u00e9pare vraiment les chirurgiens \u00e0 exceller dans leur pratique.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers de servir une communaut\u00e9 mondiale de plus de 8000 
                professionnels dans plus de 30 pays, avec des campus au Mexique et en Europe.
              </p>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
              alt="Notre \u00e9quipe"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Approach */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Notre Approche</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <Globe className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">\u00c9ducation Hybride</h3>
              <p className="text-gray-600">
                Nous combinons l'apprentissage en ligne flexible avec des sessions pratiques 
                intensives dans nos campus pour offrir une exp\u00e9rience d'apprentissage compl\u00e8te.
              </p>
            </Card>

            <Card className="p-8">
              <TrendingUp className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technologie de Pointe</h3>
              <p className="text-gray-600">
                Nos programmes utilisent les derni\u00e8res technologies de simulation et d'apprentissage 
                pour pr\u00e9parer les \u00e9tudiants aux r\u00e9alit\u00e9s de la pratique moderne.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
