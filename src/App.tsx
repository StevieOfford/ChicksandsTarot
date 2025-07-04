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
  { id: 'temperance', 'name': 'Temperance' },
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

// Positions for Three Card Spread
const threeCardPositions = [
  { id: 1, name: '1. Past' },
  { id: 2, name: '2. Present' },
  { id: 3, name: '3. Future' },
];

// Positions for Heart and Head Spread
const heartAndHeadPositions = [
  { id: 1, name: '1. Your Spiritual Self' },
  { id: 2, name: '2. What You Think' },
  { id: 3, name: '3. What You Feel' },
  { id: 4, name: '4. The Heart of the Matter' },
];

// Positions for Past, Present & Future Spread (same as Three Card, but distinct name)
const pastPresentFuturePositions = [
  { id: 1, name: '1. Past' },
  { id: 2, name: '2. Present' },
  { id: 3, name: '3. Future' },
];

// Positions for Tree of Life Spread (simplified for now)
const treeOfLifePositions = [
  { id: 1, name: '1. Kether (Crown)' },
  { id: 2, name: '2. Chokmah (Wisdom)' },
  { id: 3, name: '3. Binah (Understanding)' },
  { id: 4, name: '4. Chesed (Mercy)' },
  { id: 5, name: '5. Geburah (Strength)' },
  { id: 6, name: '6. Tiphareth (Beauty)' },
  { id: 7, name: '7. Netzach (Victory)' },
  { id: 8, name: '8. Hod (Glory)' },
  { id: 9, name: '9. Yesod (Foundation)' },
  { id: 10, name: '10. Malkuth (Kingdom)' },
];

// Positions for Horseshoe Spread (simplified for now)
const horseshoePositions = [
  { id: 1, name: '1. Past Influences' },
  { id: 2, name: '2. Present Situation' },
  { id: 3, name: '3. Hidden Influences' },
  { id: 4, name: '4. Obstacles' },
  { id: 5, name: '5. Your Path' },
  { id: 6, name: '6. External Influences' },
  { id: 7, name: '7. Outcome' },
];

// Positions for Year Ahead Spread (simplified for now)
const yearAheadPositions = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, name: `${i + 1}. Month ${i + 1}`
}));

// Positions for Month Ahead Spread (simplified for now)
const monthAheadPositions = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1, name: `${i + 1}. Week ${i + 1}`
}));

// Positions for Week Ahead Spread (simplified for now)
const weekAheadPositions = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1, name: `${i + 1}. Day ${i + 1}`
}));

// Positions for Star Spread (simplified for now)
const starSpreadPositions = [
  { id: 1, name: '1. You' },
  { id: 2, name: '2. Your Hopes' },
  { id: 3, name: '3. Your Fears' },
  { id: 4, name: '4. Your Strengths' },
  { id: 5, name: '5. Your Weaknesses' },
  { id: 6, name: '6. The Path Forward' },
];

// NEW: Positions for Deck Interview Spread (6 cards)
const deckInterviewPositions = [
  { id: 1, name: '1. What is your most important characteristic?' },
  { id: 2, name: '2. What are your strengths as a deck?' },
  { id: 3, name: '3. What are your weaknesses as a deck?' },
  { id: 4, name: '4. What can you teach me?' },
  { id: 5, name: '5. How can I best learn from you?' },
  { id: 6, name: '6. What is our potential together?' },
];

// NEW: Positions for Deck Bonding Spread (4 cards)
const deckBondingPositions = [
  { id: 1, name: '1. What energy do I bring to this deck?' },
  { id: 2, name: '2. What energy does this deck bring to me?' },
  { id: 3, name: '3. How can we communicate more clearly?' },
  { id: 4, name: '4. How can we grow together?' },
];


// --- Menu Structure Data ---
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
      // NEW: Your Deck Sub-category
      {
        id: 'yourDeck',
        name: 'Your Deck',
        subItems: [
          { id: 'deckInterview', name: 'Deck Interview' },
          { id: 'deckBonding', name: 'Deck Bonding' },
        ],
      },
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

// --- Zodiac Signs Data (FIXED: Removed extraneous '错了。') ---
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

