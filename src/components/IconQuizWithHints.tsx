import React, {
    useState,
    useEffect,
    ChangeEvent,
    KeyboardEvent,
    useRef,
} from 'react';
import Fuse from 'fuse.js';
import spells from '../data/spells.json';

export type Spell = {
    id: number;
    names: string[];
    iconUrl: string;
    hint: string;
    description: string;
};

const allSpells: Spell[] = spells;
const allNames = Array.from(
    new Set(allSpells.flatMap((s) => s.names))
).sort();

const fuse = new Fuse(allNames, {
    threshold: 0.4,
    ignoreLocation: true,
    distance: 100,
});

export default function IconQuiz() {
    const [spell, setSpell] = useState<Spell | null>(null);
    const [wrongs, setWrongs] = useState<string[]>([]);
    const [availNames, setAvailNames] = useState<string[]>(allNames);
    const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(10);
    const [guess, setGuess] = useState('');

    const pickNextSpell = () => {
        let remaining = allSpells.filter((s) => !usedIds.has(s.id));
        if (remaining.length === 0) {
            return;
        }
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setSpell(next);
        setWrongs([]);
        setAvailNames(allNames);
        setUsedIds((prev) => new Set(prev).add(next.id));
        setGuess('');
    };

    useEffect(() => {
        pickNextSpell();
    }, []);

    useEffect(() => {
        if (wrongs.length >= 3) {
            setLives((l) => l - 1);
            pickNextSpell();
        }
    }, [wrongs]);

    useEffect(() => {
        if (lives <= 0) {
            alert('Out of lives! Restarting quiz.');
            setScore(0);
            setLives(10);
            setUsedIds(new Set());
            pickNextSpell();
        }
    }, [lives]);

    const makeGuess = (value: string) => {
        if (!spell) return;
        const match = spell.names.find(
            (n) => n.toLowerCase() === value.toLowerCase()
        );
        if (match) {
            setScore((s) => s + 1);
            pickNextSpell();
        } else {
            setWrongs((ws) => [...ws, value]);
            setAvailNames((a) => a.filter((n) => n !== value));
            setLives((l) => l - 1);
        }
        setGuess('');
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGuess(e.target.value);
    };
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestions.length > 0) {
                makeGuess(suggestions[0]);
            }
        }
    };

    const suggestions =
        guess.length >= 3
            ? fuse.search(guess).map((res) => res.item).slice(0, 10)
            : [];

    const showHint = wrongs.length >= 1;
    const showDesc = wrongs.length >= 2;

    const onPass = () => {
        setLives((l) => l - 1);
        pickNextSpell();
    };

    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setGuess((g) => g);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!spell) return null;

    return (
        <div
            style={{
                fontFamily: '"Segoe UI", Roboto, sans-serif',
                backgroundColor: '#121212',
                color: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
                padding: 16,
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: 400,
                    padding: 16,
                }}
            >
                <h1 style={{ fontSize: 24, marginBottom: 8 }}>
                    Guess the ability name
                </h1>
                <h2 style={{ fontSize: 18, color: '#ccc', marginBottom: 16 }}>
                    Score: {score} · Lives: {lives}
                </h2>

                <img
                    src={spell.iconUrl}
                    alt={spell.names[0]}
                    style={{
                        width: 96,
                        height: 96,
                        objectFit: 'contain',
                        marginBottom: 16,
                    }}
                />

                <div style={{ minHeight: 48, marginBottom: 16 }}>
                    {showHint && (
                        <p style={{ color: '#bbb', fontSize: 16, margin: 0 }}>
                            <strong>Hint:</strong> {spell.hint}
                        </p>
                    )}
                    {showDesc && (
                        <p style={{ color: '#999', fontSize: 14, marginTop: 4 }}>
                            {spell.description}
                        </p>
                    )}
                </div>

                <div
                    ref={wrapperRef}
                    style={{ position: 'relative', marginBottom: 16 }}
                >
                    <input
                        type="text"
                        placeholder="Type to guess…"
                        value={guess}
                        onChange={onInputChange}
                        onKeyDown={onKeyDown}
                        style={{
                            width: '100%',
                            padding: 12,
                            fontSize: 16,
                            borderRadius: 6,
                            border: '1px solid #444',
                            backgroundColor: '#1e1e1e',
                            color: '#eee',
                            boxSizing: 'border-box',
                        }}
                        autoFocus
                    />

                    {suggestions.length > 0 && (
                        <ul
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                maxHeight: 150,
                                overflowY: 'auto',
                                backgroundColor: '#1e1e1e',
                                border: '1px solid #444',
                                borderTop: 'none',
                                borderRadius: '0 0 6px 6px',
                                margin: 0,
                                padding: 0,
                                listStyle: 'none',
                                zIndex: 10,
                            }}
                        >
                            {suggestions.map((n) => (
                                <li
                                    key={n}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => makeGuess(n)}
                                    style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                    }}
                                >
                                    {n}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={onPass}
                    style={{
                        marginBottom: 16,
                        padding: '8px 16px',
                        fontSize: 16,
                        borderRadius: 6,
                        border: 'none',
                        backgroundColor: '#444',
                        color: '#eee',
                        cursor: 'pointer',
                    }}
                >
                    Pass (−1 life)
                </button>

                <div style={{ height: 60, overflowY: 'auto' }}>
                    {wrongs.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {wrongs.map((g, i) => (
                                <li key={i} style={{ color: '#e74c3c', fontSize: 14 }}>
                                    {g}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
