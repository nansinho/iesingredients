export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      blog_articles: {
        Row: {
          author_name: string | null
          category: string
          content_en: string | null
          content_fr: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt_en: string | null
          excerpt_fr: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title_en: string | null
          title_fr: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          category?: string
          content_en?: string | null
          content_fr?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title_en?: string | null
          title_fr: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          category?: string
          content_en?: string | null
          content_fr?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_fr?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title_en?: string | null
          title_fr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          notes: string | null
          phone: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
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
          origine: string | null
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
          origine?: string | null
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
          origine?: string | null
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
          performance_value: string | null
          product_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          option_name?: string | null
          ordre: number
          performance_rating?: number | null
          performance_value?: string | null
          product_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          option_name?: string | null
          ordre?: number
          performance_rating?: number | null
          performance_value?: string | null
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
      product_history: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          product_code: string
          product_type: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          product_code: string
          product_type: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          product_code?: string
          product_type?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sample_request_items: {
        Row: {
          created_at: string | null
          id: string
          product_category: string | null
          product_code: string
          product_name: string
          quantity: number | null
          request_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_category?: string | null
          product_code: string
          product_name: string
          quantity?: number | null
          request_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_category?: string | null
          product_code?: string
          product_name?: string
          quantity?: number | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sample_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "sample_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_requests: {
        Row: {
          company: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          message: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio_en: string | null
          bio_fr: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          phone: string | null
          photo_url: string | null
          role_en: string | null
          role_fr: string
          updated_at: string | null
        }
        Insert: {
          bio_en?: string | null
          bio_fr?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          role_en?: string | null
          role_fr: string
          updated_at?: string | null
        }
        Update: {
          bio_en?: string | null
          bio_fr?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          role_en?: string | null
          role_fr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: "admin" | "user"
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: "admin" | "user"
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: "admin" | "user"
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: "admin" | "user"
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  T extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][T]["Row"]

export type TablesInsert<
  T extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<
  T extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][T]["Update"]