// NEW: Elder Futhark Runes Data (24 runes)
const elderFutharkRunesData = [
  { id: 'fehu', name: 'Fehu', symbol: 'ᚠ', description: 'Cattle, wealth, abundance, financial strength, new beginnings.' },
  { id: 'uruz', name: 'Uruz', symbol: 'ᚢ', description: 'Wild ox, strength, untamed potential, raw power, good health.' },
  { id: 'thurisaz', name: 'Thurisaz', symbol: 'ᚦ', description: 'Thorn, giant, protection, destructive force, conflict, challenge.' },
  { id: 'ansuz', name: 'Ansuz', symbol: 'ᚨ', description: 'God, Odin, communication, inspiration, divine insight, wisdom.' },
  { id: 'raidho', name: 'Raidho', symbol: 'ᚱ', description: 'Journey, ride, travel, movement, progress, rhythm.' },
  { id: 'kenaz', name: 'Kenaz', symbol: 'ᚲ', description: 'Torch, vision, knowledge, creativity, enlightenment, warmth.' },
  { id: 'gebo', name: 'Gebo', symbol: 'ᚷ', description: 'Gift, partnership, generosity, balance, exchange, union.' },
  { id: 'wunjo', name: 'Wunjo', symbol: 'ᚹ', description: 'Joy, comfort, pleasure, harmony, fellowship, success.' },
  { id: 'hagalaz', name: 'Hagalaz', symbol: 'ᚺ', description: 'Hail, disruption, crisis, destructive natural forces, uncontrolled change.' },
  { id: 'naudiz', name: 'Naudiz', symbol: 'ᚾ', description: 'Need, necessity, constraint, distress, patience, endurance.' },
  { id: 'isa', name: 'Isa', symbol: 'ᛁ', description: 'Ice, stagnation, standstill, challenge, introspection, clarity.' },
  { id: 'jera', name: 'Jera', symbol: 'ᛃ', description: 'Year, harvest, cycles, reward, peace, good results.' },
  { id: 'eihwaz', name: 'Eihwaz', symbol: 'ᛇ', description: 'Yew tree, strength, reliability, endurance, transformation, death and rebirth.' },
  { id: 'perthro', name: 'Perthro', symbol: 'ᛈ', description: 'Lot cup, mystery, fate, hidden knowledge, chance, secrets.' },
  { id: 'algiz', name: 'Algiz', symbol: 'z', description: 'Elk, protection, defense, guardian, spiritual connection, divine blessing.' },
  { id: 'sowilo', name: 'Sowilo', symbol: 'ᛊ', description: 'Sun, success, honor, wholeness, life force, victory.' },
  { id: 'tiwaz', name: 'Tiwaz', symbol: 'ᛏ', description: 'Tyr, justice, sacrifice, victory, leadership, courage.' },
  { id: 'berkano', name: 'Berkano', symbol: 'ᛒ', description: 'Birch goddess, growth, new beginnings, fertility, regeneration.' },
  { id: 'ehwaz', name: 'Ehwaz', symbol: 'ᛖ', description: 'Horse, movement, progress, partnership, trust, loyalty.' },
  { id: 'mannaz', name: 'Mannaz', symbol: 'ᛗ', description: 'Man, humanity, self, community, social order, intelligence.' },
  { id: 'laguz', name: 'Laguz', symbol: 'ᛚ', description: 'Water, flow, intuition, emotions, dreams, subconscious.' },
  { id: 'ingwaz', name: 'Ingwaz', symbol: 'ᛝ', description: 'Ing, fertility, new ideas, completion, security, inner growth.' },
  { id: 'dagaz', name: 'Dagaz', symbol: 'ᛞ', description: 'Day, breakthrough, awakening, hope, transformation, new cycle.' },
  { id: 'othala', name: 'Othala', symbol: 'ᛟ', description: 'Inheritance, homeland, property, ancestry, spiritual heritage, tradition.' },
];

