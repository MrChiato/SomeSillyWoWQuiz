import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../lib/supabase';

const MODES = ['easy', 'medium', 'hard'] as const;

type ScoreRow = { name: string; score: number };

export default function Leaderboards() {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                gap: 16,
                padding: 16,
            }}
        >
            {MODES.map((mode) => (
                <ModeBoard key={mode} mode={mode} />
            ))}
        </div>
    );
}

function ModeBoard({ mode }: { mode: typeof MODES[number] }) {
    const [board, setBoard] = useState<ScoreRow[]>([]);

    useEffect(() => {
        fetchLeaderboard(mode).then(setBoard).catch(console.error);
    }, [mode]);

    return (
        <div
            style={{
                flex: '1 1 300px',
                maxWidth: 300,
                backgroundColor: '#1e1e1e',
                borderRadius: 8,
                padding: 16,
                boxSizing: 'border-box',
            }}
        >
            <h2
                style={{
                    textAlign: 'center',
                    margin: '0 0 12px',
                    color: '#FFC946',
                    textTransform: 'capitalize',
                }}
            >
                {mode} Mode
            </h2>
            <ol
                style={{
                    padding: 0,
                    margin: 0,
                    listStyle: 'none',
                    color: '#eee',
                }}
            >
                {board.map((row, i) => (
                    <li
                        key={i}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '4px 0',
                            fontSize: 16,
                            borderBottom: '1px solid #333',
                        }}
                    >
                        <span>{i + 1}. {row.name}</span>
                        <span>{row.score}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
