
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const useEmailSender = () => {
  const sendEmail = async (emailData: EmailData) => {
    try {
      console.log('Sending email via Resend...', emailData);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData,
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      console.log('Email sent successfully:', data);
      
      toast({
        title: "Email envoyé",
        description: "L'email a été envoyé avec succès",
      });

      return data;
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast({
        title: "Erreur d'envoi",
        description: `Impossible d'envoyer l'email: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendWelcomeEmail = async (subscriberData: {
    nom: string;
    prenom?: string;
    email: string;
    typeAbonnement: string;
    dateDebut: string;
    dateFin: string;
  }) => {
    const fullName = subscriberData.prenom 
      ? `${subscriberData.prenom} ${subscriberData.nom}`
      : subscriberData.nom;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bienvenue chez Archibat !</h2>
        <p>Bonjour ${fullName},</p>
        <p>Nous vous confirmons que votre abonnement a été créé avec succès :</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Détails de votre abonnement</h3>
          <p><strong>Type d'abonnement :</strong> ${subscriberData.typeAbonnement}</p>
          <p><strong>Date de début :</strong> ${new Date(subscriberData.dateDebut).toLocaleDateString('fr-FR')}</p>
          <p><strong>Date de fin :</strong> ${new Date(subscriberData.dateFin).toLocaleDateString('fr-FR')}</p>
        </div>
        <p>Nous vous remercions de votre confiance et restons à votre disposition pour toute question.</p>
        <p style="margin-top: 30px;">
          Cordialement,<br>
          <strong>L'équipe Archibat</strong>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    `;

    return sendEmail({
      to: subscriberData.email,
      subject: "Confirmation de votre abonnement Archibat",
      html,
    });
  };

  return {
    sendEmail,
    sendWelcomeEmail,
  };
};
