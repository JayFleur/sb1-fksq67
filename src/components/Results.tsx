import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Results: React.FC = () => {
  const { id } = useParams()
  const [player1Decks, setPlayer1Decks] = useState<string[]>([])
  const [player2Decks, setPlayer2Decks] = useState<string[]>([])
  const [player1Ban, setPlayer1Ban] = useState<number>(-1)
  const [player2Ban, setPlayer2Ban] = useState<number>(-1)

  useEffect(() => {
    // Load decks and bans from localStorage
    const storedPlayer1Decks = JSON.parse(localStorage.getItem(`player1Decks_${id}`) || '[]')
    const storedPlayer2Decks = JSON.parse(localStorage.getItem(`player2Decks_${id}`) || '[]')
    const storedPlayer1Ban = localStorage.getItem(`player1Ban_${id}`)
    const storedPlayer2Ban = localStorage.getItem(`player2Ban_${id}`)
    
    setPlayer1Decks(storedPlayer1Decks)
    setPlayer2Decks(storedPlayer2Decks)
    if (storedPlayer1Ban) setPlayer1Ban(parseInt(storedPlayer1Ban))
    if (storedPlayer2Ban) setPlayer2Ban(parseInt(storedPlayer2Ban))
  }, [id])

  const getRemainingDecks = (decks: string[], banIndex: number) => {
    return decks.filter((_, index) => index !== banIndex)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Final Results</h2>
      <div>
        <h3 className="text-lg font-medium mb-2">Player 1's Remaining Decks:</h3>
        <ul className="list-disc pl-5">
          {getRemainingDecks(player1Decks, player2Ban).map((deck, index) => (
            <li key={index} className="mb-1">
              {deck}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Player 2's Remaining Decks:</h3>
        <ul className="list-disc pl-5">
          {getRemainingDecks(player2Decks, player1Ban).map((deck, index) => (
            <li key={index} className="mb-1">
              {deck}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Results