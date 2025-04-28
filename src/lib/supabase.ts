import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchLeaderboard() {
    const { data, error } = await supabase
        .from('scores')
        .select('name,score')
        .order('score', { ascending: false })
        .limit(10);
    if (error) throw error;
    return data;
}

export async function submitScore(name: string, score: number) {
    const { error } = await supabase
        .from('scores')
        .insert([{ name, score }]);
    if (error) throw error;
}
