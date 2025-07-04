// @ts-ignore
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
  { id: 1, name: '1. Past' },
  { id: 2, name: '2. Present' },
  { id: 3, name: '3. What got you here' },
  { id: 4, 'name': '4. Obstacle' },
  { id: 5, name: '5. What\'s next' },
  { id: 6, name: '6. Future' },
  { id: 7, name: '7. You/Yourself' },
  { id: 8, name: '8. External Influence' },
  { id: 9, name: '9. What you need to know' },
  { id: 10, name: '10. Outcome 1' },
  { id: 11, name: '11. Outcome 2' },
  { id: 12, name: '12. Outcome 3' },
];

// Removed unused threeCardPositions and heartAndHeadPositions for now to clear TS6133 warnings.
// They can be re-added when their functionality is implemented.


// --- Updated: Menu Structure Data ---
const menuItems = [
  {
    id: 'tarot',
    name: 'Tarot',
    subItems: [
      { id: 'celticCross', name: 'Celtic Cross' },
      { id: 'starSpread', name: 'Star Spread' },
      { id: 'threeCard', name: 'Three Card' },
      { id: 'heartAndHead', name: 'Heart and Head' },
      { id: 'pastPresentFuture', name: 'Past Present & Future' },
      { id: 'treeOfLife', name: 'Tree of Life' },
      { id: 'horseshoe', name: 'Horseshoe' },
      { id: 'yearAhead', name: 'Year Ahead' },
      { id: 'monthAhead', name: 'Month Ahead' },
      { id: 'weekAhead', name: 'Week Ahead' },
      { id: 'cardMeanings', name: 'Card Meanings' },
    ],
  },
  {
    id: 'elements',
    name: 'Elements',
    subItems: [
      { id: 'earth', name: 'Earth' },
      { id: 'wind', name: 'Wind' },
      { id: 'fire', name: 'Fire' },
      { id: 'water', name: 'Water' },
      { id: 'soul', name: 'Soul' },
    ],
  },
  {
    id: 'zodiac',
    name: 'Zodiac',
    subItems: [
      { id: 'aries', name: 'Aries' },
      { id: 'taurus', name: 'Taurus' },
      { id: 'gemini', name: 'Gemini' },
      { id: 'cancer', name: 'Cancer' },
      { id: 'leo', name: 'Leo' },
      { id: 'virgo', name: 'Virgo' },
      { id: 'libra', name: 'Libra' },
      { id: 'scorpio', name: 'Scorpio' },
      { id: 'sagittarius', name: 'Sagittarius' },
      { id: 'capricorn', name: 'Capricorn' },
      { id: 'aquarius', name: 'Aquarius' },
      { id: 'pisces', name: 'Pisces' },
    ],
  },
  // --- New Categories ---
  { id: 'herbMagic', name: 'Herb Magic' },
  { id: 'incenseOils', name: 'Incense & Oils' },
  {
    id: 'cardinalPoints',
    name: 'Cardinal Points',
    subItems: [
      { id: 'north', name: 'North' },
      { id: 'east', name: 'East' },
      { id: 'south', name: 'South' },
      { id: 'west', name: 'West' },
    ],
  },
  { id: 'colourTheory', name: 'Colour Theory' },
  { id: 'crystals', name: 'Crystals' },
  { id: 'deities', name: 'Deities' },
  {
    id: 'runes',
    name: 'Runes',
    subItems: [
      { id: 'witchesRunes', name: 'Witches Runes' },
      { id: 'elderFuthark', name: 'Elder Futhark' },
      { id: 'youngerFuthark', name: 'Younger Futhark' },
    ],
  },
];