// NEW: Younger Futhark Runes Data (16 runes)
const youngerFutharkRunesData = [
  { id: 'fe', name: 'Fé', symbol: 'ᚠ', description: 'Wealth, cattle, prosperity, material possessions.' },
  { id: 'ur', name: 'Úr', symbol: 'ᚢ', description: 'Iron, dross, rain, primeval mist, strength, origin.' },
  { id: 'thurs', name: 'Þurs', symbol: 'ᚦ', description: 'Giant, thorn, danger, defense, conflict, power.' },
  { id: 'ass', name: 'Ass', symbol: 'ᚬ', description: 'God, mouth, communication, wisdom, inspiration, divine breath.' },
  { id: 'reidh', name: 'Reið', symbol: 'ᚱ', description: 'Journey, ride, travel, progress, counsel, order.' },
  { id: 'kaun', name: 'Kaun', symbol: 'ᚴ', description: 'Ulcer, torch, disease, death, but also knowledge, light.' },
  { id: 'hagall', name: 'Hagall', symbol: 'ᚼ', description: 'Hail, destructive forces, crisis, uncontrolled events, transformation.' },
  { id: 'naudh', name: 'Nauð', symbol: 'ᚾ', description: 'Need, distress, constraint, necessity, endurance, patience.' },
  { id: 'is', name: 'Ís', symbol: 'ᛁ', description: 'Ice, stagnation, standstill, challenge, introspection, self-preservation.' },
  { id: 'ar', name: 'Ár', symbol: 'ᛅ', description: 'Year, harvest, good season, peace, abundance, good results.' },
  { id: 'sol', name: 'Sól', symbol: 'ᛋ', description: 'Sun, victory, success, honor, life force, enlightenment.' },
  { id: 'tyr', name: 'Týr', symbol: 'ᛏ', description: 'Tyr, justice, sacrifice, victory, leadership, courage.' },
  { id: 'bjarkan', name: 'Bjarkan', symbol: 'ᛒ', description: 'Birch, growth, new beginnings, fertility, family, regeneration.' },
  { id: 'madhr', name: 'Maðr', symbol: 'ᛘ', description: 'Man, humanity, self, community, social order, intelligence.' },
  { id: 'logr', name: 'Logr', symbol: 'ᛚ', description: 'Water, lake, flow, intuition, emotions, dreams, subconscious.' },
  { id: 'yr', name: 'Ýr', symbol: 'ᛦ', description: 'Yew, bow, death, transformation, reliability, defense.' },
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
                          {subItem.subItems ? ( // Check for sub-sub-items
                            <div>
                              <button
                                onClick={() => toggleSection(subItem.id)}
                                className="w-full text-left flex justify-between items-center py-2 px-3 rounded-md
                                           bg-purple-800 hover:bg-purple-700 font-semibold text-base focus:outline-none"
                              >
                                {subItem.name}
                                <span className="text-xl">
                                  {openSections.includes(subItem.id) ? '▲' : '▼'}
                                </span>
                              </button>
                              {openSections.includes(subItem.id) && (
                                <ul className="ml-4 mt-2 border-l border-purple-700 pl-3">
                                  {subItem.subItems.map(subSubItem => (
                                    <li key={subSubItem.id} className="mb-1">
                                      <button
                                        onClick={() => { onSelect(subSubItem.id); onToggleMenu(); }}
                                        className={`w-full text-left py-2 px-3 rounded-md text-sm transition-colors duration-200
                                                    ${selectedItem === subSubItem.id ? 'bg-purple-700 text-white font-medium' : 'hover:bg-purple-800'}`}
                                      >
                                        {subSubItem.name}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => { onSelect(subItem.id); onToggleMenu(); }}
                              className={`w-full text-left py-2 px-3 rounded-md text-base transition-colors duration-200
                                          ${selectedItem === subItem.id ? 'bg-purple-700 text-white font-medium' : 'hover:bg-purple-800'}`}
                            >
                              {subItem.name}
                            </button>
                          )}
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

// --- SVG Card Layout Components ---

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
  // Increased viewBox width from 400 to 450, adjusted x for staff cards
  <svg viewBox="0 0 450 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    {/* Center Cross */}
    <CardPosition x="180" y="150" label="1" /> {/* Present */}
    <CardPosition x="220" y="150" label="2" rotation={90} /> {/* What crosses you */}
    <CardPosition x="180" y="100" label="3" /> {/* What crowns you */}
    <CardPosition x="180" y="200" label="4" /> {/* What's beneath you */}
    <CardPosition x="130" y="150" label="5" /> {/* Past */}
    <CardPosition x="230" y="150" label="6" /> {/* Future */}

    {/* Staff/Rod - Adjusted x coordinates for more right padding */}
    <CardPosition x="370" y="260" label="7" /> {/* You/Yourself */}
    <CardPosition x="370" y="210" label="8" /> {/* External Influence */}
    <CardPosition x="370" y="160" label="9" /> {/* Hopes/Fears */}
    <CardPosition x="370" y="110" label="10" /> {/* Outcome */}
    <CardPosition x="370" y="60" label="11" /> {/* Outcome */}
    <CardPosition x="370" y="10" label="12" /> {/* Outcome */}
  </svg>
);

const ThreeCardLayout: React.FC = () => (
  <svg viewBox="0 0 300 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="70" y="75" label="1" /> {/* Past */}
    <CardPosition x="150" y="75" label="2" /> {/* Present */}
    <CardPosition x="230" y="75" label="3" /> {/* Future */}
  </svg>
);

// NEW: Star Spread Layout (6 cards)
const StarSpreadLayout: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    {/* Center */}
    <CardPosition x="200" y="150" label="1" />
    {/* Points of the star */}
    <CardPosition x="200" y="50" label="2" /> {/* Top */}
    <CardPosition x="300" y="100" label="3" rotation={30} /> {/* Top Right */}
    <CardPosition x="300" y="200" label="4" rotation={-30} /> {/* Bottom Right */}
    <CardPosition x="200" y="250" label="5" /> {/* Bottom */}
    <CardPosition x="100" y="200" label="6" rotation={30} /> {/* Bottom Left */}
    {/* Optional: if 7th card is needed, could be at 100,100 rotation -30 */}
  </svg>
);

// NEW: Heart and Head Spread Layout (4 cards)
const HeartAndHeadLayout: React.FC = () => (
  <svg viewBox="0 0 300 250" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="150" y="50" label="1" /> {/* Your Spiritual Self */}
    <CardPosition x="220" y="125" label="2" /> {/* What You Think */}
    <CardPosition x="80" y="125" label="3" /> {/* What You Feel */}
    <CardPosition x="150" y="200" label="4" /> {/* The Heart of the Matter */}
  </svg>
);

// NEW: Past Present & Future Spread Layout (3 cards - distinct from ThreeCardLayout)
const PastPresentFutureLayout: React.FC = () => (
  <svg viewBox="0 0 350 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="70" y="75" label="1" /> {/* Past */}
    <CardPosition x="175" y="75" label="2" /> {/* Present */}
    <CardPosition x="280" y="75" label="3" /> {/* Future */}
  </svg>
);

// NEW: Tree of Life Spread Layout (10 cards - simplified)
const TreeOfLifeLayout: React.FC = () => (
  // Increased viewBox height from 450 to 550, adjusted y coordinates for lower cards
  <svg viewBox="0 0 300 550" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    {/* Kether */}
    <CardPosition x="150" y="30" label="1" />
    {/* Chokmah & Binah */}
    <CardPosition x="80" y="120" label="2" />
    <CardPosition x="220" y="120" label="3" />
    {/* Chesed & Geburah */}
    <CardPosition x="80" y="210" label="4" />
    <CardPosition x="220" y="210" label="5" />
    {/* Tiphareth */}
    <CardPosition x="150" y="300" label="6" />
    {/* Netzach & Hod */}
    <CardPosition x="80" y="390" label="7" />
    <CardPosition x="220" y="390" label="8" />
    {/* Yesod & Malkuth - Adjusted Y coordinates */}
    <CardPosition x="150" y="450" label="9" />
    <CardPosition x="150" y="510" label="10" />
  </svg>
);

// NEW: Horseshoe Spread Layout (7 cards)
const HorseshoeLayout: React.FC = () => (
  <svg viewBox="0 0 400 250" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="50" y="125" label="1" rotation={-15} />
    <CardPosition x="100" y="70" label="2" rotation={-5} />
    <CardPosition x="175" y="50" label="3" />
    <CardPosition x="250" y="70" label="4" rotation={5} />
    <CardPosition x="300" y="125" label="5" rotation={15} />
    <CardPosition x="350" y="170" label="6" rotation={25} />
    <CardPosition x="200" y="200" label="7" /> {/* Center bottom */}
  </svg>
);

// NEW: Year Ahead Spread Layout (12 cards - circular)
const YearAheadLayout: React.FC = () => {
  const center = { x: 200, y: 200 };
  const radius = 120;
  const positions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * (360 / 12) - 90) * (Math.PI / 180); // -90 to start at 12 o'clock
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    return { x, y, label: `${i + 1}` };
  });

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
      {positions.map((pos, index) => (
        <CardPosition key={index} x={pos.x} y={pos.y} label={pos.label} />
      ))}
    </svg>
  );
};

