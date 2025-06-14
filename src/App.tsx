
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import { AdminRoute } from "./components/auth/AdminRoute";
import Dashboard from "./pages/Dashboard";
import LocalSubscribers from "./pages/LocalSubscribers";
import InternationalSubscribers from "./pages/InternationalSubscribers";
import Institutions from "./pages/Institutions";
import Ventes from "./pages/Ventes";
import SubscriptionTypes from "./pages/SubscriptionTypes";
import Calendar from "./pages/Calendar";
import WeeklyProgram from "./pages/WeeklyProgram";
import Settings from "./pages/Settings";
import Prospection from "./pages/Prospection";
import NewSubscriber from "./pages/NewSubscriber";
import UserSessions from "./pages/admin/UserSessions";

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
          <Route path="/abonnes-internationaux" element={
            <AppLayout>
              <InternationalSubscribers />
            </AppLayout>
          } />
          {/* Add the new route for creating an international subscriber */}
          <Route path="/abonnes-internationaux/nouveau" element={
            <AppLayout>
              <NewSubscriber />
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
          <Route path="/calendrier" element={
            <AppLayout>
              <Calendar />
            </AppLayout>
          } />
          {/* Add both routes to the same component */}
          <Route path="/programme-hebdomadaire" element={
            <AppLayout>
              <WeeklyProgram />
            </AppLayout>
          } />
          <Route path="/programme" element={
            <AppLayout>
              <WeeklyProgram />
            </AppLayout>
          } />
          <Route path="/parametres" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          {/* Add route for Prospection */}
          <Route path="/prospection" element={
            <AppLayout>
              <Prospection />
            </AppLayout>
          } />
          {/* Add route for Admin User Sessions */}
          <Route path="/admin/user-sessions" element={
            <AppLayout>
              <UserSessions />
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
