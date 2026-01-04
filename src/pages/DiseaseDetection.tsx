import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, AlertCircle, Bug, Loader2, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import cropsData from '@/data/crops.json';
import diseasesData from '@/data/diseases.json';

const DiseaseDetection = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedCrop) return;

    setIsLoading(true);
    setResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cropDiseases = diseasesData.filter(d => d.cropId === selectedCrop);
    const randomDisease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];

    setResult(randomDisease);
    setIsLoading(false);

    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift({
      type: 'disease',
      queryText: language === 'en' ? randomDisease?.nameEn : randomDisease?.nameMr,
      timestamp: Date.now(),
    });
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 50)));
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
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
            {t('disease.title')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-orange-500/10">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/20 p-2 rounded-lg">
                  <Bug className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-2xl">{t('disease.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>{t('disease.selectCrop')}</Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('disease.selectCrop')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cropsData.map((crop) => (
                      <SelectItem key={crop.id} value={crop.id}>
                        {language === 'en' ? crop.nameEn : crop.nameMr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">{t('disease.uploadImage')}</Label>
                {imagePreview ? (
                  <div className="relative border-2 border-primary/30 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      {image?.name}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-accent/20">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      {t('disease.uploadPlaceholder')}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {t('disease.uploadImage')}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('disease.describe')}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('disease.describe')}
                  rows={4}
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleDetect}
                  disabled={!selectedCrop || isLoading}
                  className="w-full text-lg py-6 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bug className="w-5 h-5 mr-2" />
                      {t('disease.detectButton')}
                    </>
                  )}
                </Button>
              </motion.div>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Analyzing crop disease...</p>
                </motion.div>
              )}

              {result && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {t('disease.result')}
                    </h3>
                  </div>
                  <Card className="border-2 border-primary/20 shadow-lg">
                    <CardContent className="pt-6 space-y-6">
                      <div className="bg-destructive/5 p-4 rounded-lg border-l-4 border-destructive">
                        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                          <Bug className="w-5 h-5 text-destructive" />
                          {t('disease.diseaseName')}
                        </h4>
                        <p className="text-lg font-semibold text-foreground">
                          {language === 'en' ? result.nameEn : result.nameMr}
                        </p>
                      </div>
                      <div className="bg-accent/30 p-4 rounded-lg">
                        <h4 className="font-bold text-foreground mb-2">
                          {t('disease.description')}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {language === 'en' ? result.descriptionEn : result.descriptionMr}
                        </p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                        <h4 className="font-bold text-foreground mb-2">
                          {t('disease.suggestion')}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {language === 'en' ? result.suggestionEn : result.suggestionMr}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('disease.disclaimer')}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
