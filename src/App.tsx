import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CropAdvisory from "./pages/CropAdvisory";
import DiseaseDetection from "./pages/DiseaseDetection";
import Markets from "./pages/Markets";
import Chat from "./pages/Chat";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/crops"
                      element={
                        <ProtectedRoute>
                          <CropAdvisory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/disease"
                      element={
                        <ProtectedRoute>
                          <DiseaseDetection />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/markets"
                      element={
                        <ProtectedRoute>
                          <Markets />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <ProtectedRoute>
                          <History />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
