import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, X, ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import cropsData from '@/data/crops.json';

const CropAdvisory = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<any>(null);

  const filteredCrops = cropsData.filter((crop) => {
    const nameMatch = language === 'en'
      ? crop.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
      : crop.nameMr.includes(searchTerm);
    const seasonMatch = seasonFilter === 'all' || crop.season === seasonFilter;
    const typeMatch = typeFilter === 'all' || crop.type === typeFilter;
    const regionMatch = regionFilter === 'all' || crop.region.includes(regionFilter);
    return nameMatch && seasonMatch && typeMatch && regionMatch;
  });

  const addToHistory = (crop: any) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift({
      type: 'crop',
      queryText: language === 'en' ? crop.nameEn : crop.nameMr,
      timestamp: Date.now(),
    });
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 50)));
  };

  const handleCropClick = (crop: any) => {
    setSelectedCrop(crop);
    addToHistory(crop);
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('crops.title')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
            <Input
              placeholder={t('crops.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('crops.filterBySeason')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('crops.allSeasons')}</SelectItem>
                <SelectItem value="kharif">{t('crops.kharif')}</SelectItem>
                <SelectItem value="rabi">{t('crops.rabi')}</SelectItem>
                <SelectItem value="summer">{t('crops.summer')}</SelectItem>
                <SelectItem value="yearRound">{t('crops.yearRound')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('crops.filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('crops.allTypes')}</SelectItem>
                <SelectItem value="cereal">Cereal / धान्य</SelectItem>
                <SelectItem value="pulse">Pulse / डाळी</SelectItem>
                <SelectItem value="cash">Cash Crop / नगदी पीक</SelectItem>
                <SelectItem value="vegetable">Vegetable / भाजी</SelectItem>
                <SelectItem value="fruit">Fruit / फळ</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSeasonFilter('all');
                setRegionFilter('all');
                setTypeFilter('all');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              {t('common.clear')}
            </Button>
          </div>
        </motion.div>

        {filteredCrops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-muted/50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Leaf className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No crops found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSeasonFilter('all');
                setRegionFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCrops.map((crop, index) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary/50 h-full"
                    onClick={() => handleCropClick(crop)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Leaf className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">
                          {language === 'en' ? crop.nameEn : crop.nameMr}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t('crops.season')}:</span>
                          <span className="font-medium text-foreground">{t(`crops.${crop.season}`)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t('crops.region')}:</span>
                          <span className="font-medium text-foreground">{crop.region}</span>
                        </div>
                        <Button variant="secondary" className="w-full mt-4">
                          {t('crops.viewDetails')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <Dialog open={!!selectedCrop} onOpenChange={() => setSelectedCrop(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedCrop && (language === 'en' ? selectedCrop.nameEn : selectedCrop.nameMr)}
              </DialogTitle>
            </DialogHeader>
            {selectedCrop && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.season')}</h3>
                  <p className="text-muted-foreground">{t(`crops.${selectedCrop.season}`)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.soilType')}</h3>
                  <p className="text-muted-foreground">
                    {language === 'en' ? selectedCrop.soilEn : selectedCrop.soilMr}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.region')}</h3>
                  <p className="text-muted-foreground">{selectedCrop.region}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.temperature')}</h3>
                  <p className="text-muted-foreground">{selectedCrop.temperature}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.rainfall')}</h3>
                  <p className="text-muted-foreground">{selectedCrop.rainfall}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.sowing')}</h3>
                  <p className="text-muted-foreground">
                    {language === 'en' ? selectedCrop.sowingEn : selectedCrop.sowingMr}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.harvest')}</h3>
                  <p className="text-muted-foreground">
                    {language === 'en' ? selectedCrop.harvestEn : selectedCrop.harvestMr}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.fertilizer')}</h3>
                  <p className="text-muted-foreground">
                    {language === 'en' ? selectedCrop.fertilizerEn : selectedCrop.fertilizerMr}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('crops.pesticide')}</h3>
                  <p className="text-muted-foreground">
                    {language === 'en' ? selectedCrop.pesticideEn : selectedCrop.pesticideMr}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CropAdvisory;
