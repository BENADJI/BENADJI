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
              <span className="text-xl font-bold text-white">Oftalmo Academy</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Empowering ophthalmologists worldwide with cutting-edge training and education.
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
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-teal-400 transition-colors duration-200">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors duration-200">
                  About Us
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
            <h3 className="text-white font-semibold mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Cataract Surgery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Phaco Training
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Refractive Surgery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors duration-200">
                  Online Webinars
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
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
                <span className="text-sm">International Offices in Mexico & Barcelona</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Oftalmo Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
