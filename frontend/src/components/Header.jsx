import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg transform group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Academy OMS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium">
              Accueil
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium">
              Cours
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium">
                Administration
              </Link>
            )}
            <Link to="/about" className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium">
              À Propos
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 hover:border-red-600"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/courses"
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Cours
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administration
                </Link>
              )}
              <Link
                to="/about"
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                À Propos
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 text-gray-700 px-4 py-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full text-red-600 border-red-600"
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Connexion
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                    >
                      S'inscrire
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
