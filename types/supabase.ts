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
      container: {
        Row: {
          amount: number
          bill_number: string
          id: number
          transit_id: number
        }
        Insert: {
          amount: number
          bill_number: string
          id?: never
          transit_id: number
        }
        Update: {
          amount?: number
          bill_number?: string
          id?: never
          transit_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_container_transit_id_fkey"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "transit"
            referencedColumns: ["id"]
          },
        ]
      }
      status: {
        Row: {
          id: number
          location: string
          remark: string
          timestamp: string
          transit_id: number
        }
        Insert: {
          id?: never
          location: string
          remark: string
          timestamp?: string
          transit_id: number
        }
        Update: {
          id?: never
          location?: string
          remark?: string
          timestamp?: string
          transit_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_status_transit_id_fkey"
            columns: ["transit_id"]
            isOneToOne: false
            referencedRelation: "transit"
            referencedColumns: ["id"]
          },
        ]
      }
      transit: {
        Row: {
          as_per_bill: boolean
          billing_date: string
          company_name: string
          contact_number: string
          created_at: string
          destination: string
          id: number
          on_the_record: boolean
          origin: string
          reached_destination: boolean
          received: boolean
          scan_for_every_bill: boolean
          shipping_company: string
          tally_entry_to_goods: boolean
          tracking_id: string
          updated_at: string
        }
        Insert: {
          as_per_bill?: boolean
          billing_date: string
          company_name: string
          contact_number: string
          created_at?: string
          destination: string
          id?: never
          on_the_record?: boolean
          origin: string
          reached_destination?: boolean
          received?: boolean
          scan_for_every_bill?: boolean
          shipping_company: string
          tally_entry_to_goods?: boolean
          tracking_id: string
          updated_at?: string
        }
        Update: {
          as_per_bill?: boolean
          billing_date?: string
          company_name?: string
          contact_number?: string
          created_at?: string
          destination?: string
          id?: never
          on_the_record?: boolean
          origin?: string
          reached_destination?: boolean
          received?: boolean
          scan_for_every_bill?: boolean
          shipping_company?: string
          tally_entry_to_goods?: boolean
          tracking_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name?: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
