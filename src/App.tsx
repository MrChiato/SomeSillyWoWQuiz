import { useState } from 'react';
import IconQuiz from './components/IconQuiz';
import Leaderboards from './components/Leaderboard';
import NameModal from './components/NameModal';
import DataPage from './pages/DataPage';
import { fetchLeaderboard, submitScore } from './lib/supabase';

export default function App() {
  const [view, setView] = useState<'quiz' | 'leaderboard' | 'data'>('quiz');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);
  const [quizKey, setQuizKey] = useState(0);
  const [quizMode, setQuizMode] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameOverInfo, setGameOverInfo] = useState<{
    finalScore: number;
    bestScore: number;
    mode: 'easy' | 'medium' | 'hard';
  } | null>(null);

  const bumpQuizKey = () => setQuizKey((k) => k + 1);

  const handleGameOver = (
    finalScore: number,
    mode: 'easy' | 'medium' | 'hard'
  ) => {
    setQuizMode(mode);
    const keyScore = `wowQuizHighScorev2_${mode}`;
    const stored = parseInt(localStorage.getItem(keyScore) || '0', 10);
    if (finalScore > stored) {
      setPendingScore(finalScore);
      setModalOpen(true);
    } else {
      setGameOverInfo({ finalScore, bestScore: stored, mode });
    }
  };

  const handleModalSubmit = async (name: string) => {
    const keyScore = `wowQuizHighScorev2_${quizMode}`;
    const keyName = `wowQuizPlayerNamev2_${quizMode}`;
    localStorage.setItem(keyScore, pendingScore.toString());
    localStorage.setItem(keyName, name);
    const clean = name.trim().slice(0, 20);
    if (!clean) return;
    try {
      await submitScore(clean, pendingScore, quizMode);
      await fetchLeaderboard(quizMode);
      setModalOpen(false);
      setView('leaderboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      backgroundColor: '#121212',
      color: '#eee',
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {view !== 'data' && (
        <button
          onClick={() => setView('data')}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            padding: '8px 16px',
            fontSize: 16,
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#444',
            color: '#eee',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          Show Data
        </button>
      )}

      {view === 'data' ? (
        <button
          onClick={() => {
            setView('quiz');
            bumpQuizKey();
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: '8px 16px',
            fontSize: 16,
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#444',
            color: '#eee',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          Back to Quiz
        </button>
      ) : (
        <button
          onClick={() => {
            if (view === 'quiz') setView('leaderboard');
            else {
              setView('quiz');
              bumpQuizKey();
            }
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: '8px 16px',
            fontSize: 16,
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#444',
            color: '#eee',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          {view === 'quiz' ? 'Show Leaderboard' : 'Play Again'}
        </button>
      )}

      <div style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        boxSizing: 'border-box',
        padding: 16,
      }}>
        {view === 'quiz' && <IconQuiz key={quizKey} onGameOver={handleGameOver} />}
        {view === 'leaderboard' && <Leaderboards />}
        {view === 'data' && <DataPage />}
      </div>

      <NameModal
        isOpen={modalOpen}
        initialName={localStorage.getItem(`wowQuizPlayerNamev2_${quizMode}`) || ''}
        title="🎉 New High Score! 🎉"
        onSubmit={handleModalSubmit}
        onClose={() => {
          setModalOpen(false);
          localStorage.setItem(
            `wowQuizHighScorev2_${quizMode}`,
            pendingScore.toString()
          );
          setGameOverInfo({
            finalScore: pendingScore,
            bestScore: pendingScore,
            mode: quizMode,
          });
        }}
      />

      {view !== 'data' && gameOverInfo && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#1e1e1e',
            color: '#eee',
            padding: '2rem',
            borderRadius: 8,
            width: '90%',
            maxWidth: 360,
            textAlign: 'center',
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Game Over</h2>
            <p style={{ margin: '0.5rem 0' }}>
              Final score: <strong>{gameOverInfo.finalScore}</strong>
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              Best for <em>{gameOverInfo.mode}</em>: <strong>{gameOverInfo.bestScore}</strong>
            </p>
            <button
              onClick={() => {
                setGameOverInfo(null);
                bumpQuizKey();
                setView('quiz');
              }}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                borderRadius: 4,
                border: 'none',
                backgroundColor: '#28a745',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
