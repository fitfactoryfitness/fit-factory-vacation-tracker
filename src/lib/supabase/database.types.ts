// Hand-written to match supabase/migrations/0001_init.sql. There's only one
// table, so a generated-types pipeline would be overkill — update this by
// hand alongside the migration if the schema changes.
export type Database = {
  public: {
    Tables: {
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
