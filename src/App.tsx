import { useState } from 'react';
import IconQuiz from './components/IconQuiz';
import Leaderboard from './components/Leaderboard';
import NameModal from './components/NameModal';
import { submitScore } from './lib/supabase';

export default function App() {
  const [view, setView] = useState<'quiz' | 'leaderboard'>('quiz');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);
  const [quizKey, setQuizKey] = useState(0);

  const bumpQuizKey = () => setQuizKey((k) => k + 1);

  const [localHighScore, setLocalHighScore] = useState(() => {
    const v = localStorage.getItem('wowQuizHighScore');
    return v ? parseInt(v, 10) : 0;
  });
  const [localName, setLocalName] = useState(() => {
    return localStorage.getItem('wowQuizPlayerName') || '';
  });

  const handleGameOver = (finalScore: number) => {
    if (finalScore > localHighScore) {
      setPendingScore(finalScore);
      setModalOpen(true);
    } else {
      setView('leaderboard');
    }
  };

  const handleModalSubmit = (name: string) => {
    localStorage.setItem('wowQuizHighScore', pendingScore.toString());
    localStorage.setItem('wowQuizPlayerName', name);

    setLocalHighScore(pendingScore);
    setLocalName(name);

    submitScore(name, pendingScore).catch(console.error);

    setModalOpen(false);
    setView('leaderboard');
  };

  const handleToggleView = () => {
    if (view === 'quiz') {
      setView('leaderboard');
    } else {
      setView('quiz');
      bumpQuizKey();
    }
  };

  return (
    <div style={{
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      backgroundColor: '#121212',
      color: '#eee',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <button
        onClick={handleToggleView}
        style={{
          position: 'absolute', top: 16, right: 16,
          padding: '8px 16px', fontSize: 16,
          borderRadius: 6, border: 'none',
          backgroundColor: '#444', color: '#eee',
          cursor: 'pointer', zIndex: 1000,
        }}
      >
        {view === 'quiz' ? 'Show Leaderboard' : 'Play Again'}
      </button>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        boxSizing: 'border-box',
      }}>
        {view === 'quiz'
          ? <IconQuiz key={quizKey} onGameOver={handleGameOver} />
          : <Leaderboard />
        }
      </div>

      <NameModal
        isOpen={modalOpen}
        initialName={localName}
        title="🎉 New High Score!"
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
