
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Créer un client Supabase avec la clé secrète
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Récupérer les données de la requête
    const { email, password, name, role } = await req.json();

    // Vérifier les données requises
    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, error: "Email, password et rôle sont requis" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Créer l'utilisateur avec les privilèges admin
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (createUserError) {
      return new Response(
        JSON.stringify({ success: false, error: createUserError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Si le rôle est différent de "Viewer", mettre à jour le rôle
    if (role !== "Viewer" && userData.user) {
      // Récupérer l'ID du rôle
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from("roles")
        .select("id")
        .eq("name", role)
        .single();

      if (roleError) {
        return new Response(
          JSON.stringify({ success: false, error: "Rôle non trouvé" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Mettre à jour le profil avec le rôle
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ role_id: roleData.id })
        .eq("id", userData.user.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, user: userData.user }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