// NEW: Month Ahead Spread Layout (4 cards - linear)
const MonthAheadLayout: React.FC = () => (
  <svg viewBox="0 0 400 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="50" y="75" label="1" />
    <CardPosition x="150" y="75" label="2" />
    <CardPosition x="250" y="75" label="3" />
    <CardPosition x="350" y="75" label="4" />
  </svg>
);

// NEW: Week Ahead Spread Layout (7 cards - linear)
const WeekAheadLayout: React.FC = () => (
  <svg viewBox="0 0 450 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="40" y="75" label="1" />
    <CardPosition x="100" y="75" label="2" />
    <CardPosition x="160" y="75" label="3" />
    <CardPosition x="220" y="75" label="4" />
    <CardPosition x="280" y="75" label="5" />
    <CardPosition x="340" y="75" label="6" />
    <CardPosition x="400" y="75" label="7" />
  </svg>
);

// NEW: Deck Interview Layout (6 cards)
const DeckInterviewLayout: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="100" y="75" label="1" />
    <CardPosition x="200" y="75" label="2" />
    <CardPosition x="300" y="75" label="3" />
    <CardPosition x="100" y="225" label="4" />
    <CardPosition x="200" y="225" label="5" />
    <CardPosition x="300" y="225" label="6" />
  </svg>
);

