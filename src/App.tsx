import React, { useState, useEffect, useCallback } from 'react';

// Tarot card data - Simplified as meanings will be fetched dynamically.
// We only need the id and name for the dropdown.
const allTarotCards = [
  { id: 'fool', name: 'The Fool' },
  { id: 'magician', name: 'The Magician' },
  { id: 'high-priestess', name: 'The High Priestess' },
  { id: 'empress', name: 'The Empress' },
  { id: 'emperor', name: 'The Emperor' },
  { id: 'hierophant', name: 'The Hierophant' },
  { id: 'lovers', name: 'The Lovers' },
  { id: 'chariot', name: 'The Chariot' },
  { id: 'strength', name: 'Strength' },
  { id: 'hermit', name: 'The Hermit' },
  { id: 'wheel-of-fortune', name: 'Wheel of Fortune' },
  { id: 'justice', name: 'Justice' },
  { id: 'hanged-man', name: 'The Hanged Man' },
  { id: 'death', name: 'The Death' },
  { id: 'temperance', name: 'Temperance' },
  { id: 'devil', name: 'The Devil' },
  { id: 'tower', name: 'The Tower' },
  { id: 'star', name: 'The Star' },
  { id: 'moon', name: 'The Moon' },
  { id: 'sun', name: 'The Sun' },
  { id: 'judgement', name: 'Judgement' },
  { id: 'world', name: 'The World' },
  // Minor Arcana (56 cards)
  ...Array.from({ length: 14 }, (_, i) => ({ // Wands (Ace to King)
    id: `wands-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Wands`
  })),
  ...Array.from({ length: 14 }, (_, i) => ({ // Cups (Ace to King)
    id: `cups-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Cups`
  })),
  ...Array.from({ length: 14 }, (_, i) => ({ // Swords (Ace to King)
    id: `swords-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Swords`
  })),
  ...Array.from({ length: 14 }, (_, i) => ({ // Pentacles (Ace to King)
    id: `pentacles-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Pentacles`
  })),
];


// Represents the 12 positions of the Celtic Cross and Staff spread
const celticCrossPositions = [
  { id: '1', name: '1. Past' },
  { id: '2', name: '2. Present' },
  { id: '3', name: '3. What got you here' },
  { id: '4', 'name': '4. Obstacle' },
  { id: '5', name: '5. What\'s next' },
  { id: '6', name: '6. Future' },
  { id: '7', name: '7. You/Yourself' },
  { id: '8', name: '8. External Influence' },
  { id: '9', name: '9. What you need to know' },
  { id: '10', name: '10. Outcome 1' },
  { id: '11', name: '11. Outcome 2' },
  { id: '12', name: '12. Outcome 3' },
];

