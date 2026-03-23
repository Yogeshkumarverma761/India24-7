import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check for logged in user
    const savedUser = localStorage.getItem('india247_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('india247_token');
    localStorage.removeItem('india247_user');
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Map', path: '/map' },
    { name: 'Feed', path: '/feed' },
    { name: 'Tracker', path: '/tracker' },
    { name: 'Rewards', path: '/rewards' },
  ];

  return (
    <>
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white font-bold text-sm">
                I247
              </div>
              <div>
                <span className="font-bold text-navy text-xl hidden sm:block">India247</span>
              </div>
            </Link>
            <span className="text-xs text-gray-500 hidden md:inline ml-2 border-l border-gray-300 pl-2">
              Apna Shehar, Apni Zimmedari
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-saffron' : 'text-navy hover:text-saffron'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-4 w-px bg-gray-200"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                   <div className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                     {user.name[0]}
                   </div>
                   <span className="text-xs font-bold text-navy">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                   <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-navy hover:text-saffron transition-colors"
              >
                <LogIn size={18} />
                Login
              </button>
            )}

            <Link to="/report" className="btn-primary py-2 px-5 text-sm shadow-md hover:-translate-y-0.5 transition-transform">
              Report Issue
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {!user && (
               <button onClick={() => setIsLoginModalOpen(true)} className="p-2 text-navy">
                 <LogIn size={20} />
               </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-navy p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2">
          <div className="px-4 py-3 space-y-1 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path 
                    ? 'bg-orange-50 text-saffron' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-navy'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <button 
                onClick={handleLogout}
                className="w-full text-center py-3 text-red-500 font-bold border-t border-gray-50 mt-2"
              >
                Logout ({user.name})
              </button>
            )}

            <Link 
              to="/report" 
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center mt-4 bg-saffron text-white rounded-xl px-4 py-2.5 font-semibold"
            >
              Report Issue
            </Link>
          </div>
        </div>
      )}
    </nav>

    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
    />
    </>
  );
};

export default Navbar;