// NEW: Deck Bonding Layout (4 cards)
const DeckBondingLayout: React.FC = () => (
  <svg viewBox="0 0 350 250" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner">
    <CardPosition x="175" y="50" label="1" /> {/* Top */}
    <CardPosition x="175" y="200" label="2" /> {/* Bottom */}
    <CardPosition x="75" y="125" label="3" /> {/* Left */}
    <CardPosition x="275" y="125" label="4" /> {/* Right */}
  </svg>
);


// --- New: Spread Definition Interfaces ---
interface SpreadPosition {
  id: number;
  name: string;
}

interface SpreadSelectionItem {
  id: number;
  name: string; // Position name
  cardId: string; // Selected card ID
  orientation: 'upright' | 'reversed';
}

interface SpreadDefinition {
  name: string;
  positions: SpreadPosition[];
  layoutComponent: React.FC; // Now always a specific React.FC, no longer generic
  description: string;
}

// --- New: Central Spread Definitions Object ---
const spreadDefinitions: { [key: string]: SpreadDefinition } = {
  celticCross: {
    name: 'Celtic Cross & Staff Spread',
    positions: celticCrossPositions,
    layoutComponent: CelticCrossLayout,
    description: 'Select a card and its orientation for each of the 12 positions.',
  },
  threeCard: {
    name: 'Three Card Spread',
    positions: threeCardPositions,
    layoutComponent: ThreeCardLayout,
    description: 'Select three cards for a quick reading (e.g., Past, Present, Future).',
  },
  starSpread: {
    name: 'Star Spread',
    positions: starSpreadPositions,
    layoutComponent: StarSpreadLayout,
    description: 'A spread to gain insight into your hopes, fears, strengths, and weaknesses.',
  },
  heartAndHead: {
    name: 'Heart and Head Spread',
    positions: heartAndHeadPositions,
    layoutComponent: HeartAndHeadLayout,
    description: 'This spread reveals the spiritual, intellectual, and emotional aspects of your life.',
  },
  pastPresentFuture: {
    name: 'Past Present & Future Spread',
    positions: pastPresentFuturePositions,
    layoutComponent: PastPresentFutureLayout,
    description: 'A classic spread for understanding your journey from past to future.',
  },
  treeOfLife: {
    name: 'Tree of Life Spread',
    positions: treeOfLifePositions,
    layoutComponent: TreeOfLifeLayout,
    description: 'Explore the different aspects of your life through the Tree of Life Qabalistic system.',
  },
  horseshoe: {
    name: 'Horseshoe Spread',
    positions: horseshoePositions,
    layoutComponent: HorseshoeLayout,
    description: 'A comprehensive spread for examining influences, obstacles, and potential outcomes.',
  },
  yearAhead: {
    name: 'Year Ahead Spread',
    positions: yearAheadPositions,
    layoutComponent: YearAheadLayout,
    description: 'Gain insight into the themes and energies of each month in the coming year.',
  },
  monthAhead: {
    name: 'Month Ahead Spread',
    positions: monthAheadPositions,
    layoutComponent: MonthAheadLayout,
    description: 'A weekly breakdown of energies and insights for the upcoming month.',
  },
  weekAhead: {
    name: 'Week Ahead Spread',
    positions: weekAheadPositions,
    layoutComponent: WeekAheadLayout,
    description: 'A daily guide to the energies and events of the upcoming week.',
  },
  // NEW: Deck Interview Spread Definition
  deckInterview: {
    name: 'Deck Interview Spread',
    positions: deckInterviewPositions,
    layoutComponent: DeckInterviewLayout,
    description: 'A spread to help you get to know a new or existing tarot deck.',
  },
  // NEW: Deck Bonding Spread Definition
  deckBonding: {
    name: 'Deck Bonding Spread',
    positions: deckBondingPositions,
    layoutComponent: DeckBondingLayout,
    description: 'A spread to deepen your connection and bond with your tarot deck.',
  },
  // 'cardMeanings' is handled separately, not a spread
};


