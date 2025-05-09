
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Please check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Fonction utilitaire pour créer des tables Supabase
export const createSupabaseTable = async (tableName: string, schema: any) => {
  // Cette fonction est destinée à être utilisée dans la console Supabase
  // ou dans un script de migration et non directement dans l'application
  console.log(`To create the ${tableName} table, use the Supabase dashboard or run SQL queries`);
  console.log(`Schema suggestion for ${tableName}:`, schema);
};

// Instructions SQL pour créer les tables dans Supabase
export const createUserTableSQL = `
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Ajouter sécurité par Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Créer une policy pour restreindre l'accès
CREATE POLICY "Les utilisateurs Admin peuvent lire tous les utilisateurs"
  ON users FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'Admin'
  ));

-- Créer une policy pour restreindre les modifications
CREATE POLICY "Seuls les Admin peuvent modifier des utilisateurs"
  ON users FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'Admin'
  ));
`;

export const createRolesTableSQL = `
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture
CREATE POLICY "Tout utilisateur authentifié peut voir les rôles"
  ON roles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Politique pour la modification
CREATE POLICY "Seuls les Admin peuvent modifier les rôles"
  ON roles FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'Admin'
  ));
`;

export const createPermissionsTableSQL = `
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL
);

-- Activer RLS
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Politiques
CREATE POLICY "Tout utilisateur authentifié peut voir les permissions"
  ON permissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les Admin peuvent modifier les permissions"
  ON permissions FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'Admin'
  ));
`;

export const createRolePermissionsTableSQL = `
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

-- Activer RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Politiques
CREATE POLICY "Tout utilisateur authentifié peut voir les relations rôle-permission"
  ON role_permissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les Admin peuvent modifier les relations rôle-permission"
  ON role_permissions FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'Admin'
  ));
`;

// Ajoutez ici d'autres instructions SQL pour les autres tables...
