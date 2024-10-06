import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface PlayerInputProps {
  playerNumber: number;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ playerNumber }) => {
  const [decks, setDecks] = useState(['', '', '']);
  const [shareableLink, setShareableLink] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerNumber === 1) {
      const newId = Math.random().toString(36).substr(2, 9);
      const link = `${window.location.origin}/player2/${newId}`;
      setShareableLink(link);
      localStorage.setItem(`player1Decks_${newId}`, JSON.stringify(decks));
      localStorage.setItem(`playerIdentifier_${newId}`, 'player1');
      localStorage.setItem(`gameId`, newId);
    } else {
      localStorage.setItem(`player2Decks_${id}`, JSON.stringify(decks));
      localStorage.setItem(`playerIdentifier_${id}`, 'player2');
      navigate(`/ban/${id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Player {playerNumber}: Enter Your Deck Codes</h2>
      {decks.map((deck, index) => (
        <input
          key={index}
          type="text"
          value={deck}
          onChange={(e) => {
            const newDecks = [...decks];
            newDecks[index] = e.target.value;
            setDecks(newDecks);
          }}
          placeholder={`Deck ${index + 1}`}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        {playerNumber === 1 ? 'Generate Link' : 'Submit Decks'}
      </button>
      {shareableLink && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p className="font-semibold">Share this link with your opponent:</p>
          <a href={shareableLink} className="text-blue-600 break-all">{shareableLink}</a>
          <p className="mt-2">Waiting for your opponent to submit their decks...</p>
          <button
            onClick={() => navigate(`/ban/${localStorage.getItem('gameId')}`)}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Proceed to Ban Phase
          </button>
        </div>
      )}
    </form>
  );
};

export default PlayerInput;