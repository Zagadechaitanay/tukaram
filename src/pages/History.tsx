import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trash2, Leaf, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoryItem {
  type: 'crop' | 'disease';
  queryText: string;
  timestamp: number;
}

const History = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filterByType = (type?: 'crop' | 'disease') => {
    if (!type) return history;
    return history.filter((item) => item.type === type);
  };

  const renderHistory = (items: HistoryItem[]) => {
    if (items.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          {t('history.noHistory')}
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/30">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    item.type === 'crop' 
                      ? 'bg-primary/10' 
                      : 'bg-destructive/10'
                  }`}>
                    {item.type === 'crop' ? (
                      <Leaf className="w-6 h-6 text-primary" />
                    ) : (
                      <Bug className="w-6 h-6 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-foreground mb-1">
                      {item.queryText}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {formatDate(item.timestamp)}
                    </p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                      item.type === 'crop'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {item.type === 'crop' ? t('history.crop') : t('history.disease')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('history.title')}
            </h1>
            <Button
              variant="destructive"
              onClick={clearHistory}
              className="gap-2"
              disabled={history.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              {t('history.clearHistory')}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">{t('history.filterAll')}</TabsTrigger>
              <TabsTrigger value="crop">{t('history.filterCrop')}</TabsTrigger>
              <TabsTrigger value="disease">{t('history.filterDisease')}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {renderHistory(filterByType())}
            </TabsContent>

            <TabsContent value="crop" className="mt-6">
              {renderHistory(filterByType('crop'))}
            </TabsContent>

            <TabsContent value="disease" className="mt-6">
              {renderHistory(filterByType('disease'))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
