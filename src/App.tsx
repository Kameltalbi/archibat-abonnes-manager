
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import LocalSubscribers from "./pages/LocalSubscribers";
import NewSubscriber from "./pages/NewSubscriber";
import InternationalSubscribers from "./pages/InternationalSubscribers";
import Institutions from "./pages/Institutions";
import Ventes from "./pages/Ventes";
import SubscriptionTypes from "./pages/SubscriptionTypes";
import Prospection from "./pages/Prospection";
import AbonnesCalendar from "./pages/AbonnesCalendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/abonnes-locaux" element={
            <AppLayout>
              <LocalSubscribers />
            </AppLayout>
          } />
          <Route path="/abonnes-locaux/nouveau" element={
            <AppLayout>
              <NewSubscriber />
            </AppLayout>
          } />
          <Route path="/abonnes-internationaux" element={
            <AppLayout>
              <InternationalSubscribers />
            </AppLayout>
          } />
          <Route path="/institutions" element={
            <AppLayout>
              <Institutions />
            </AppLayout>
          } />
          <Route path="/ventes" element={
            <AppLayout>
              <Ventes />
            </AppLayout>
          } />
          <Route path="/types-abonnement" element={
            <AppLayout>
              <SubscriptionTypes />
            </AppLayout>
          } />
          <Route path="/prospection" element={
            <AppLayout>
              <Prospection />
            </AppLayout>
          } />
          <Route path="/calendrier" element={
            <AppLayout>
              <AbonnesCalendar />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
