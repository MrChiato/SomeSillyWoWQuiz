import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../lib/supabase';

export default function Leaderboard() {
    const [board, setBoard] = useState<{ name: string; score: number }[]>([]);

    useEffect(() => {
        fetchLeaderboard()
            .then(setBoard)
            .catch(console.error);
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>🏆 Leaderboard</h1>
            <ol style={{
                padding: 0,
                listStyle: 'none',
                textAlign: 'left',
                maxWidth: '200px',
                margin: '0 auto',
            }}>
                {board.map((row, i) => (
                    <li
                        key={i}
                        style={{
                            fontSize: 18,
                            margin: '8px 0',
                            color: '#eee'
                        }}
                    >
                        {i + 1}. {row.name} <strong style={{ float: 'right' }}>{row.score}</strong>
                    </li>
                ))}
            </ol>
        </div>
    );
}
