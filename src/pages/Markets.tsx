import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, ExternalLink, Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import marketsData from '@/data/markets.json';

const Markets = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortedMarkets, setSortedMarkets] = useState(marketsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          sortMarketsByDistance(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortMarketsByDistance = (location: { lat: number; lng: number }) => {
    const sorted = [...marketsData].sort((a, b) => {
      const distA = calculateDistance(location.lat, location.lng, a.lat, a.lng);
      const distB = calculateDistance(location.lat, location.lng, b.lat, b.lng);
      return distA - distB;
    });
    setSortedMarkets(sorted);
  };

  useEffect(() => {
    let filtered = [...marketsData];

    if (searchTerm) {
      filtered = filtered.filter(
        (market) =>
          market.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          market.nameMr.includes(searchTerm) ||
          market.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (districtFilter !== 'all') {
      filtered = filtered.filter((market) => market.district === districtFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((market) => market.type === typeFilter);
    }

    if (userLocation) {
      filtered.sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    setSortedMarkets(filtered);
  }, [searchTerm, districtFilter, typeFilter, userLocation]);

  const uniqueDistricts = Array.from(new Set(marketsData.map((m) => m.district))).sort();
  const uniqueTypes = Array.from(new Set(marketsData.map((m) => m.type))).sort();

  const openInGoogleMaps = (lat: number, lng: number, name: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto max-w-6xl">
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
              {t('markets.title')}
            </h1>
            <Button onClick={getLocation} className="gap-2">
              <MapPin className="w-4 h-4" />
              {t('markets.getLocation')}
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search markets by name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {uniqueDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setDistrictFilter('all');
                setTypeFilter('all');
              }}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {sortedMarkets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-muted/50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No markets found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find markets.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setDistrictFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMarkets.map((market, index) => {
            const distance = userLocation
              ? calculateDistance(userLocation.lat, userLocation.lng, market.lat, market.lng)
              : null;

            return (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-primary/50">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-bold">
                        {language === 'en' ? market.nameEn : market.nameMr}
                      </CardTitle>
                      {distance && (
                        <div className="flex items-center gap-1 text-primary text-sm font-semibold bg-primary/10 px-2 py-1 rounded">
                          <TrendingUp className="w-4 h-4" />
                          {distance.toFixed(1)} km
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('markets.type')}</p>
                          <p className="font-semibold text-foreground">{market.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-accent/20 p-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('auth.district')}</p>
                          <p className="font-semibold text-foreground">{market.district}</p>
                        </div>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="default"
                        className="w-full gap-2 shadow-lg"
                        onClick={() => openInGoogleMaps(market.lat, market.lng, market.nameEn)}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t('markets.openInMaps')}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Markets;
