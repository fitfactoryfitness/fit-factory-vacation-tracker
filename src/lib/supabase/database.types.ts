// Hand-written to match supabase/migrations/*.sql. Just two tables, so a
// generated-types pipeline would be overkill — update this by hand
// alongside any new migration.
export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          name: string;
          team: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          team: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          team?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      time_off: {
        Row: {
          id: string;
          employee_id: string;
          start_date: string;
          end_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          start_date: string;
          end_date: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          start_date?: string;
          end_date?: string;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
