import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function VisitorCounter() {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const { count, error } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching visitor count:', error);
          return;
        }

        setTotalVisits(count ?? 0);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchVisitorCount();
  }, []);

  if (totalVisits === null) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
      <Eye className="w-4 h-4 text-emerald-400" />
      <span className="text-sm font-medium text-emerald-200">
        {totalVisits.toLocaleString()} {totalVisits === 1 ? 'visita' : 'visite'}
      </span>
    </div>
  );
}
