import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Bug, MapPin, MessageSquare, History, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Load recent activity from localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setRecentActivity(history.slice(0, 5));
  }, []);

  const cards = [
    {
      icon: Leaf,
      titleKey: 'dashboard.cropAdvisory',
      descKey: 'dashboard.cropAdvisoryDesc',
      path: '/crops',
      color: 'text-primary',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-primary/30',
    },
    {
      icon: Bug,
      titleKey: 'dashboard.diseaseDetection',
      descKey: 'dashboard.diseaseDetectionDesc',
      path: '/disease',
      color: 'text-destructive',
      bgGradient: 'from-red-500/10 to-orange-500/10',
      borderColor: 'border-destructive/30',
    },
    {
      icon: MapPin,
      titleKey: 'dashboard.markets',
      descKey: 'dashboard.marketsDesc',
      path: '/markets',
      color: 'text-accent-foreground',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-accent-foreground/30',
    },
    {
      icon: MessageSquare,
      titleKey: 'dashboard.chat',
      descKey: 'dashboard.chatDesc',
      path: '/chat',
      color: 'text-secondary',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-secondary/30',
    },
    {
      icon: History,
      titleKey: 'dashboard.history',
      descKey: 'dashboard.historyDesc',
      path: '/history',
      color: 'text-muted-foreground',
      bgGradient: 'from-gray-500/10 to-slate-500/10',
      borderColor: 'border-muted-foreground/30',
    },
  ];

  const stats = [
    { label: 'Searches Today', value: recentActivity.length, icon: TrendingUp },
    { label: 'Active Sessions', value: '1', icon: Clock },
  ];

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Top Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 rounded-3xl p-8 md:p-12 mb-8 border-2 border-primary/20 shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                {t('dashboard.greeting')}, {user?.name}! 👋
              </h1>
              <p className="text-xl text-muted-foreground">{t('dashboard.tagline')}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('dashboard.quickAccess')}
          </h2>
          <p className="text-muted-foreground">Choose a service to get started</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer hover:shadow-2xl transition-all border-2 ${card.borderColor} bg-gradient-to-br ${card.bgGradient} h-full group`}
                onClick={() => navigate(card.path)}
              >
                <CardContent className="p-6">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mb-4"
                  >
                    <div className={`bg-background/50 p-4 rounded-2xl inline-block group-hover:bg-background/80 transition-colors`}>
                      <card.icon className={`w-10 h-10 ${card.color}`} />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(card.descKey)}</p>
                  <div className="mt-4 text-primary text-sm font-medium group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.queryText}</p>
                          <p className="text-xs text-muted-foreground">{activity.type}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(activity.timestamp)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