// --- Zodiac Signs Data (no change) ---
const zodiacSignsData = [
  { id: 'aries', name: 'Aries', symbol: '♈', description: 'Aries, the first sign of the zodiac, is known for its pioneering spirit, courage, and enthusiasm. Ruled by Mars, they are natural leaders, assertive, and driven by passion. They can be impulsive but are also incredibly energetic and direct.' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', description: 'Taurus is an Earth sign, symbolizing stability, practicality, and determination. Ruled by Venus, they appreciate beauty, comfort, and luxury. Taureans are known for their patience and persistence, but can also be stubborn and resistant to change.' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', description: 'Gemini, an Air sign ruled by Mercury, is characterized by duality, communication, and intellect. Geminis are curious, adaptable, and quick-witted, often possessing a lively and engaging personality. They can be restless and indecisive due to their dual nature.' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', description: 'Cancer is a Water sign ruled by the Moon, representing emotions, nurturing, and home. Cancers are deeply empathetic, intuitive, and protective of their loved ones. They can be sensitive and prone to mood swings, but offer immense comfort and support.' },
  { id: 'leo', name: 'Leo', symbol: '♌', description: 'Leo, a Fire sign ruled by the Sun, embodies confidence, charisma, and generosity. Leos love to be the center of attention, are natural performers, and possess a warm, vibrant energy. They are fiercely loyal but can also be proud and dramatic.' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', description: 'Virgo is an Earth sign ruled by Mercury, known for its practicality, analytical mind, and meticulous nature. Virgos are hardworking, organized, and always striving for perfection. They can be critical, but their desire to serve and improve is strong.' },
  { id: 'libra', name: 'Libra', symbol: '♎', description: 'Libra, an Air sign ruled by Venus, symbolizes balance, harmony, and justice. Librans are charming, diplomatic, and seek fairness in all aspects of life. They value relationships and beauty, but can be indecisive and avoid confrontation.' },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', description: 'Scorpio is a Water sign ruled by Pluto (and Mars), representing intensity, transformation, and power. Scorpios are passionate, mysterious, and deeply emotional, with a strong intuition. They are fiercely determined but can also be secretive and possessive.' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', description: 'Sagittarius, a Fire sign ruled by Jupiter, embodies adventure, optimism, and a love for freedom. Sagittarians are philosophical, enthusiastic, and always seeking new experiences. They are honest but can be tactless and restless.' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', description: 'Capricorn is an Earth sign ruled by Saturn, symbolizing discipline, ambition, and responsibility. Capricorns are practical, patient, and driven to achieve their goals. They are reliable but can be rigid and overly serious.' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', description: 'Aquarius, an Air sign ruled by Uranus (and Saturn), represents innovation, independence, and humanitarianism. Aquarians are intellectual, progressive, and value freedom and equality. They can be eccentric and detached but are visionaries.' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', description: 'Pisces is a Water sign ruled by Neptune (and Jupiter), symbolizing compassion, intuition, and artistic sensitivity. Pisceans are dreamy, empathetic, and highly imaginative. They can be escapist and overly sensitive but possess deep spiritual wisdom.' },
];

// --- New: Witches Runes Data ---
const witchesRunesData = [
  { id: 'ring', name: 'Ring', symbol: '⚪', description: 'Represents cycles, wholeness, partnership, and completion. It can signify a new beginning or the end of a phase.' },
  { id: 'wave', name: 'Wave', symbol: '🌊', description: 'Symbolizes emotions, intuition, flow, and adaptability. It relates to water, feelings, and the unconscious mind.' },
  { id: 'crossed-lines', name: 'Crossed Lines', symbol: '✖️', description: 'Indicates crossroads, choices, conflict, or obstacles. It suggests a decision needs to be made or a challenge overcome.' },
  { id: 'star', name: 'Star', symbol: '⭐', description: 'Represents hope, inspiration, guidance, and destiny. It signifies good fortune, clarity, and following your true path.' },
  { id: 'sun', name: 'Sun', symbol: '☀️', description: 'Symbolizes success, happiness, vitality, and illumination. It brings warmth, clarity, and positive energy.' },
  { id: 'moon', name: 'Moon', symbol: '🌙', description: 'Represents intuition, mystery, hidden knowledge, and the subconscious. It relates to cycles, dreams, and feminine energy.' },
  { id: 'flight', name: 'Flight', symbol: '🕊️', description: 'Indicates movement, travel, news, or a message. It can signify freedom, escape, or a new perspective.' },
  { id: 'eye', name: 'Eye', symbol: '👁️', description: 'Symbolizes perception, insight, wisdom, and protection. It suggests seeing clearly or being watched.' },
  { id: 'harvest', name: 'Harvest', symbol: '🌾', description: 'Represents abundance, prosperity, growth, and completion of a project. It signifies rewards for effort and fruitful outcomes.' },
  { id: 'scythe', name: 'Scythe', symbol: '🔪', description: 'Indicates cutting away, ending, transformation, or warning. It suggests the need to release what no longer serves you.' },
  { id: 'man', name: 'Man', symbol: '♂️', description: 'Represents masculine energy, action, logic, and the self. It can refer to a male figure or active principles.' },
  { id: 'woman', name: 'Woman', symbol: '♀️', description: 'Represents feminine energy, intuition, nurturing, and receptivity. It can refer to a female figure or passive principles.' },
  { id: 'crossroads', name: 'Crossroads', symbol: '➕', description: 'A more direct symbol for choices, decisions, and the intersection of paths. Similar to Crossed Lines but often more about a clear path forward.' },
];


// --- Menu Component (no change) ---
interface MenuItem {
  id: string;
  name: string;
  subItems?: MenuItem[];
}

interface MenuProps {
  menuItems: MenuItem[];
  selectedItem: string;
  onSelect: (id: string) => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, selectedItem, onSelect, isMenuOpen, onToggleMenu }) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    w-64 bg-purple-900 text-purple-200 p-4 shadow-xl transition-transform duration-300 ease-in-out
                    z-30 sm:relative sm:translate-x-0 sm:w-64 sm:flex-shrink-0`}>
      <div className="flex justify-between items-center mb-6 sm:hidden">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button onClick={onToggleMenu} className="text-purple-200 hover:text-white focus:outline-none text-3xl">
          &times; {/* Close button */}
        </button>
      </div>

      <nav className="mt-4">
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className="mb-2">
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="w-full text-left flex justify-between items-center py-2 px-3 rounded-md
                               bg-purple-800 hover:bg-purple-700 font-semibold text-lg focus:outline-none"
                  >
                    {item.name}
                    <span className="text-xl">
                      {openSections.includes(item.id) ? '▲' : '▼'}
                    </span>
                  </button>
                  {openSections.includes(item.id) && (
                    <ul className="ml-4 mt-2 border-l border-purple-700 pl-3">
                      {item.subItems.map(subItem => (
                        <li key={subItem.id} className="mb-1">
                          <button
                            onClick={() => { onSelect(subItem.id); onToggleMenu(); }} // Close menu on selection
                            className={`w-full text-left py-2 px-3 rounded-md text-base transition-colors duration-200
                                        ${selectedItem === subItem.id ? 'bg-purple-700 text-white font-medium' : 'hover:bg-purple-800'}`}
                          >
                            {subItem.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { onSelect(item.id); onToggleMenu(); }} // Close menu on selection
                  className={`w-full text-left py-2 px-3 rounded-md text-lg font-semibold transition-colors duration-200
                              ${selectedItem === item.id ? 'bg-purple-700 text-white' : 'bg-purple-800 hover:bg-purple-700'}`}
                >
                  {item.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// --- SVG Card Layout Components (no change) ---

interface CardPositionProps {
  x: number;
  y: number;
  label: string;
  rotation?: number; // Optional rotation in degrees
}

const CardPosition: React.FC<CardPositionProps> = ({ x, y, label, rotation = 0 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
    <rect x="-30" y="-45" width="60" height="90" rx="8" ry="8" fill="#5A2D82" stroke="#B088F0" strokeWidth="2" />
    <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">{label}</text>
  </g>
);

const CelticCrossLayout: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    {/* Center Cross */}
    <CardPosition x="180" y="150" label="1" /> {/* Present */}
    <CardPosition x="220" y="150" label="2" rotation={90} /> {/* What crosses you */}
    <CardPosition x="180" y="100" label="3" /> {/* What crowns you */}
    <CardPosition x="180" y="200" label="4" /> {/* What's beneath you */}
    <CardPosition x="130" y="150" label="5" /> {/* Past */}
    <CardPosition x="230" y="150" label="6" /> {/* Future */}

    {/* Staff/Rod */}
    <CardPosition x="320" y="260" label="7" /> {/* You/Yourself */}
    <CardPosition x="320" y="210" label="8" /> {/* External Influence */}
    <CardPosition x="320" y="160" label="9" /> {/* Hopes/Fears */}
    <CardPosition x="320" y="110" label="10" /> {/* Outcome */}
    <CardPosition x="320" y="60" label="11" /> {/* Outcome */}
    <CardPosition x="320" y="10" label="12" /> {/* Outcome */}
  </svg>
);

const ThreeCardLayout: React.FC = () => (
  <svg viewBox="0 0 300 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="70" y="75" label="1" /> {/* Past */}
    <CardPosition x="150" y="75" label="2" /> {/* Present */}
    <CardPosition x="230" y="75" label="3" /> {/* Future */}
  </svg>
);

// Generic Placeholder for other spreads (now using simple text, not images)
const GenericSpreadLayout: React.FC<{ spreadName: string }> = ({ spreadName }) => (
  <div className="w-full h-auto max-h-96 mx-auto mb-8 flex items-center justify-center border border-purple-700 rounded-lg bg-purple-900 shadow-inner p-8 text-purple-400 text-center text-lg">
    <p>Layout graphic for "{spreadName}" coming soon!</p>
  </div>
);

// Explicit type for CelticCrossSelectionItem
interface CelticCrossSelectionItem {
  id: number;
  name: string;
  cardId: string;
  orientation: 'upright' | 'reversed';
}

function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true); // New state for home screen
  const [selectedMenuItem, setSelectedMenuItem] = useState('celticCross'); // Default to Celtic Cross after home screen
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  // State to store selected cards for Celtic Cross spread, with explicit type
  const [celticCrossSelections, setCelticCrossSelections] = useState<CelticCrossSelectionItem[]>(
    celticCrossPositions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
  );
  // State for the card selected in the Card Selection Tool tab
  const [selectedCardForMeaning, setSelectedCardForMeaning] = useState('');
  // State to store the dynamically fetched meaning for Card Meanings
  const [cardMeaningText, setCardMeaningText] = useState('Select a card to see its meaning.');
  // State to track loading status of Card Meanings
  const [isLoadingCardMeaning, setIsLoadingCardMeaning] = useState(false);

  // State to store the generated reading message (summary of cards)
  const [readMessage, setReadMessage] = useState('');
  // State to store the LLM generated interpretation for Spreads
  const [llmInterpretation, setLlmInterpretation] = useState('');
  // State to track loading status of LLM interpretation for Spreads
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);

  // **** IMPORTANT: REPLACE THIS WITH YOUR AWS API GATEWAY INVOKE URL ****
  // Example: 'https://abcdef123.execute-api.us-east-1.amazonaws.com/prod'
  const apiUrl = 'https://cpif4zh0bf.execute-api.eu-north-1.amazonaws.com/prod'; // <<< PASTE YOUR URL HERE

  // Handle card selection for a specific position in Celtic Cross
  const handleCardSelect = useCallback((positionId: number, cardId: string) => {
    setCelticCrossSelections(prevSelections =>
      prevSelections.map(selection =>
        selection.id === positionId ? { ...selection, cardId: cardId } : selection
      )
    );
    setReadMessage(''); // Clear messages on new selection
    setLlmInterpretation('');
  }, []);

  // Handle orientation selection for a specific position in Celtic Cross
  const handleOrientationSelect = useCallback((positionId: number, orientation: 'upright' | 'reversed') => {
    setCelticCrossSelections(prevSelections =>
      prevSelections.map(selection =>
        selection.id === positionId ? { ...selection, orientation: orientation } : selection
      )
    );
    setReadMessage(''); // Clear messages on new orientation
    setLlmInterpretation('');
  }, []);

  // Fetch individual card meaning from LLM for Card Meanings via AWS Lambda proxy
  const fetchCardMeaning = useCallback(async (cardName: string) => {
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

  // Effect to call fetchCardMeaning when selectedCardForMeaning changes and Card Meanings is active
  useEffect(() => {
    if (selectedMenuItem === 'cardMeanings') {
      const card = allTarotCards.find(c => c.id === selectedCardForMeaning);
      fetchCardMeaning(card ? card.name : '');
    }
  }, [selectedCardForMeaning, selectedMenuItem, fetchCardMeaning]);


  // Generate the reading message based on selected cards for Spreads via AWS Lambda proxy
  const generateRead = useCallback(async (spreadType: string, spreadPositions: {id: number; name: string}[], selections: CelticCrossSelectionItem[]) => {
    const selectedCardsDetails = selections
      .filter(selection => selection.cardId)
      .map(selection => {
        const card = allTarotCards.find(c => c.id === selection.cardId);
        const orientationText = selection.orientation === 'upright' ? 'Upright' : 'Reversed';
        return `${selection.name}: ${card?.name} (${orientationText})`;
      });

    if (selectedCardsDetails.length < spreadPositions.length) {
      setReadMessage(`Please select all ${spreadPositions.length} cards for a full reading.`);
      setLlmInterpretation('');
      return;
    }

    setReadMessage(`Your ${spreadType} Reading Summary:\n\n${selectedCardsDetails.join('\n')}`);
    setLlmInterpretation('Generating interpretation...');
    setIsLoadingInterpretation(true);

    // Construct the prompt for the LLM for overall spread interpretation
    const prompt = `Provide a detailed Tarot reading interpretation based on the following ${spreadType} spread. Each line specifies the position, the card drawn, and its orientation (Upright/Reversed). Focus on how these cards interact and what overall message they convey. The positions are:\n${spreadPositions.map(p => p.name).join(', ')}.\n\nHere are the selected cards:\n${selectedCardsDetails.join('\n')}\n\nWhat is the overall interpretation of this spread?`;

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
  const clearCelticCrossSelection = useCallback(() => {
    setCelticCrossSelections(
      celticCrossPositions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
    );
    setReadMessage('');
    setLlmInterpretation('');
  }, []);

  // Handles changing menu items
  const handleMenuItemSelect = useCallback((itemId: string) => {
    setSelectedMenuItem(itemId);
    // Reset states when switching sections if needed
    if (itemId === 'cardMeanings') {
      setSelectedCardForMeaning('');
      setCardMeaningText('Select a card to see its meaning.');
    } else {
      // Reset spread specific states when moving away from a spread
      setReadMessage('');
      setLlmInterpretation('');
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);


  // --- Render Content Based on Selected Menu Item ---
  const renderContent = () => {
    // Helper to find parent category name for display in placeholders
    const currentItemName = menuItems.find(m => m.id === selectedMenuItem)?.name ||
                            menuItems.find(m => m.subItems?.some(s => s.id === selectedMenuItem))?.subItems?.find(s => s.id === selectedMenuItem)?.name ||
                            '';


    switch (selectedMenuItem) {
      case 'celticCross':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
            <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Celtic Cross & Staff Spread</h2>
            <p className="text-md text-purple-300 mb-6 text-center">
              Select a card and its orientation for each of the 12 positions.
            </p>

            <CelticCrossLayout />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {celticCrossSelections.map((position: CelticCrossSelectionItem) => ( // Explicitly typed here
                <div key={position.id} className="bg-purple-900 p-4 rounded-lg shadow-md border border-purple-700">
                  <h3 className="text-lg font-medium text-purple-100 mb-2">{position.name}</h3>
                  {/* Card Selection Dropdown */}
                  <select
                    className="w-full p-2 mb-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={position.cardId || ''} // Ensure value is always a string
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
                onClick={() => generateRead('Celtic Cross', celticCrossPositions, celticCrossSelections)}
                disabled={isLoadingInterpretation} // Disable button while loading
              >
                {isLoadingInterpretation ? 'Generating...' : 'Generate Read'}
              </button>
              <button
                className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                onClick={clearCelticCrossSelection}
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
        );

      case 'cardMeanings':
        return (
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
            <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100">
              <h3 className="text-xl font-semibold mb-3 text-center">Meaning:</h3>
              <p className="text-lg">
                {isLoadingCardMeaning ? 'Generating meaning...' : (
                  <span dangerouslySetInnerHTML={{ __html: cardMeaningText.replace(/\n/g, '<br />') }} />
                )}
              </p>
            </div>
          </div>
        );

      // --- Spread Layouts and Placeholders (using SVGs or text) ---
      case 'threeCard':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
            <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Three Card Spread</h2>
            <p className="text-md text-purple-300 mb-6 text-center">
              Select three cards for a quick reading (e.g., Past, Present, Future).
            </p>
            <ThreeCardLayout />
            <div className="text-center text-lg text-purple-400">
              <p>Card selection and interpretation functionality to be added for this spread.</p>
            </div>
          </div>
        );
      case 'heartAndHead':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
            <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Heart and Head Spread</h2>
            <p className="text-md text-purple-300 mb-6 text-center">
              This spread reveals the spiritual, intellectual, and emotional aspects of your life.
            </p>
            <GenericSpreadLayout spreadName="Heart and Head" />
            <div className="text-center text-lg text-purple-400">
              <p>Card selection and interpretation functionality to be added for this spread.</p>
            </div>
          </div>
        );
      case 'starSpread':
      case 'pastPresentFuture':
      case 'treeOfLife':
      case 'horseshoe':
      case 'yearAhead':
      case 'monthAhead':
      case 'weekAhead':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName} Spread</h2>
            <GenericSpreadLayout spreadName={currentItemName} />
            <p className="text-lg text-purple-300">
              This is a placeholder for the **{currentItemName}** spread.
              <br />
              Functionality to be implemented soon!
            </p>
          </div>
        );

      case 'earth':
      case 'wind':
      case 'fire':
      case 'water':
      case 'soul':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName} Element</h2>
            <p className="text-lg text-purple-300">
              This is a placeholder for information about the **{currentItemName}** element.
              <br />
              Content to be added here.
            </p>
          </div>
        );

      // --- Zodiac Signs Content (no change) ---
      case 'aries':
      case 'taurus':
      case 'gemini':
      case 'cancer':
      case 'leo':
      case 'virgo':
      case 'libra':
      case 'scorpio':
      case 'sagittarius':
      case 'capricorn':
      case 'aquarius':
      case 'pisces':
        const zodiacSign = zodiacSignsData.find(sign => sign.id === selectedMenuItem);
        if (!zodiacSign) {
          return null; // Should not happen if menuItems and zodiacSignsData are in sync
        }
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{zodiacSign.name}</h2>
            <p className="text-6xl mb-4">{zodiacSign.symbol}</p> {/* Display symbol */}
            <p className="text-lg text-purple-300 leading-relaxed">
              {zodiacSign.description}
            </p>
          </div>
        );

      // --- Witches Runes Content ---
      case 'witchesRunes':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
            <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">The 13 Witches Runes</h2>
            <p className="text-md text-purple-300 mb-6 text-center">
              Explore the meanings of the Witches Runes, a modern set of symbols used for divination.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {witchesRunesData.map(rune => (
                <div key={rune.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center">
                  <h3 className="text-xl font-semibold text-purple-100 mb-2">{rune.name}</h3>
                  <p className="text-5xl mb-3">{rune.symbol}</p> {/* Display rune symbol */}
                  <p className="text-md text-purple-300 leading-relaxed">{rune.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // --- Other New Categories Placeholders ---
      case 'elderFuthark':
      case 'youngerFuthark':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName} Runes</h2>
            <p className="text-lg text-purple-300">
              This is a placeholder for information about **{currentItemName}** runes.
              <br />
              Content to be added here.
            </p>
          </div>
        );

      case 'herbMagic':
      case 'incenseOils':
      case 'colourTheory':
      case 'crystals':
      case 'deities':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName}</h2>
            <p className="text-lg text-purple-300">
              This is a placeholder for information about **{currentItemName}**.
              <br />
              Content to be added here.
            </p>
          </div>
        );

      case 'north':
      case 'east':
      case 'south':
      case 'west':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName}</h2>
            <p className="text-lg text-purple-300">
              This is a placeholder for information about the **{currentItemName}** cardinal point.
              <br />
              Content to be added here.
            </p>
          </div>
        );

      default:
        // Default content when selectedMenuItem is not recognized (e.g., initial state)
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">Welcome to Chicksands Tarot</h2>
            <p className="text-lg text-purple-300">
              Select an option from the menu to get started.
            </p>
          </div>
        );
    }
  };


  return (
    <div className="min-h-screen bg-black text-purple-300 font-sans flex flex-col sm:flex-row">
      {/* Home Screen Overlay */}
      {showHomeScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4 z-50">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-center text-white animate-pulse">Chicksands Tarot</h1>
          <div className="bg-purple-900 p-8 rounded-xl shadow-2xl border border-purple-700 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">Embrace the Wisdom of Pagan Divination</h2>
            <p className="text-lg text-purple-300 mb-6 leading-relaxed">
              Welcome to Chicksands Tarot, your digital sanctuary for exploring the ancient art of divination. Rooted in the rich traditions of Paganism, this app offers a unique journey into self-discovery and spiritual insight.
              <br /><br />
              Pagan divination is a practice of seeking knowledge or insight into the future, the unknown, or the hidden through supernatural means. It often involves interpreting signs, symbols, and patterns found in nature, rituals, or tools like tarot cards. It's a way to connect with the subtle energies of the universe, gain clarity on life's challenges, and align with your true path.
              <br /><br />
              Here, you can delve into various tarot spreads, explore the significance of the elements, and understand the influence of the zodiac, all guided by intuitive AI interpretations.
            </p>
            <button
              className="px-10 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-xl"
              onClick={() => setShowHomeScreen(false)}
            >
              Enter the Sanctuary
            </button>
          </div>
        </div>
      )}

      {/* Main App Content (conditionally rendered) */}
      {!showHomeScreen && (
        <>
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="fixed top-4 left-4 z-40 p-3 bg-purple-700 text-white rounded-lg shadow-lg
                       sm:hidden focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            ☰ Menu
          </button>

          {/* Menu Sidebar */}
          <Menu
            menuItems={menuItems}
            selectedItem={selectedMenuItem}
            onSelect={handleMenuItemSelect}
            isMenuOpen={isMenuOpen}
            onToggleMenu={toggleMenu}
          />

          {/* Main Content Area */}
          <div className={`flex-1 p-4 sm:p-8 flex flex-col items-center transition-all duration-300 ease-in-out
                          ${isMenuOpen ? 'sm:ml-64' : 'sm:ml-0'} `}> {/* Adjust margin for desktop menu */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white">Chicksands Tarot</h1>

            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