function App() {
  const [activeTab, setActiveTab] = useState('celticCross');
  // State to store selected cards for Celtic Cross spread
  const [celticCrossSelections, setCelticCrossSelections] = useState(
    celticCrossPositions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
  );
  // State for the card selected in the Card Selection Tool tab
  const [selectedCardForMeaning, setSelectedCardForMeaning] = useState('');
  // State to store the dynamically fetched meaning for Tab 2
  const [cardMeaningText, setCardMeaningText] = useState('Select a card to see its meaning.');
  // State to track loading status of Tab 2 card meaning
  const [isLoadingCardMeaning, setIsLoadingCardMeaning] = useState(false);

  // State to store the generated reading message (summary of cards)
  const [readMessage, setReadMessage] = useState('');
  // State to store the LLM generated interpretation for Tab 1
  const [llmInterpretation, setLlmInterpretation] = useState('');
  // State to track loading status of LLM interpretation for Tab 1
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);

  // **** IMPORTANT: REPLACE THIS WITH YOUR AWS API GATEWAY INVOKE URL ****
  // Example: 'https://abcdef123.execute-api.us-east-1.amazonaws.com/prod'
  const apiUrl = 'https://cpif4zh0bf.execute-api.eu-north-1.amazonaws.com/prod'; // <<< PASTE YOUR URL HERE

  // Handle card selection for a specific position in Celtic Cross
  const handleCardSelect = useCallback((positionId: string, cardId: string) => {
  setCelticCrossSelections(prevSelections =>
    prevSelections.map(selection =>
      selection.id === positionId ? { ...selection, cardId: cardId } : selection
    )
  );
  setReadMessage('');
  setLlmInterpretation('');
}, []);

  // Handle orientation selection for a specific position in Celtic Cross
  const handleOrientationSelect = useCallback((positionId: string, orientation: 'upright' | 'reversed') => {
  setCelticCrossSelections(prevSelections =>
    prevSelections.map(selection =>
      selection.id === positionId ? { ...selection, orientation: orientation } : selection
    )
  );
  setReadMessage('');
  setLlmInterpretation('');
}, []);

  // Fetch individual card meaning from LLM for Tab 2 via AWS Lambda proxy
  const fetchCardMeaning = useCallback(async (cardName) => {
    if (!cardName) {
      setCardMeaningText('Select a card to see its meaning.');
      return;
    }

    setCardMeaningText('Generating meaning...');
    setIsLoadingCardMeaning(true);

    const prompt = `Provide concise keyword descriptions for the Tarot card "${cardName}". Structure your answer clearly with "**Upright:**" followed by comma-separated keywords, then a blank line (double newline), and then "**Reversed:**" followed by comma-separated keywords.`;

    try {
      // Calling YOUR AWS API Gateway endpoint, which triggers your Lambda function
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the prompt as a simple JSON object, as expected by your Lambda
        body: JSON.stringify({ prompt: prompt })
      });

      const result = await response.json();
      // Your Lambda function returns a JSON object like { "interpretation": "AI generated text" }
      if (result && result.interpretation) {
        setCardMeaningText(result.interpretation);
      } else {
        setCardMeaningText('Failed to generate meaning from AI proxy. Check console for errors.');
        console.error('Proxy response unexpected for card meaning:', result);
      }
    } catch (error) {
      console.error('Error calling AWS API Gateway for card meaning:', error);
      setCardMeaningText('Error generating meaning. Please check your network connection or try again later.');
    } finally {
      setIsLoadingCardMeaning(false);
    }
  }, [apiUrl]); // Dependency on apiUrl

  // Effect to call fetchCardMeaning when selectedCardForMeaning changes
  useEffect(() => {
    if (activeTab === 'cardSelection') {
      const card = allTarotCards.find(c => c.id === selectedCardForMeaning);
      fetchCardMeaning(card ? card.name : '');
    }
  }, [selectedCardForMeaning, activeTab, fetchCardMeaning]);


  // Generate the reading message based on selected cards for Tab 1 via AWS Lambda proxy
  const generateRead = useCallback(async () => {
    const selectedCardsDetails = celticCrossSelections
      .filter(selection => selection.cardId)
      .map(selection => {
        const card = allTarotCards.find(c => c.id === selection.cardId);
        const orientationText = selection.orientation === 'upright' ? 'Upright' : 'Reversed';
        return `${selection.name}: ${card?.name} (${orientationText})`;
      });

    if (selectedCardsDetails.length < celticCrossPositions.length) {
      setReadMessage(`Please select all ${celticCrossPositions.length} cards for a full reading.`);
      setLlmInterpretation('');
      return;
    }

    setReadMessage(`Your Celtic Cross Reading Summary:\n\n${selectedCardsDetails.join('\n')}`);
    setLlmInterpretation('Generating interpretation...');
    setIsLoadingInterpretation(true);

    // Construct the prompt for the LLM for overall spread interpretation
    const prompt = `Provide a detailed Tarot reading interpretation based on the following Celtic Cross and Staff spread. Each line specifies the position, the card drawn, and its orientation (Upright/Reversed). Focus on how these cards interact and what overall message they convey. The positions are:\n${celticCrossPositions.map(p => p.name).join(', ')}.\n\nHere are the selected cards:\n${selectedCardsDetails.join('\n')}\n\nWhat is the overall interpretation of this spread?`;

    try {
      // Calling YOUR AWS API Gateway endpoint, which triggers your Lambda function
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the prompt as a simple JSON object, as expected by your Lambda
        body: JSON.stringify({ prompt: prompt })
      });

      const result = await response.json();
      // Your Lambda function returns a JSON object like { "interpretation": "AI generated text" }
      if (result && result.interpretation) {
        setLlmInterpretation(result.interpretation);
      } else {
        setLlmInterpretation('Failed to generate interpretation from AI proxy. Check console for errors.');
        console.error('Proxy response unexpected for spread interpretation:', result);
      }
    } catch (error) {
      console.error('Error calling AWS API Gateway for spread interpretation:', error);
      setLlmInterpretation('Error generating interpretation. Please check your network connection or try again later.');
    } finally {
      setIsLoadingInterpretation(false);
    }
  }, [celticCrossSelections, apiUrl]); // Dependencies on selections and apiUrl

  // Clear all selections in Celtic Cross
  const clearSelection = useCallback(() => {
    setCelticCrossSelections(
      celticCrossPositions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
    );
    setReadMessage('');
    setLlmInterpretation('');
  }, []);

  // Handles changing tabs
  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
    // When switching to Card Meanings tab, reset the selected card meaning display
    if (tabName === 'cardSelection') {
      setSelectedCardForMeaning('');
      setCardMeaningText('Select a card to see its meaning.');
    }
  }, []);


  return (
    <div className="min-h-screen bg-black text-purple-300 font-sans p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white">Chicksands Tarot</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8 w-full max-w-md">
        <button
          className={`px-6 py-3 rounded-l-lg text-lg font-semibold transition-all duration-300 ease-in-out
                      ${activeTab === 'celticCross' ? 'bg-purple-700 text-white shadow-lg' : 'bg-purple-900 text-purple-200 hover:bg-purple-800'}`}
          onClick={() => handleTabChange('celticCross')}
        >
          Celtic Cross
        </button>
        <button
          className={`px-6 py-3 rounded-r-lg text-lg font-semibold transition-all duration-300 ease-in-out
                      ${activeTab === 'cardSelection' ? 'bg-purple-700 text-white shadow-lg' : 'bg-purple-900 text-purple-200 hover:bg-purple-800'}`}
          onClick={() => handleTabChange('cardSelection')}
        >
          Card Meanings
        </button>
      </div>

      {/* Tab 1: Celtic Cross Display */}
      {activeTab === 'celticCross' && (
        <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
          <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Celtic Cross & Staff Spread</h2>
          <p className="text-md text-purple-300 mb-6 text-center">
            Select a card and its orientation for each of the 12 positions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {celticCrossSelections.map(position => (
              <div key={position.id} className="bg-purple-900 p-4 rounded-lg shadow-md border border-purple-700">
                <h3 className="text-lg font-medium text-purple-100 mb-2">{position.name}</h3>
                {/* Card Selection Dropdown */}
                <select
                  className="w-full p-2 mb-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={position.cardId}
                  onChange={(e) => handleCardSelect(position.id, e.target.value)}
                >
                  <option value="">Select Card</option>
                  {allTarotCards.map(card => (
                    // Only show cards that are not yet selected, OR the card currently selected for this position
                    <option
                      key={card.id}
                      value={card.id}
                      disabled={celticCrossSelections.some(sel => sel.cardId === card.id && sel.id !== position.id)}
                    >
                      {card.name}
                    </option>
                  ))}
                </select>

                {/* Orientation Selection */}
                {position.cardId && (
                  <div className="flex justify-around items-center text-purple-200">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`orientation-${position.id}`}
                        value="upright"
                        checked={position.orientation === 'upright'}
                        onChange={() => handleOrientationSelect(position.id, 'upright')}
                        className="form-radio text-purple-500 h-4 w-4"
                      />
                      <span className="ml-2">Upright</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`orientation-${position.id}`}
                        value="reversed"
                        checked={position.orientation === 'reversed'}
                        onChange={() => handleOrientationSelect(position.id, 'reversed')}
                        className="form-radio text-purple-500 h-4 w-4"
                      />
                      <span className="ml-2">Reversed</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={generateRead}
              disabled={isLoadingInterpretation} // Disable button while loading
            >
              {isLoadingInterpretation ? 'Generating...' : 'Generate Read'}
            </button>
            <button
              className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={clearSelection}
              disabled={isLoadingInterpretation} // Disable button while loading
            >
              Clear Selection
            </button>
          </div>

          {/* Reading Summary Display */}
          {readMessage && (
            <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap mt-6">
              <h3 className="text-xl font-semibold mb-3 text-center">Your Reading Summary:</h3>
              <p className="text-lg">{readMessage}</p>
            </div>
          )}

          {/* LLM Interpretation Display */}
          {llmInterpretation && (
            <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap mt-6">
              <h3 className="text-xl font-semibold mb-3 text-center">AI Interpretation:</h3>
              <p className="text-lg">
                {isLoadingInterpretation ? 'Please wait, generating a comprehensive interpretation...' : llmInterpretation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Card Selection Tool */}
      {activeTab === 'cardSelection' && (
        <div className="w-full max-w-2xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
          <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Card Meaning Tool</h2>
          <p className="text-md text-purple-300 mb-6 text-center">
            Select any tarot card to see its brief upright and reversed keyword meanings.
          </p>

          <div className="mb-8">
            <label htmlFor="card-meaning-select" className="block text-lg font-medium text-purple-200 mb-2">
              Select a Card:
            </label>
            <select
              id="card-meaning-select"
              className="w-full p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              value={selectedCardForMeaning}
              onChange={(e) => setSelectedCardForMeaning(e.target.value)}
              disabled={isLoadingCardMeaning} // Disable while loading
            >
              <option value="">-- Choose a Card --</option>
              {allTarotCards.map(card => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display Card Meaning */}
          <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100"> {/* Removed whitespace-pre-wrap */}
            <h3 className="text-xl font-semibold mb-3 text-center">Meaning:</h3>
            <p className="text-lg">
              {isLoadingCardMeaning ? 'Generating meaning...' : (
                <span dangerouslySetInnerHTML={{ __html: cardMeaningText.replace(/\n/g, '<br />') }} />
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