function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('celticCross'); // Default to Celtic Cross
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- New State for Dynamic Spreads ---
  const [currentSpreadType, setCurrentSpreadType] = useState<string>('celticCross');
  const [currentSpreadPositions, setCurrentSpreadPositions] = useState<SpreadPosition[]>(celticCrossPositions);
  const [currentSpreadSelections, setCurrentSpreadSelections] = useState<SpreadSelectionItem[]>(
    celticCrossPositions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
  );
  // --- End New State ---

  const [selectedCardForMeaning, setSelectedCardForMeaning] = useState('');
  const [cardMeaningText, setCardMeaningText] = useState('Select a card to see its meaning.');
  const [isLoadingCardMeaning, setIsLoadingCardMeaning] = useState(false);

  const [readMessage, setReadMessage] = useState('');
  const [llmInterpretation, setLlmInterpretation] = useState('');
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);

  const apiUrl = 'https://cpif4zh0bf.execute-api.eu-north-1.amazonaws.com/prod';

  // --- Refactored handleCardSelect to be generic ---
  const handleCardSelect = useCallback((positionId: number, cardId: string) => {
    setCurrentSpreadSelections(prevSelections =>
      prevSelections.map(selection =>
        selection.id === positionId ? { ...selection, cardId: cardId } : selection
      )
    );
    setReadMessage('');
    setLlmInterpretation('');
  }, []);

  // --- Refactored handleOrientationSelect to be generic ---
  const handleOrientationSelect = useCallback((positionId: number, orientation: 'upright' | 'reversed') => {
    setCurrentSpreadSelections(prevSelections =>
      prevSelections.map(selection =>
        selection.id === positionId ? { ...selection, orientation: orientation } : selection
      )
    );
    setReadMessage('');
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
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const result = await response.json();
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
  }, [apiUrl]);

  // Effect to call fetchCardMeaning when selectedCardForMeaning changes and Card Meanings is active
  useEffect(() => {
    if (selectedMenuItem === 'cardMeanings') {
      const card = allTarotCards.find(c => c.id === selectedCardForMeaning);
      fetchCardMeaning(card ? card.name : '');
    }
  }, [selectedCardForMeaning, selectedMenuItem, fetchCardMeaning]);


  // --- Refactored generateRead to be generic ---
  const generateRead = useCallback(async () => {
    const spreadDef = spreadDefinitions[currentSpreadType];
    if (!spreadDef) return; // Should not happen

    const selectedCardsDetails = currentSpreadSelections
      .filter(selection => selection.cardId)
      .map(selection => {
        const card = allTarotCards.find(c => c.id === selection.cardId);
        const orientationText = selection.orientation === 'upright' ? 'Upright' : 'Reversed';
        return `${selection.name}: ${card?.name} (${orientationText})`;
      });

    if (selectedCardsDetails.length < spreadDef.positions.length) {
      setReadMessage(`Please select all ${spreadDef.positions.length} cards for a full reading.`);
      setLlmInterpretation('');
      return;
    }

    setReadMessage(`Your ${spreadDef.name} Reading Summary:\n\n${selectedCardsDetails.join('\n')}`);
    setLlmInterpretation('Generating interpretation...');
    setIsLoadingInterpretation(true);

    const prompt = `Provide a detailed Tarot reading interpretation based on the following ${spreadDef.name} spread. Each line specifies the position, the card drawn, and its orientation (Upright/Reversed). Focus on how these cards interact and what overall message they convey. The positions are:\n${spreadDef.positions.map(p => p.name).join(', ')}.\n\nHere are the selected cards:\n${selectedCardsDetails.join('\n')}\n\nWhat is the overall interpretation of this spread?`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const result = await response.json();
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
  }, [currentSpreadType, currentSpreadSelections, apiUrl]);

  // --- Refactored clearSelection to be generic ---
  const clearCurrentSpreadSelection = useCallback(() => {
    const spreadDef = spreadDefinitions[currentSpreadType];
    if (spreadDef) {
      setCurrentSpreadSelections(
        spreadDef.positions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
      );
    }
    setReadMessage('');
    setLlmInterpretation('');
  }, [currentSpreadType]);


  // --- Updated handleMenuItemSelect to manage dynamic spread state ---
  useEffect(() => {
    // This useEffect ensures that when selectedMenuItem changes,
    // the current spread states are correctly initialized.
    // It also acts as the primary trigger for spread changes.
    if (spreadDefinitions[selectedMenuItem]) {
      const initialSpreadDef = spreadDefinitions[selectedMenuItem];
      setCurrentSpreadType(selectedMenuItem);
      setCurrentSpreadPositions(initialSpreadDef.positions);
      setCurrentSpreadSelections(
        initialSpreadDef.positions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
      );
      setReadMessage(''); // Clear messages on new spread selection
      setLlmInterpretation('');
    } else if (selectedMenuItem === 'cardMeanings') {
      setSelectedCardForMeaning('');
      setCardMeaningText('Select a card to see its meaning.');
      setCurrentSpreadType(''); // Clear current spread type
      setCurrentSpreadPositions([]);
      setCurrentSpreadSelections([]);
    } else {
      // For other non-spread categories, clear spread-related states
      setCurrentSpreadType('');
      setCurrentSpreadPositions([]);
      setCurrentSpreadSelections([]);
      setReadMessage('');
      setLlmInterpretation('');
    }
  }, [selectedMenuItem]); // Dependency on selectedMenuItem

  const handleMenuItemSelect = useCallback((itemId: string) => {
    setSelectedMenuItem(itemId);
    // The useEffect above will handle state updates based on selectedMenuItem
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);


  // --- Refactored Render Content Based on Selected Menu Item ---
  const renderContent = () => {
    const currentItemName = menuItems.find(m => m.id === selectedMenuItem)?.name ||
                            menuItems.find(m => m.subItems?.some(s => s.id === selectedMenuItem))?.subItems?.find(s => s.id === selectedMenuItem)?.name ||
                            menuItems.find(m => m.subItems?.some(s => s.subItems?.some(ss => ss.id === selectedMenuItem)))?.subItems?.find(s => s.subItems?.some(ss => ss.id === selectedMenuItem))?.subItems?.find(ss => ss.id === selectedMenuItem)?.name ||
                            ''; // Added logic to find name for sub-sub-items


    // Render Spread UI if currentSpreadType is set
    if (currentSpreadType && spreadDefinitions[currentSpreadType]) {
      const spreadDef = spreadDefinitions[currentSpreadType];
      const LayoutComponent = spreadDef.layoutComponent;

      return (
        <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
          <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">{spreadDef.name}</h2>
          <p className="text-md text-purple-300 mb-6 text-center">
            {spreadDef.description}
          </p>

          {/* Render the specific layout component for the spread */}
          {LayoutComponent && (
            <LayoutComponent />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {currentSpreadSelections.map((position: SpreadSelectionItem) => (
              <div key={position.id} className="bg-purple-900 p-4 rounded-lg shadow-md border border-purple-700">
                <h3 className="text-lg font-medium text-purple-100 mb-2">{position.name}</h3>
                {/* Card Selection Dropdown */}
                <select
                  className="w-full p-2 mb-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={position.cardId as any}
                  onChange={(e) => handleCardSelect(position.id, e.target.value)}
                >
                  <option value="">Select Card</option>
                  {allTarotCards.map(card => (
                    <option
                      key={card.id}
                      value={card.id}
                      // Disable already selected cards in other positions
                      disabled={currentSpreadSelections.some(sel => sel.cardId === card.id && sel.id !== position.id)}
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
              disabled={isLoadingInterpretation}
            >
              {isLoadingInterpretation ? 'Generating...' : 'Generate Read'}
            </button>
            <button
              className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={clearCurrentSpreadSelection}
              disabled={isLoadingInterpretation}
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
    }

    // Handle 'cardMeanings' separately as it's not a spread
    if (selectedMenuItem === 'cardMeanings') {
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
              disabled={isLoadingCardMeaning}
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
    }

    // Handle other non-spread categories (Elements, Zodiac, Runes, etc.)
    switch (selectedMenuItem) {
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
          return null;
        }
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">{zodiacSign.name}</h2>
            <p className="text-6xl mb-4">{zodiacSign.symbol}</p>
            <p className="text-lg text-purple-300 leading-relaxed">
              {zodiacSign.description}
            </p>
          </div>
        );

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
                  <p className="text-5xl mb-3">{rune.symbol}</p>
                  <p className="text-md text-purple-300 leading-relaxed">{rune.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // NEW: Elder Futhark Runes Display
      case 'elderFuthark':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
            <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Elder Futhark Runes</h2>
            <p className="text-md text-purple-300 mb-6 text-center">
              Explore the meanings of the 24 runes of the Elder Futhark, the oldest form of the runic alphabet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {elderFutharkRunesData.map(rune => (
                <div key={rune.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center">
                  <h3 className="text-xl font-semibold text-purple-100 mb-2">{rune.name}</h3>
                  <p className="text-5xl mb-3 font-['Segoe UI Historic']">{rune.symbol}</p>
                  <p className="text-md text-purple-300 leading-relaxed">{rune.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // NEW: Younger Futhark Runes Display
      case 'youngerFuthark':
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
            <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Younger Futhark Runes</h2>
            <p className="text-md text-purple-300 mb-6 text-center">
              Explore the meanings of the 16 runes of the Younger Futhark, a later and more simplified runic alphabet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {youngerFutharkRunesData.map(rune => (
                <div key={rune.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center">
                  <h3 className="text-xl font-semibold text-purple-100 mb-2">{rune.name}</h3>
                  <p className="text-5xl mb-3 font-['Segoe UI Historic']">{rune.symbol}</p>
                  <p className="text-md text-purple-300 leading-relaxed">{rune.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'earth':
      case 'wind':
      case 'fire':
      case 'water':
      case 'soul':
      case 'herbMagic':
      case 'incenseOils':
      case 'colourTheory':
      case 'crystals':
      case 'deities':
      case 'north':
      case 'east':
      case 'south':
      case 'west':
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

      default:
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
          {/* Main content box: now with max-height and overflow-y-auto */}
          <div className="bg-purple-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-700 max-w-2xl text-center
                          max-h-[70vh] overflow-y-auto flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">Embrace the Wisdom of Pagan Divination</h2>
            <p className="text-lg text-purple-300 mb-6 leading-relaxed">
              Welcome to Chicksands Tarot, your digital sanctuary for exploring the ancient art of divination. Rooted in the rich traditions of Paganism, this app offers a unique journey into self-discovery and spiritual insight.
              <br /><br />
              Pagan divination is a practice of seeking knowledge or insight into the future, the unknown, or the hidden through supernatural means. It often involves interpreting signs, symbols, and patterns found in nature, rituals, or tools like tarot cards. It's a way to connect with the subtle energies of the universe, gain clarity on life's challenges, and align with your true path.
              <br /><br />
              Here, you can delve into various tarot spreads, explore the significance of the elements, and understand the influence of the zodiac, all guided by intuitive AI interpretations.
            </p>
          </div>
          {/* Button is now outside the scrollable content box, but still within the main flex container */}
          <button
            className="mt-6 px-10 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-xl"
            onClick={() => setShowHomeScreen(false)}
          >
            Enter the Sanctuary
          </button>
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

          {/* Main Content Area */}
          <div className={`flex-1 p-4 sm:p-8 flex flex-col items-center transition-all duration-300 ease-in-out
                          ${isMenuOpen ? 'sm:ml-64' : 'sm:ml-0'} pt-20 sm:pt-8`}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white">Chicksands Tarot</h1>

            {/* Menu Sidebar - Still rendered here, fixed positioning handles its visual placement */}
            <Menu
              menuItems={menuItems}
              selectedItem={selectedMenuItem}
              onSelect={handleMenuItemSelect}
              isMenuOpen={isMenuOpen}
              onToggleMenu={toggleMenu}
            />

            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
