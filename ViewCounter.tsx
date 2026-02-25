import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  // If env vars are missing/misconfigured, keep it disabled (no hard crash)
  supabase = null;
}

export function ViewCounter() {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const fetchViewCount = async () => {
      try {
        const { count } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true });

        if (count !== null) {
          setViewCount(count);
        }
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchViewCount();
  }, []);

  if (!supabase || viewCount === null) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 text-emerald-300/40 text-xs">
      <Eye className="w-3 h-3" />
      <span>{viewCount.toLocaleString()} views</span>
    </div>
  );
}
