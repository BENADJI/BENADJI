import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Monitor, Microscope, Award, UserCheck, Hand, Globe, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { mockStats, mockCampuses, mockFeatures } from '../mock';

const iconMap = {
  Hand,
  Monitor,
  Microscope,
  Award,
  Users,
  UserCheck
};

export const Landing = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    webinarListeners: 0,
    virtualClasses: 0,
    keyOpinionLeaders: 0,
    subscribers: 0
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const counters = [
      { key: 'webinarListeners', target: mockStats.webinarListeners },
      { key: 'virtualClasses', target: mockStats.virtualClasses },
      { key: 'keyOpinionLeaders', target: mockStats.keyOpinionLeaders },
      { key: 'subscribers', target: mockStats.subscribers }
    ];

    counters.forEach(({ key, target }) => {
      let current = 0;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, stepDuration);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 opacity-60"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-wider text-teal-600 font-semibold mb-4 animate-in fade-in slide-in-from-top duration-500">
              Welcome to Oftalmo Academy
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-top duration-700">
              LET'S LEARN
              <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                TOGETHER
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 animate-in fade-in slide-in-from-top duration-900">
              Become the surgeon you want to be
            </p>
            <Button
              onClick={() => navigate('/courses')}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-in fade-in slide-in-from-bottom duration-1000"
            >
              CATARACT TRAINING PROGRAM
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stats.webinarListeners.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Webinar Listeners</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stats.virtualClasses}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Virtual Classes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stats.keyOpinionLeaders}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Key Opinion Leaders</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stats.subscribers.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Subscribers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-b from-white to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-teal-600 font-semibold mb-4">
                Our Community
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                We are here to help you grow your knowledge
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                With colleagues in more than 30 countries, Oftalmo Academy is the ophthalmological ecosystem that gives you the space to develop your abilities and skills to the fullest.
              </p>
              <p className="text-lg text-gray-600">
                Find courses, podcasts, articles, and webinars tailored to your needs to start the path to professional excellence today.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl p-8 flex items-center justify-center">
                <Globe className="w-64 h-64 text-teal-600 opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-teal-600 mb-2">30+</div>
                    <p className="text-xl text-gray-700">Countries Worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockFeatures.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <Card key={index} className="group p-8 border-2 border-gray-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-teal-600 font-semibold mb-2">
                    {feature.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hybrid Education Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-wider text-teal-100 font-semibold mb-4">
              Our Approach
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Hybrid Blended Education
            </h2>
            <p className="text-xl text-teal-50 mb-8">
              At Oftalmo Academy, we always look to the future.
            </p>
            <p className="text-lg text-teal-100 mb-12">
              That is why we introduce the Hybrid Blended Education Program, the future of ophthalmology teaching, today! Join a new way of learning, with methodology and practices designed to transform you into the ophthalmologist you always wanted to be.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Online Learning', icon: Monitor },
                { label: 'Hands-On Practice', icon: Hand },
                { label: 'Expert Mentorship', icon: UserCheck },
                { label: 'Certification', icon: Award }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors duration-200">
                  <item.icon className="w-10 h-10 mx-auto mb-3" />
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/courses')}
              size="lg"
              className="bg-white text-teal-600 hover:bg-teal-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Explore Programs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Campuses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Oftalmo Academy's Campuses
            </h2>
            <p className="text-xl text-gray-600">
              World-class facilities in strategic locations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {mockCampuses.map((campus) => (
              <Card key={campus.id} className="overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={campus.image}
                    alt={campus.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{campus.name}</h3>
                    <p className="text-teal-200">{campus.location}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">{campus.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-wider text-amber-100 font-semibold mb-4">
              Learn Today!
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Stop wasting time thinking about how to progress
            </h2>
            <p className="text-xl text-amber-50 mb-10">
              Stop dreaming about being a surgeon. Now you can! Start today!
            </p>
            <Button
              onClick={() => navigate('/courses')}
              size="lg"
              className="bg-white text-orange-600 hover:bg-amber-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              PHACO TRAINING PROGRAM
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
