import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchLeaderboard(mode: string) {
    const { data, error } = await supabase
        .from('scores')
        .select('name,score')
        .eq('mode', mode)
        .order('score', { ascending: false })
        .limit(10);
    if (error) throw error;
    return data;
}

export async function submitScore(
    name: string,
    score: number,
    mode: string
) {
    const { error } = await supabase
        .from('scores')
        .insert([{ name, score, mode }]);
    if (error) throw error;
}
