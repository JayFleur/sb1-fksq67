import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BanPhase: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [playerBan, setPlayerBan] = useState<number | null>(null);
  const [isPlayer1, setIsPlayer1] = useState<boolean | null>(null);
  const [opponentDecks, setOpponentDecks] = useState<string[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [opponentBan, setOpponentBan] = useState<number | null>(null);
  const [hasBanned, setHasBanned] = useState(false);

  useEffect(() => {
    const playerIdentifier = localStorage.getItem(`playerIdentifier_${id}`);

    if (playerIdentifier) {
      const isPlayer1Local = playerIdentifier === 'player1';
      setIsPlayer1(isPlayer1Local);

      const checkOpponentData = () => {
        const storedPlayer1Decks = JSON.parse(localStorage.getItem(`player1Decks_${id}`) || '[]');
        const storedPlayer2Decks = JSON.parse(localStorage.getItem(`player2Decks_${id}`) || '[]');

        if (isPlayer1Local) {
          if (storedPlayer2Decks.length > 0) {
            setOpponentDecks(storedPlayer2Decks);
            setIsWaiting(false);
          } else {
            setIsWaiting(true);
          }
        } else {
          if (storedPlayer1Decks.length > 0) {
            setOpponentDecks(storedPlayer1Decks);
            setIsWaiting(false);
          } else {
            setIsWaiting(true);
          }
        }

        if (hasBanned) {
          const storedOpponentBan = localStorage.getItem(`${isPlayer1Local ? 'player2' : 'player1'}Ban_${id}`);
          if (storedOpponentBan !== null) {
            setOpponentBan(parseInt(storedOpponentBan, 10));
          }
        }
      };

      // Initial load
      checkOpponentData();

      // Polling mechanism to check every second for opponent data updates
      const interval = setInterval(checkOpponentData, 1000);

      return () => clearInterval(interval);
    }
  }, [id, hasBanned]);

  const handleBan = (banIndex: number) => {
    setPlayerBan(banIndex);
  };

  const handleSubmit = () => {
    if (playerBan !== null) {
      localStorage.setItem(`${isPlayer1 ? 'player1' : 'player2'}Ban_${id}`, playerBan.toString());
      setHasBanned(true);

      const opponentBanKey = `${isPlayer1 ? 'player2' : 'player1'}Ban_${id}`;
      const opponentHasBanned = localStorage.getItem(opponentBanKey) !== null;

      if (opponentHasBanned) {
        navigate(`/results/${id}`);
      }
    } else {
      alert('Please select a deck to ban before submitting.');
    }
  };

  if (isWaiting) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Waiting for Opponent</h2>
        <p>Your opponent hasn't submitted their decks yet. Please wait, the page will update automatically once they've done so.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Ban Phase</h2>
      <div>
        <h3 className="text-lg font-medium mb-2">Opponent's Decks:</h3>
        {opponentDecks.map((deck: string, index: number) => (
          <button
            key={index}
            onClick={() => handleBan(index)}
            className={`w-full p-2 mb-2 text-left border ${
              playerBan === index ? 'bg-red-200 border-red-500' : 'border-gray-300'
            } rounded hover:bg-gray-100`}
          >
            {deck}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Submit Ban
      </button>
      {hasBanned && opponentBan === null && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Waiting for Opponent</h3>
          <p>You have submitted your ban. Waiting for your opponent to submit their ban...</p>
        </div>
      )}
      {hasBanned && opponentBan !== null && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Opponent's Ban:</h3>
          <p>Deck {opponentBan + 1} is banned by your opponent.</p>
        </div>
      )}
    </div>
  );
};

export default BanPhase;