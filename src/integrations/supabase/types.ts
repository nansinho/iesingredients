export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      aromes_fr: {
        Row: {
          application: string | null
          aspect: string | null
          base: string | null
          cas_no: string | null
          certifications: string | null
          code: string | null
          conservateurs: string | null
          description: string | null
          dosage: string | null
          flavouring_preparation: string | null
          food_grade: string | null
          gamme: string | null
          id: number
          image_url: string | null
          inci: string | null
          nom_commercial: string | null
          origine: string | null
          ph: string | null
          profil_aromatique: string | null
          statut: string | null
          tracabilite: string | null
          typologie_de_produit: string | null
          valorisations: string | null
        }
        Insert: {
          application?: string | null
          aspect?: string | null
          base?: string | null
          cas_no?: string | null
          certifications?: string | null
          code?: string | null
          conservateurs?: string | null
          description?: string | null
          dosage?: string | null
          flavouring_preparation?: string | null
          food_grade?: string | null
          gamme?: string | null
          id?: number
          image_url?: string | null
          inci?: string | null
          nom_commercial?: string | null
          origine?: string | null
          ph?: string | null
          profil_aromatique?: string | null
          statut?: string | null
          tracabilite?: string | null
          typologie_de_produit?: string | null
          valorisations?: string | null
        }
        Update: {
          application?: string | null
          aspect?: string | null
          base?: string | null
          cas_no?: string | null
          certifications?: string | null
          code?: string | null
          conservateurs?: string | null
          description?: string | null
          dosage?: string | null
          flavouring_preparation?: string | null
          food_grade?: string | null
          gamme?: string | null
          id?: number
          image_url?: string | null
          inci?: string | null
          nom_commercial?: string | null
          origine?: string | null
          ph?: string | null
          profil_aromatique?: string | null
          statut?: string | null
          tracabilite?: string | null
          typologie_de_produit?: string | null
          valorisations?: string | null
        }
        Relationships: []
      }
      cosmetique_fr: {
        Row: {
          application: string | null
          aspect: string | null
          benefices: string | null
          benefices_aqueux: string | null
          benefices_huileux: string | null
          calendrier_des_recoltes: string | null
          cas_no: string | null
          certifications: string | null
          code: string | null
          conservateurs: string | null
          description: string | null
          flavouring_preparation: string | null
          gamme: string | null
          id: number
          image_url: string | null
          inci: string | null
          nom_commercial: string | null
          origine: string | null
          partie_utilisee: string | null
          solubilite: string | null
          statut: string | null
          tracabilite: string | null
          type_de_peau: string | null
          typologie_de_produit: string | null
          valorisations: string | null
        }
        Insert: {
          application?: string | null
          aspect?: string | null
          benefices?: string | null
          benefices_aqueux?: string | null
          benefices_huileux?: string | null
          calendrier_des_recoltes?: string | null
          cas_no?: string | null
          certifications?: string | null
          code?: string | null
          conservateurs?: string | null
          description?: string | null
          flavouring_preparation?: string | null
          gamme?: string | null
          id?: number
          image_url?: string | null
          inci?: string | null
          nom_commercial?: string | null
          origine?: string | null
          partie_utilisee?: string | null
          solubilite?: string | null
          statut?: string | null
          tracabilite?: string | null
          type_de_peau?: string | null
          typologie_de_produit?: string | null
          valorisations?: string | null
        }
        Update: {
          application?: string | null
          aspect?: string | null
          benefices?: string | null
          benefices_aqueux?: string | null
          benefices_huileux?: string | null
          calendrier_des_recoltes?: string | null
          cas_no?: string | null
          certifications?: string | null
          code?: string | null
          conservateurs?: string | null
          description?: string | null
          flavouring_preparation?: string | null
          gamme?: string | null
          id?: number
          image_url?: string | null
          inci?: string | null
          nom_commercial?: string | null
          origine?: string | null
          partie_utilisee?: string | null
          solubilite?: string | null
          statut?: string | null
          tracabilite?: string | null
          type_de_peau?: string | null
          typologie_de_produit?: string | null
          valorisations?: string | null
        }
        Relationships: []
      }
      parfum_fr: {
        Row: {
          aspect: string | null
          base: string | null
          calendrier_des_recoltes: string | null
          cas_no: string | null
          certifications: string | null
          code: string | null
          description: string | null
          famille_olfactive: string | null
          flavouring_preparation: string | null
          food_grade: string | null
          id: number
          image_url: string | null
          nom_commercial: string | null
          nom_latin: string | null
          odeur: string | null
          odeur_antisudorifique: string | null
          odeur_apc: string | null
          odeur_assouplissant_textile: string | null
          odeur_detergent_liquide: string | null
          odeur_detergent_poudre: string | null
          odeur_eau_javel: string | null
          odeur_nettoyant_acide: string | null
          odeur_savon: string | null
          odeur_shampooing: string | null
          option_1: string | null
          option_2: string | null
          option_3: string | null
          option_4: string | null
          option_5: string | null
          option_6: string | null
          origine: string | null
          performance: string | null
          performance_1: string | null
          performance_2: string | null
          performance_3: string | null
          performance_4: string | null
          performance_5: string | null
          performance_6: string | null
          ph: string | null
          ph_antisudorifique: string | null
          ph_apc: string | null
          ph_assouplissant_textile: string | null
          ph_detergent_liquide: string | null
          ph_detergent_poudre: string | null
          ph_eau_javel: string | null
          ph_nettoyant_acide: string | null
          ph_savon: string | null
          ph_shampooing: string | null
          profil_olfactif: string | null
          statut: string | null
          tracabilite: string | null
          typologie_de_produit: string | null
          valorisations: string | null
        }
        Insert: {
          aspect?: string | null
          base?: string | null
          calendrier_des_recoltes?: string | null
          cas_no?: string | null
          certifications?: string | null
          code?: string | null
          description?: string | null
          famille_olfactive?: string | null
          flavouring_preparation?: string | null
          food_grade?: string | null
          id?: number
          image_url?: string | null
          nom_commercial?: string | null
          nom_latin?: string | null
          odeur?: string | null
          odeur_antisudorifique?: string | null
          odeur_apc?: string | null
          odeur_assouplissant_textile?: string | null
          odeur_detergent_liquide?: string | null
          odeur_detergent_poudre?: string | null
          odeur_eau_javel?: string | null
          odeur_nettoyant_acide?: string | null
          odeur_savon?: string | null
          odeur_shampooing?: string | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          option_5?: string | null
          option_6?: string | null
          origine?: string | null
          performance?: string | null
          performance_1?: string | null
          performance_2?: string | null
          performance_3?: string | null
          performance_4?: string | null
          performance_5?: string | null
          performance_6?: string | null
          ph?: string | null
          ph_antisudorifique?: string | null
          ph_apc?: string | null
          ph_assouplissant_textile?: string | null
          ph_detergent_liquide?: string | null
          ph_detergent_poudre?: string | null
          ph_eau_javel?: string | null
          ph_nettoyant_acide?: string | null
          ph_savon?: string | null
          ph_shampooing?: string | null
          profil_olfactif?: string | null
          statut?: string | null
          tracabilite?: string | null
          typologie_de_produit?: string | null
          valorisations?: string | null
        }
        Update: {
          aspect?: string | null
          base?: string | null
          calendrier_des_recoltes?: string | null
          cas_no?: string | null
          certifications?: string | null
          code?: string | null
          description?: string | null
          famille_olfactive?: string | null
          flavouring_preparation?: string | null
          food_grade?: string | null
          id?: number
          image_url?: string | null
          nom_commercial?: string | null
          nom_latin?: string | null
          odeur?: string | null
          odeur_antisudorifique?: string | null
          odeur_apc?: string | null
          odeur_assouplissant_textile?: string | null
          odeur_detergent_liquide?: string | null
          odeur_detergent_poudre?: string | null
          odeur_eau_javel?: string | null
          odeur_nettoyant_acide?: string | null
          odeur_savon?: string | null
          odeur_shampooing?: string | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          option_5?: string | null
          option_6?: string | null
          origine?: string | null
          performance?: string | null
          performance_1?: string | null
          performance_2?: string | null
          performance_3?: string | null
          performance_4?: string | null
          performance_5?: string | null
          performance_6?: string | null
          ph?: string | null
          ph_antisudorifique?: string | null
          ph_apc?: string | null
          ph_assouplissant_textile?: string | null
          ph_detergent_liquide?: string | null
          ph_detergent_poudre?: string | null
          ph_eau_javel?: string | null
          ph_nettoyant_acide?: string | null
          ph_savon?: string | null
          ph_shampooing?: string | null
          profil_olfactif?: string | null
          statut?: string | null
          tracabilite?: string | null
          typologie_de_produit?: string | null
          valorisations?: string | null
        }
        Relationships: []
      }
      parfum_performance: {
        Row: {
          created_at: string | null
          id: number
          option_name: string | null
          ordre: number
          performance_rating: number | null
          product_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          option_name?: string | null
          ordre: number
          performance_rating?: number | null
          product_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          option_name?: string | null
          ordre?: number
          performance_rating?: number | null
          product_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      parfum_stabilite: {
        Row: {
          base_name: string
          created_at: string | null
          id: number
          odeur_rating: number | null
          ordre: number
          ph_value: string | null
          product_code: string
          updated_at: string | null
        }
        Insert: {
          base_name: string
          created_at?: string | null
          id?: number
          odeur_rating?: number | null
          ordre: number
          ph_value?: string | null
          product_code: string
          updated_at?: string | null
        }
        Update: {
          base_name?: string
          created_at?: string | null
          id?: number
          odeur_rating?: number | null
          ordre?: number
          ph_value?: string | null
          product_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
