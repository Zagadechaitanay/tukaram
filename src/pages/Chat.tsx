import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
  reported: boolean;
}

const Chat = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const demoMessages: Message[] = [
        {
          id: '1',
          user: language === 'en' ? 'Ramesh Patil' : 'रमेश पाटील',
          text: language === 'en'
            ? 'Good morning everyone! Cotton prices are good this week.'
            : 'सुप्रभात मित्रांनो! या आठवड्यात कापसाच्या किंमती चांगल्या आहेत.',
          timestamp: Date.now() - 3600000,
          reported: false,
        },
        {
          id: '2',
          user: language === 'en' ? 'Sunita Deshmukh' : 'सुनिता देशमुख',
          text: language === 'en'
            ? 'Which fertilizer is best for wheat right now?'
            : 'गहूंसाठी आत्ता कोणते खत चांगले आहे?',
          timestamp: Date.now() - 1800000,
          reported: false,
        },
      ];
      setMessages(demoMessages);
      localStorage.setItem('chatMessages', JSON.stringify(demoMessages));
    }
  }, [language]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: user?.name || 'User',
      text: newMessage,
      timestamp: Date.now(),
      reported: false,
    };

    const updated = [...messages, message];
    setMessages(updated);
    localStorage.setItem('chatMessages', JSON.stringify(updated));
    setNewMessage('');
  };

  const handleReport = (messageId: string) => {
    const updated = messages.map((msg) =>
      msg.id === messageId ? { ...msg, reported: true } : msg
    );
    setMessages(updated);
    localStorage.setItem('chatMessages', JSON.stringify(updated));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'en' ? 'en-IN' : 'mr-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('chat.title')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all" className="flex-1">
                {t('chat.allFarmers')}
              </TabsTrigger>
              <TabsTrigger value="district" className="flex-1">
                {t('chat.districtRoom')} - {user?.district}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-xl">{t('chat.allFarmers')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4 p-6 max-h-[500px] overflow-y-auto">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {t('chat.noMessages')}
                      </p>
                    ) : (
                      messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.user === user?.name ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`p-4 rounded-2xl max-w-[75%] ${
                              message.user === user?.name
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-accent text-accent-foreground rounded-bl-sm'
                            } ${message.reported ? 'opacity-50' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-sm">
                                {message.user}
                              </span>
                              <span className="text-xs opacity-70 ml-2">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            {message.user !== user?.name && !message.reported && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 text-xs h-6 px-2"
                                onClick={() => handleReport(message.id)}
                              >
                                <Flag className="w-3 h-3 mr-1" />
                                {t('chat.report')}
                              </Button>
                            )}
                            {message.reported && (
                              <span className="text-xs opacity-70 block mt-2">
                                {t('chat.reported')}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-border p-4 bg-accent/20">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('chat.typePlaceholder')}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={handleSend} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="district" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('chat.districtRoom')} - {user?.district}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    {t('chat.noMessages')}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('chat.typePlaceholder')}
                      disabled
                    />
                    <Button disabled>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
