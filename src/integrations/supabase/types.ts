export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      patients: {
        Row: {
          address: string | null
          age: number | null
          allergies: string | null
          alternate_mobile: string | null
          blood_group: string | null
          created_at: string
          created_by: string | null
          dob: string | null
          father_husband_name: string | null
          first_visit_date: string | null
          gender: string | null
          height: number | null
          id: string
          mobile: string
          name: string
          occupation: string | null
          patient_id: string
          photo_url: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          allergies?: string | null
          alternate_mobile?: string | null
          blood_group?: string | null
          created_at?: string
          created_by?: string | null
          dob?: string | null
          father_husband_name?: string | null
          first_visit_date?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          mobile: string
          name: string
          occupation?: string | null
          patient_id?: string
          photo_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          address?: string | null
          age?: number | null
          allergies?: string | null
          alternate_mobile?: string | null
          blood_group?: string | null
          created_at?: string
          created_by?: string | null
          dob?: string | null
          father_husband_name?: string | null
          first_visit_date?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          mobile?: string
          name?: string
          occupation?: string | null
          patient_id?: string
          photo_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          created_by: string | null
          diagnosis: string | null
          doctor_notes: string | null
          dosage: string | null
          duration_days: number | null
          id: string
          medicines: string | null
          next_visit_date: string | null
          patient_id: string
          symptoms: string | null
          visit_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_notes?: string | null
          dosage?: string | null
          duration_days?: number | null
          id?: string
          medicines?: string | null
          next_visit_date?: string | null
          patient_id: string
          symptoms?: string | null
          visit_date?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_notes?: string | null
          dosage?: string | null
          duration_days?: number | null
          id?: string
          medicines?: string | null
          next_visit_date?: string | null
          patient_id?: string
          symptoms?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_patient_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      patient_portal_lookup: {
        Args: { _mobile: string; _patient_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "doctor" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
