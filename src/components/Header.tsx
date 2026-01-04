import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sprout, LogOut, Globe, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.features', path: '/#features' },
    { key: 'nav.cropAdvisory', path: '/crops' },
    { key: 'nav.diseaseDetection', path: '/disease' },
    { key: 'nav.markets', path: '/markets' },
    { key: 'nav.chat', path: '/chat' },
  ];

  const languageOptions = [
    { code: 'en' as const, label: 'English', nativeLabel: 'English' },
    { code: 'mr' as const, label: 'Marathi', nativeLabel: 'मराठी' },
    { code: 'hi' as const, label: 'Hindi', nativeLabel: 'हिंदी' },
  ];

  const currentLanguage = languageOptions.find(l => l.code === language);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Sprout className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {t('home.title')}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.div key={link.path} whileHover={{ scale: 1.05 }}>
                <Link
                  to={link.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {t(link.key)}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="gap-2"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
              </Button>
            )}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentLanguage?.nativeLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-popover">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    {lang.nativeLabel}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {user?.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 hidden sm:flex"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('common.logout')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 sm:hidden"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="hidden sm:flex"
                >
                  {t('common.login')} / {t('common.register')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="sm:hidden"
                >
                  {t('common.login')}
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};
