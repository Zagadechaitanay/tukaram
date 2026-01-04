import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Bug, MapPin, MessageSquare, Users, TrendingUp, Award, Sparkles, Sprout } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Leaf,
      titleKey: 'home.feature1Title',
      descKey: 'home.feature1Desc',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: Bug,
      titleKey: 'home.feature2Title',
      descKey: 'home.feature2Desc',
      gradient: 'from-red-500/20 to-orange-500/20',
    },
    {
      icon: MapPin,
      titleKey: 'home.feature3Title',
      descKey: 'home.feature3Desc',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: MessageSquare,
      titleKey: 'home.feature4Title',
      descKey: 'home.feature4Desc',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Farmers' },
    { icon: TrendingUp, value: '50+', label: 'Crop Varieties' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Sparkles, value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center justify-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Sprout className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Digital Farming Companion</span>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-3xl mb-4 text-primary font-semibold">
            {t('home.subtitle')}
          </p>
          <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('home.description')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all"
            >
              {t('home.cta')}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 bg-card border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-accent/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t('home.features')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in modern farming
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`h-full hover:shadow-2xl transition-all border-2 hover:border-primary/50 bg-gradient-to-br ${feature.gradient}`}>
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="inline-block mb-4"
                    >
                      <div className="bg-primary/10 p-4 rounded-2xl inline-block">
                        <feature.icon className="w-10 h-10 text-primary" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(feature.descKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
