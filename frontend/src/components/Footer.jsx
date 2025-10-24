import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Académie Oftalmo</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Donner aux ophtalmologistes du monde entier une formation et une éducation de pointe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors duration-200">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-teal-400 transition-colors duration-200">
                  Cours
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors duration-200">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Programmes</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Chirurgie de la Cataracte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Formation Phaco
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Chirurgie Réfractive
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Webinaires en Ligne
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contactez-nous</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">info@academy.oms-dz.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Bureaux internationaux au Mexique et à Barcelone</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Académie Oftalmo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
