import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, Mail, Phone, Instagram, Youtube, MessageCircle } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.cropAdvisory', path: '/crops' },
    { key: 'nav.diseaseDetection', path: '/disease' },
    { key: 'nav.markets', path: '/markets' },
    { key: 'nav.chat', path: '/chat' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {t('home.title')}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t('footer.description')}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{t('footer.location')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{t('footer.email')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{t('footer.phone')}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer & Future Note */}
        <motion.div
          variants={itemVariants}
          className="border-t border-border pt-6 space-y-3"
        >
          <p className="text-xs text-muted-foreground">
            <strong>{t('home.disclaimer')}:</strong> {t('footer.disclaimer')}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {t('footer.futureNote')}
          </p>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="border-t border-border pt-6 mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('home.title')}. {t('footer.allRightsReserved')}.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};
