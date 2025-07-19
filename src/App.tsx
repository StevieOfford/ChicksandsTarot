// @ts-ignore
import React, { useState, useEffect, useCallback, useRef } from 'react';
import JournalingTool from './components/JournalingTool'; // NEW: Import JournalingTool

// --- Data Definitions (kept in App.tsx for now to simplify file management, but ideally in separate data files) ---

// Tarot card data
const allTarotCards = [
  { id: 'fool', name: 'The Fool' }, { id: 'magician', name: 'The Magician' }, { id: 'high-priestess', name: 'The High Priestess' },
  { id: 'empress', name: 'The Empress' }, { id: 'emperor', name: 'The Emperor' }, { id: 'hierophant', name: 'The Hierophant' },
  { id: 'lovers', name: 'The Lovers' }, { id: 'chariot', name: 'The Chariot' }, { id: 'strength', name: 'Strength' },
  { id: 'hermit', name: 'The Hermit' }, { id: 'wheel-of-fortune', name: 'Wheel of Fortune' }, { id: 'justice', name: 'Justice' },
  { id: 'hanged-man', name: 'The Hanged Man' }, { id: 'death', name: 'The Death' }, { id: 'temperance', 'name': 'Temperance' },
  { id: 'devil', name: 'The Devil' }, { id: 'tower', name: 'The Tower' }, { id: 'star', name: 'The Star' },
  { id: 'moon', name: 'The Moon' }, { id: 'sun', name: 'The Sun' }, { id: 'judgement', name: 'Judgement' },
  { id: 'world', name: 'The World' },
  ...Array.from({ length: 14 }, (_, i) => ({ id: `wands-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Wands` })),
  ...Array.from({ length: 14 }, (_, i) => ({ id: `cups-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Cups` })),
  ...Array.from({ length: 14 }, (_, i) => ({ id: `swords-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Swords` })),
  ...Array.from({ length: 14 }, (_, i) => ({ id: `pentacles-${i + 1}`, name: `${i === 0 ? 'Ace' : (i === 9 ? 'Ten' : (i === 10 ? 'Page' : (i === 11 ? 'Knight' : (i === 12 ? 'Queen' : (i === 13 ? 'King' : i + 1)))))} of Pentacles` })),
];

// Spread Positions
const celticCrossPositions = [{ id: 1, name: '1. Past' }, { id: 2, name: '2. Present' }, { id: 3, name: '3. What got you here' }, { id: 4, 'name': '4. Obstacle' }, { id: 5, name: '5. What\'s next' }, { id: 6, name: '6. Future' }, { id: 7, name: '7. You/Yourself' }, { id: 8, name: '8. External Influence' }, { id: 9, name: '9. What you need to know' }, { id: 10, name: '10. Outcome 1' }, { id: 11, name: '11. Outcome 2' }, { id: 12, name: '12. Outcome 3' }];
const threeCardPositions = [{ id: 1, name: '1. Past' }, { id: 2, name: '2. Present' }, { id: 3, name: '3. Future' }];
const heartAndHeadPositions = [{ id: 1, name: '1. Your Spiritual Self' }, { id: 2, name: '2. What You Think' }, { id: 3, name: '3. What You Feel' }, { id: 4, name: '4. The Heart of the Matter' }];
const pastPresentFuturePositions = [{ id: 1, name: '1. Past' }, { id: 2, name: '2. Present' }, { id: 3, name: '3. Future' }];
const treeOfLifePositions = [{ id: 1, name: '1. Kether (Crown)' }, { id: 2, name: '2. Chokmah (Wisdom)' }, { id: 3, name: '3. Binah (Understanding)' }, { id: 4, name: '4. Chesed (Mercy)' }, { id: 5, name: '5. Geburah (Strength)' }, { id: 6, name: '6. Tiphareth (Beauty)' }, { id: 7, name: '7. Netzach (Victory)' }, { id: 8, name: '8. Hod (Glory)' }, { id: 9, name: '9. Yesod (Foundation)' }, { id: 10, name: '10. Malkuth (Kingdom)' }];
const horseshoePositions = [{ id: 1, name: '1. Past Influences' }, { id: 2, name: '2. Present Situation' }, { id: 3, name: '3. Hidden Influences' }, { id: 4, name: '4. Obstacles' }, { id: 5, name: '5. Your Path' }, { id: 6, name: '6. External Influences' }, { id: 7, name: '7. Outcome' }];
const yearAheadPositions = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `${i + 1}. Month ${i + 1}` }));
const monthAheadPositions = Array.from({ length: 4 }, (_, i) => ({ id: i + 1, name: `${i + 1}. Week ${i + 1}` }));
const weekAheadPositions = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, name: `${i + 1}. Day ${i + 1}` }));
const starSpreadPositions = [{ id: 1, name: '1. You' }, { id: 2, name: '2. Your Hopes' }, { id: 3, name: '3. Your Fears' }, { id: 4, name: '4. Your Strengths' }, { id: 5, name: '5. Your Weaknesses' }, { id: 6, name: '6. The Path Forward' }];
const deckInterviewPositions = [{ id: 1, name: '1. What is your most important characteristic?' }, { id: 2, name: '2. What are your strengths as a deck?' }, { id: 3, name: '3. What are your weaknesses as a deck?' }, { id: 4, name: '4. What can you teach me?' }, { id: 5, name: '5. How can I best learn from you?' }, { id: 6, name: '6. What is our potential together?' }];
const deckBondingPositions = [{ id: 1, name: '1. What energy do I bring to this deck?' }, { id: 2, name: '2. What energy does this deck bring to me?' }, { id: 3, name: '3. How can we communicate more clearly?' }, { id: 4, name: '4. How can we grow together?' }];

// Zodiac Signs Data
const zodiacSignsData = [
  { id: 'aries', name: 'Aries', symbol: '♈', description: 'Aries, the first sign of the zodiac, is known for its pioneering spirit, courage, and enthusiasm. Ruled by Mars, they are natural leaders, assertive, and driven by passion. They can be impulsive but are also incredibly energetic and direct.' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', description: 'Taurus is an Earth sign, symbolizing stability, practicality, and determination. Ruled by Venus, they appreciate beauty, comfort, and luxury. Taureans are known for their patience and persistence, but can also be stubborn and resistant to change.' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', description: 'Gemini, an Air sign ruled by Mercury, is characterized by duality, communication, and intellect. Geminis are curious, adaptable, and quick-witted, often possessing a lively and engaging personality. They can be restless and indecisive due to their dual nature.' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', description: 'Cancer is a Water sign ruled by the Moon, representing emotions, nurturing, and home. Cancers are deeply empathetic, intuitive, and protective of their loved ones. They can be sensitive and prone to mood swings, but offer immense comfort and support.' },
  { id: 'leo', name: 'Leo', symbol: '♌', description: 'Leo, a Fire sign ruled by the Sun, embodies confidence, charisma, and generosity. Leos love to be the center of attention, are natural performers, and possess a warm, vibrant energy. They are fiercely loyal but can also be proud and dramatic.' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', description: 'Virgo is an Earth sign ruled by Mercury, known for its practicality, analytical mind, and meticulous nature. Virgos are hardworking, organized, and always striving for perfection. They can be critical, but their desire to serve and improve is strong.' },
  { id: 'libra', name: 'Libra', symbol: '♎', description: 'Libra, an Air sign ruled by Venus, symbolizes balance, harmony, and justice. Librans are charming, diplomatic, and seek fairness in all aspects of life. They value relationships and beauty, but can be indecisive and avoid confrontation.' thoại: 'Scorpio is a Water sign ruled by Pluto (and Mars), representing intensity, transformation, and power. Scorpios are passionate, mysterious, and deeply emotional, with a strong intuition. They are fiercely determined but can also be secretive and possessive.' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', description: 'Sagittarius, a Fire sign ruled by Jupiter, embodies adventure, optimism, and a love for freedom. Sagittarians are philosophical, enthusiastic, and always seeking new experiences. They are honest but can be tactless and restless.' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', description: 'Capricorn is an Earth sign ruled by Saturn, symbolizing discipline, ambition, and responsibility. Capricorns are practical, patient, and driven to achieve their goals. They are reliable but can be rigid and overly serious.' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', description: 'Aquarius, an Air sign ruled by Uranus (and Saturn), represents innovation, independence, and humanitarianism. Aquarians are intellectual, progressive, and value freedom and equality. They can be eccentric and detached but are visionaries.' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', description: 'Pisces is a Water sign ruled by Neptune (and Jupiter), symbolizing compassion, intuition, and artistic sensitivity. Pisceans are dreamy, empathetic, and highly imaginative. They can be escapist and overly sensitive but possess deep spiritual wisdom.' },
];

// Runes Data
const witchesRunesData = [{ id: 'ring', name: 'Ring', symbol: '⚪', description: 'Represents cycles, wholeness, partnership, and completion. It can signify a new beginning or the end of a phase.' }, { id: 'wave', name: 'Wave', symbol: '🌊', description: 'Symbolizes emotions, intuition, flow, and adaptability. It relates to water, feelings, and the unconscious mind.' }, { id: 'crossed-lines', name: 'Crossed Lines', symbol: '✖️', description: 'Indicates crossroads, choices, conflict, or obstacles. It suggests a decision needs to be made or a challenge overcome.' }, { id: 'star', name: 'Star', symbol: '⭐', description: 'Represents hope, inspiration, guidance, and destiny. It signifies good fortune, clarity, and following your true path.' }, { id: 'sun', name: 'Sun', symbol: '☀️', description: 'Symbolizes success, happiness, vitality, and illumination. It brings warmth, clarity, and positive energy.' }, { id: 'moon', name: 'Moon', symbol: '🌙', description: 'Represents intuition, mystery, hidden knowledge, and the subconscious. It relates to cycles, dreams, and feminine energy.' }, { id: 'flight', name: 'Flight', symbol: '🕊️', description: 'Indicates movement, travel, news, or a message. It can signify freedom, escape, or a new perspective.' }, { id: 'eye', name: 'Eye', symbol: '👁️', description: 'Symbolizes perception, insight, wisdom, and protection. It suggests seeing clearly or being watched.' }, { id: 'harvest', name: 'Harvest', symbol: '🌾', description: 'Represents abundance, prosperity, growth, and completion of a project. It signifies rewards for effort and fruitful outcomes.' }, { id: 'scythe', name: 'Scythe', symbol: '🔪', description: 'Indicates cutting away, ending, transformation, or warning. It suggests the need to release what no longer serves you.' }, { id: 'man', name: 'Man', symbol: '♂️', description: 'Represents masculine energy, action, logic, and the self. It can refer to a male figure or active principles.' }, { id: 'woman', name: 'Woman', symbol: '♀️', description: 'Represents feminine energy, intuition, nurturing, and receptivity. It can refer to a female figure or passive principles.' }, { id: 'crossroads', name: 'Crossroads', symbol: '➕', description: 'A more direct symbol for choices, decisions, and the intersection of paths. Similar to Crossed Lines but often more about a clear path forward.' },];
const elderFutharkRunesData = [{ id: 'fehu', name: 'Fehu', symbol: 'ᚠ', description: 'Cattle, wealth, abundance, financial strength, new beginnings.' }, { id: 'uruz', name: 'Uruz', symbol: 'ᚢ', description: 'Wild ox, strength, untamed potential, raw power, good health.' }, { id: 'thurisaz', name: 'Thurisaz', symbol: 'ᚦ', description: 'Thorn, giant, protection, destructive force, conflict, challenge.' }, { id: 'ansuz', name: 'Ansuz', symbol: 'ᚨ', description: 'God, Odin, communication, inspiration, divine insight, wisdom.' }, { id: 'raidho', name: 'Raidho', symbol: 'ᚱ', description: 'Journey, ride, travel, movement, progress, rhythm.' }, { id: 'kenaz', name: 'Kenaz', symbol: 'ᚲ', description: 'Torch, vision, knowledge, creativity, enlightenment, warmth.' }, { id: 'gebo', name: 'Gebo', symbol: 'ᚷ', description: 'Gift, partnership, generosity, balance, exchange, union.' }, { id: 'wunjo', name: 'Wunjo', symbol: 'ᚹ', description: 'Joy, comfort, pleasure, harmony, fellowship, success.' }, { id: 'hagalaz', name: 'Hagalaz', symbol: 'ᚺ', description: 'Hail, disruption, crisis, destructive natural forces, uncontrolled change.' }, { id: 'naudiz', name: 'Naudiz', symbol: 'ᚾ', description: 'Need, necessity, constraint, distress, patience, endurance.' }, { id: 'isa', name: 'Isa', symbol: 'ᛁ', description: 'Ice, stagnation, standstill, challenge, introspection, clarity.' }, { id: 'jera', name: 'Jera', symbol: 'ᛃ', description: 'Year, harvest, cycles, reward, peace, good results.' }, { id: 'eihwaz', name: 'Eihwaz', symbol: 'ᛇ', description: 'Yew tree, strength, reliability, endurance, transformation, death and rebirth.' }, { id: 'perthro', name: 'Perthro', symbol: 'ᛈ', description: 'Lot cup, mystery, fate, hidden knowledge, chance, secrets.' }, { id: 'algiz', name: 'Algiz', symbol: 'z', description: 'Elk, protection, defense, guardian, spiritual connection, divine blessing.' }, { id: 'sowilo', name: 'Sowilo', symbol: 'ᛊ', description: 'Sun, success, honor, wholeness, life force, enlightenment.' }, { id: 'tiwaz', name: 'Tiwaz', symbol: 'ᛏ', description: 'Tyr, justice, sacrifice, victory, leadership, courage.' }, { id: 'berkano', name: 'Berkano', symbol: 'ᛒ', description: 'Birch goddess, growth, new beginnings, fertility, regeneration.' }, { id: 'ehwaz', name: 'Ehwaz', symbol: 'ᛖ', description: 'Horse, movement, progress, partnership, trust, loyalty.' }, { id: 'mannaz', name: 'Mannaz', symbol: 'ᛗ', description: 'Man, humanity, self, community, social order, intelligence.' }, { id: 'laguz', name: 'Laguz', symbol: 'ᛚ', description: 'Water, flow, intuition, emotions, dreams, subconscious.' }, { id: 'ingwaz', name: 'Ingwaz', symbol: 'ᛝ', description: 'Ing, fertility, new ideas, completion, security, inner growth.' }, { id: 'dagaz', name: 'Dagaz', symbol: 'ᛞ', description: 'Day, breakthrough, awakening, hope, transformation, new cycle.' }, { id: 'othala', name: 'Othala', symbol: 'ᛟ', description: 'Inheritance, homeland, property, ancestry, spiritual heritage, tradition.' },];
const youngerFutharkRunesData = [{ id: 'fe', name: 'Fé', symbol: 'ᚠ', description: 'Wealth, cattle, prosperity, material possessions.' }, { id: 'ur', name: 'Úr', symbol: 'ᚢ', description: 'Iron, dross, rain, primeval mist, strength, origin.' }, { id: 'thurs', name: 'Þurs', symbol: 'ᚦ', description: 'Giant, thorn, danger, defense, conflict, power.' }, { id: 'ass', name: 'Ass', symbol: 'ᚬ', description: 'God, mouth, communication, wisdom, inspiration, divine breath.' }, { id: 'reidh', name: 'Reið', symbol: 'ᚱ', description: 'Journey, ride, travel, progress, counsel, order.' }, { id: 'kaun', name: 'Kaun', symbol: 'ᚴ', description: 'Ulcer, torch, disease, death, but also knowledge, light.' }, { id: 'hagall', name: 'Hagall', symbol: 'ᚼ', description: 'Hail, destructive forces, crisis, uncontrolled events, transformation.' }, { id: 'naudh', name: 'Nauð', symbol: 'ᚾ', description: 'Need, distress, constraint, necessity, endurance, patience.' }, { id: 'is', name: 'Ís', symbol: 'ᛁ', description: 'Ice, stagnation, standstill, challenge, introspection, self-preservation.' }, { id: 'ar', name: 'Ár', symbol: 'ᛅ', description: 'Year, harvest, good season, peace, abundance, good results.' }, { id: 'sol', name: 'Sól', symbol: 'ᛋ', description: 'Sun, victory, success, honor, life force, enlightenment.' }, { id: 'tyr', name: 'Týr', symbol: 'ᛏ', description: 'Tyr, justice, sacrifice, victory, leadership, courage.' }, { id: 'bjarkan', name: 'Bjarkan', symbol: 'ᛒ', description: 'Birch, growth, new beginnings, fertility, family, regeneration.' }, { id: 'madhr', name: 'Maðr', symbol: 'ᛘ', description: 'Man, humanity, self, community, social order, intelligence.' }, { id: 'logr', name: 'Logr', symbol: 'ᛚ', description: 'Water, flow, intuition, emotions, dreams, subconscious.' }, { id: 'yr', name: 'Ýr', symbol: 'ᛦ', description: 'Yew, bow, death, transformation, reliability, defense.' },];

// Common Crystals Data
const commonCrystalsData = [{ id: 'amethyst', name: 'Amethyst', description: 'Promotes calm, balance, and peace. Aids in meditation and spiritual awareness. Known for its protective qualities.' }, { id: 'clear-quartz', name: 'Clear Quartz', description: 'The "Master Healer." Amplifies energy and thought, as well as the effect of other crystals. Cleanses and balances all chakras. ' }, { id: 'rose-quartz', name: 'Rose Quartz', description: 'The stone of unconditional love. Opens the heart to all forms of love: self-love, family love, platonic love, and romantic love. Promotes compassion and forgiveness.' }, { id: 'selenite', name: 'Selenite', description: 'Cleansing and charging crystal. Promotes mental clarity, peace, and higher consciousness. Can be used to cleanse other crystals.' }, { id: 'black-tourmaline', name: 'Black Tourmaline', description: 'A powerful protection stone. Shields against negative energies, psychic attacks, and environmental pollutants. Grounds spiritual energy.' }, { id: 'citrine', name: 'Citrine', description: 'Stone of abundance and joy. Attracts wealth, prosperity, and success. Boosts self-confidence and creativity. Does not require cleansing.' }, { id: 'labradorite', name: 'Labradorite', description: 'Stone of transformation and magic. Awakens spiritual abilities and intuition. Protects the aura and deflects negative energies.' },];

// Common Deities Data
const commonDeitiesData = [{ id: 'freya', name: 'Freya', description: 'Norse goddess of love, beauty, fertility, war, and death. Associated with seiðr (magic) and gold.' }, { id: 'odin', name: 'Odin', description: 'Norse Allfather, god of wisdom, poetry, death, magic, and war. Associated with ravens, wolves, and the runic alphabet.' }, { id: 'loki', name: 'Loki', description: 'Norse trickster god, associated with mischief, fire, and magic. A complex figure who can be both helpful and harmful.' }, { id: 'brigid', name: 'Brigid', description: 'Celtic goddess of poetry, healing, smithcraft, and spring. Celebrated during Imbolc.' }, { id: 'horus', name: 'Horus', description: 'Egyptian god of kingship, the sky, and protection. Often depicted with the head of a falcon.' }, { id: 'isis', name: 'Isis', description: 'Egyptian goddess of magic, motherhood, healing, and rebirth. A powerful and benevolent figure.' }, { id: 'hades', name: 'Hades', description: 'Greek god of the underworld and the dead, and the riches of the earth. Often misunderstood, he is a just ruler.' },];

// Common Herbs Data
const commonHerbsData = [{ id: 'lavender', name: 'Lavender', description: 'Calming, peace, sleep, purification, love, healing, happiness.' }, { id: 'rosemary', name: 'Rosemary', description: 'Protection, purification, healing, memory, wisdom, love, exorcism.' }, { id: 'mugwort', name: 'Mugwort', description: 'Divination, dreams, psychic abilities, protection, astral projection.' }, { id: 'basil', name: 'Basil', description: 'Wealth, prosperity, protection, love, purification, courage.' }, { id: 'chamomile', name: 'Chamomile', description: 'Peace, relaxation, sleep, money, love, purification, breaking curses.' }, { id: 'sage', name: 'Sage', description: 'Purification, cleansing, wisdom, protection, healing, immortality.' }, { id: 'thyme', name: 'Thyme', description: 'Courage, healing, sleep, psychic abilities, purification, strength.' },];

// Common Incense & Oils Data
const commonIncenseOilsData = [{ id: 'frankincense', name: 'Frankincense', description: 'Purification, protection, spirituality, meditation, consecration, banishing negativity. Used in many ancient rituals for its sacred smoke.' }, { id: 'myrrh', name: 'Myrrh', description: 'Healing, protection, spirituality, meditation, banishing, peace. Often combined with Frankincense. Associated with ancient Egyptian rituals.' }, { id: 'sandalwood', name: 'Sandalwood', description: 'Spirituality, meditation, healing, protection, wishes, consecration. Calming and grounding, often used to deepen spiritual practice.' }, { id: 'patchouli', name: 'Patchouli', description: 'Money, abundance, grounding, lust, protection, banishing. Known for its earthy scent and strong magical associations with prosperity.' }, { id: 'lavender-oil', name: 'Lavender Oil', description: 'Peace, sleep, purification, love, healing, calming, relaxation. Used for anointing, baths, and diffusers for its soothing properties.' }, { id: 'cedarwood-oil', name: 'Cedarwood Oil', description: 'Protection, purification, grounding, strength, wisdom, healing. Used to cleanse spaces, anoint tools, and invoke ancient energies.' }, { id: 'dragon-blood-resin', name: 'Dragon\'s Blood Resin', description: 'Protection, power, banishing, healing, love, exorcism, enhancing other spells. A powerful resin that amplifies magical work.' },];

// Holiday Data Structure and Data
interface HolidayData { id: string; name: string; date: string; zodiac: string; symbols: string[]; animals: string[]; deities: string[]; food: string[]; incense_oils: string[]; herbs_flowers: string[]; crystals_stones: string[]; colors: string[]; description: string; }
const holidaysData: HolidayData[] = [
  { id: 'yule', name: 'Yule (Winter Solstice)', date: 'December 21-22', zodiac: 'Capricorn', symbols: ['Yule Log', 'Evergreens', 'Candles', 'Holly', 'Mistletoe', 'Wreaths'], animals: ['Deer', 'Stag', 'Bear', 'Wolf', 'Robin'], deities: ['Odin', 'Freya', 'Saturn', 'Holly King', 'Sun Gods'], food: ['Roasted Meats', 'Gingerbread', 'Mulled Wine', 'Nuts', 'Apples', 'Cranberries'], incense_oils: ['Pine', 'Cedar', 'Frankincense', 'Myrrh', 'Cinnamon'], herbs_flowers: ['Pine', 'Cedar', 'Holly', 'Mistletoe', 'Ivy', 'Bay'], crystals_stones: ['Garnet', 'Ruby', 'Bloodstone', 'Clear Quartz', 'Emerald'], colors: ['Red', 'Green', 'Gold', 'Silver', 'White'], description: 'Yule marks the Winter Solstice, the longest night of the year and the rebirth of the sun. It is a time for reflection, renewal, and celebrating the return of light.', },
  { id: 'imbolc', name: 'Imbolc', date: 'February 1-2', zodiac: 'Aquarius', symbols: ['Candles', 'Snowdrops', 'White Flowers', 'Brighid\'s Cross', 'Lamps'], animals: ['Sheep', 'Lambs', 'Groundhog', 'Robin'], deities: ['Brigid', 'Maiden Aspects', 'Pan'], food: ['Dairy', 'Seed Cakes', 'Herbal Teas', 'Onions', 'Garlic'], incense_oils: ['Jasmine', 'Vanilla', 'Myrrh', 'Cinnamon', 'Frankincense'], herbs_flowers: ['Snowdrop', 'Crocus', 'Willow', 'Blackberry', 'Angelica'], crystals_stones: ['Amethyst', 'Garnet', 'Onyx', 'Bloodstone', 'Turquoise'], colors: ['White', 'Silver', 'Light Blue', 'Green'], description: 'Imbolc celebrates the first signs of spring and the quickening of the earth. It\'s a time for purification, new beginnings, and honoring the goddess Brigid.', },
  { id: 'ostara', name: 'Ostara (Spring Equinox)', date: 'March 20-21', zodiac: 'Aries', symbols: ['Eggs', 'Rabbits', 'Spring Flowers', 'New Growth', 'Baskets'], animals: ['Rabbits', 'Hares', 'Chicks', 'Birds'], deities: ['Ostara', 'Eostre', 'Persephone', 'Maiden Aspects'], food: ['Eggs', 'Honey Cakes', 'Leafy Greens', 'Sprouts', 'Spring Vegetables'], incense_oils: ['Jasmine', 'Rose', 'Strawberry', 'Ginger', 'Sandalwood'], herbs_flowers: ['Daffodil', 'Tulip', 'Crocus', 'Violet', 'Honeysuckle'], crystals_stones: ['Rose Quartz', 'Amethyst', 'Moonstone', 'Aquamarine', 'Bloodstone'], colors: ['Pastels', 'Green', 'Yellow', 'Pink', 'White'], description: 'Ostara marks the Spring Equinox, a time of perfect balance between light and dark. It celebrates fertility, new life, and the awakening of nature.', },
  { id: 'beltane', name: 'Beltane', date: 'May 1', zodiac: 'Taurus, Gemini', symbols: ['Maypoles', 'Wreaths', 'Colorful Ribbons', 'Bonfires', 'Flower Baskets', 'Garlands', 'Floral Crowns', 'Handfasting'], animals: ['Bees', 'Deer', 'Cows', 'Horses', 'Rabbits & Hares', 'Doves', 'Swallows', 'Swans', 'Frogs', 'Cats', 'Lynx', 'Leopards', 'Butterflies'], deities: ['Belenus', 'Cernunnos', 'Freya', 'Pan', 'Flora', 'Aphrodite', 'Diana', 'Artemis', 'Green Man'], food: ['Dairy', 'Oatmeal', 'Honey', 'Breads', 'Cakes', 'Fruits & Berries', 'Herb-Infused Foods', 'Wine'], incense_oils: ['Frankincense', 'Rose', 'Lilac', 'Mint', 'Jasmine', 'Thyme', 'Vanilla', 'Ylang Ylang', 'Lemon', 'Mugwort'], herbs_flowers: ['Hawthorn', 'Mugwort', 'Lavender', 'Rose', 'Nettle', 'Dandelion', 'Bluebells', 'Violets', 'Mint', 'Yarrow'], crystals_stones: ['Rose Quartz', 'Malachite', 'Carnelian', 'Sapphire', 'Tourmaline', 'Emerald'], colors: ['Green', 'Blue', 'Yellow', 'Purple', 'Red', 'Pink', 'White'], description: 'Beltane celebrates the peak of spring and the coming of summer. It is a festival of fertility, passion, and the blossoming of life, often marked by bonfires and Maypole dances.', },
  { id: 'litha', name: 'Litha (Summer Solstice)', date: 'June 20-21', zodiac: 'Cancer', symbols: ['Sun Wheel', 'Oak Leaves', 'Bonfires', 'Herbs', 'Flowers', 'Honey', 'Sunflowers'], animals: ['Horses', 'Stags', 'Eagles', 'Lions', 'Fireflies'], deities: ['Sun Gods/Goddesses', 'Oak King', 'Green Man', 'Lugh', 'Apollo'], food: ['Fresh Fruits', 'Summer Vegetables', 'Honey Cakes', 'Mead', 'Berries', 'Herbal Breads'], incense_oils: ['Lemon', 'Orange', 'Pine', 'Cedar', 'Rosemary', 'Chamomile'], herbs_flowers: ['Oak', 'Rose', 'Lavender', 'Chamomile', 'Sunflower', 'Daisy', 'Fennel'], crystals_stones: ['Citrine', 'Amber', 'Tiger\'s Eye', 'Sunstone', 'Emerald', 'Peridot'], colors: ['Gold', 'Yellow', 'Orange', 'Green', 'Red'], description: 'Litha marks the Summer Solstice, the longest day of the year and the peak of the sun\'s power. It is a time for celebrating abundance, vitality, and light.', },
  { id: 'lughnasadh', name: 'Lughnasadh (Lammas)', date: 'August 1-2', zodiac: 'Leo', symbols: ['Bread', 'Grain Sheaves', 'Corn Dollies', 'Sickle', 'Harvest Baskets'], animals: ['Lions', 'Roosters', 'Grain-eating birds'], deities: ['Lugh', 'Tailtiu', 'Demeter', 'Ceres', 'Harvest Deities'], food: ['Freshly Baked Bread', 'Corn', 'Berries', 'Apples', 'Potatoes', 'Cider'], incense_oils: ['Sandalwood', 'Cinnamon', 'Ginger', 'Clove', 'Cedar'], herbs_flowers: ['Corn', 'Wheat', 'Barley', 'Sunflower', 'Marigold', 'Poppy'], crystals_stones: ['Peridot', 'Carnelian', 'Tiger\'s Eye', 'Goldstone', 'Yellow Jasper'], colors: ['Gold', 'Orange', 'Yellow', 'Brown', 'Green'], description: 'Lughnasadh is the first harvest festival, celebrating the ripening of grain and the bounty of the earth. It\'s a time for gratitude, feasting, and honoring the harvest deities.', },
  { id: 'mabon', name: 'Mabon (Autumn Equinox)', date: 'September 21-22', zodiac: 'Libra', symbols: ['Cornucopia', 'Gourds', 'Apples', 'Wine', 'Autumn Leaves', 'Baskets of Harvest'], animals: ['Stags', 'Owls', 'Bears', 'Salmon'], deities: ['Persephone', 'Demeter', 'Mabon', 'Green Man (as the aging king)'], food: ['Apples', 'Grapes', 'Wine', 'Squash', 'Root Vegetables', 'Nuts', 'Cider'], incense_oils: ['Cinnamon', 'Clove', 'Nutmeg', 'Pine', 'Myrrh', 'Frankincense'], herbs_flowers: ['Oak', 'Maple', 'Pine', 'Ivy', 'Chrysanthemum', 'Marigold'], crystals_stones: ['Sapphire', 'Lapis Lazuli', 'Yellow Jasper', 'Carnelian', 'Smoky Quartz'], colors: ['Brown', 'Orange', 'Red', 'Gold', 'Purple'], description: 'Mabon marks the Autumn Equinox, a time of balance and the second harvest. It is a celebration of abundance, gratitude, and preparing for the darker half of the year.', },
  { id: 'samhain', name: 'Samhain', date: 'October 31 - November 1', zodiac: 'Scorpio', symbols: ['Pumpkins', 'Apples', 'Bonfires', 'Cauldrons', 'Ancestral Altars', 'Veil between worlds'], animals: ['Cats', 'Owls', 'Bats', 'Spiders', 'Black Dogs'], deities: ['Hecate', 'Morrigan', 'Cernunnos', 'Ancestors', 'Crone Aspects'], food: ['Apples', 'Pomegranates', 'Nuts', 'Squash', 'Soul Cakes', 'Roasted Root Vegetables'], incense_oils: ['Patchouli', 'Myrrh', 'Frankincense', 'Clove', 'Cinnamon', 'Nutmeg'], herbs_flowers: ['Mugwort', 'Wormwood', 'Apple Leaves', 'Chrysanthemum', 'Rosemary'], crystals_stones: ['Obsidian', 'Black Tourmaline', 'Smoky Quartz', 'Onyx', 'Garnet'], colors: ['Black', 'Orange', 'Purple', 'Brown', 'Silver'], description: 'Samhain marks the end of the harvest season and the beginning of winter. It is a time when the veil between the worlds is thinnest, allowing communication with ancestors and spirits. It is a time for remembrance and introspection.', },
];

// Cardinal Points Data
const cardinalPointsData = [{ id: 'north', name: 'North', element: 'Earth', direction: 'Midnight', dwarf: 'Norðri', associations: ['Physical realm, stability, grounding, fertility, manifestation.', 'Winter, darkness, introspection, wisdom of the ancestors.', 'Associated with the primordial realm of Niflheim (realm of ice and mist).', 'Colors: Black, Green, Brown.'] }, { id: 'east', name: 'East', element: 'Air', direction: 'Dawn', dwarf: 'Austri', associations: ['Intellect, communication, new beginnings, inspiration, clarity.', 'Spring, renewal, fresh ideas, mental pursuits.', 'Associated with the primordial realm of Muspelheim (realm of fire and light) as the sun rises from the East.', 'Colors: Yellow, White, Light Blue.'] }, { id: 'south', name: 'South', element: 'Fire', direction: 'Noon', dwarf: 'Suðri', associations: ['Passion, energy, transformation, courage, action, creativity.', 'Summer, growth, warmth, strength, vitality.', 'Associated with the primordial realm of Muspelheim (realm of fire and light).', 'Colors: Red, Orange, Gold.'] }, { id: 'west', name: 'West', element: 'Water', direction: 'Dusk', dwarf: 'Vestri', associations: ['Emotion, intuition, healing, introspection, subconscious, dreams.', 'Autumn, reflection, release, spiritual cleansing.', 'Associated with the realm of the dead or the sea, a place of transition.', 'Colors: Blue, Silver, Indigo.'] },];

// Elements Data
const elementsData = [{ id: 'earth', name: 'Earth', associations: ['**Qualities:** Stability, grounding, fertility, abundance, prosperity, manifestation, structure, patience, physical body, security.', '**Pagan Significance:** Represents the material world, the foundation of life, growth, and nourishment. Often invoked for protection, healing, and drawing in material wealth. Connected to the natural world, trees, mountains, and soil.', '**Direction:** North', '**Tools:** Pentacle, Salt, Stones, Soil', '**Colors:** Green, Brown, Black'] }, { id: 'wind', name: 'Air', associations: ['**Qualities:** Intellect, communication, thought, inspiration, knowledge, wisdom, freedom, clarity, travel, new ideas, breath.', '**Pagan Significance:** Represents the mind, communication, and the unseen forces of thought and spirit. Invoked for wisdom, clear thinking, banishing negativity, and new beginnings. Associated with breezes, winds, and the sky.', '**Direction:** East', '**Tools:** Athame (dagger), Incense, Feathers, Wand', '**Colors:** Yellow, White, Light Blue'] }, { id: 'fire', name: 'Fire', associations: ['**Qualities:** Transformation, passion, energy, courage, purification, destruction, creation, will, drive, protection, healing.', '**Pagan Significance:** Represents divine spark, passion, and the power to transform. Invoked for strength, courage, banishing, purification, and igniting change. Associated with flames, the sun, lightning, and volcanoes.', '**Direction:** South', '**Tools:** Candle, Censer, Lamp, Wand', '**Colors:** Red, Orange, Gold'] }, { id: 'water', name: 'Water', associations: ['**Qualities:** Emotion, intuition, healing, purification, subconscious, dreams, compassion, fluidity, adaptability, love, psychic abilities.', '**Pagan Significance:** Represents emotions, intuition, and the subconscious mind. Invoked for healing, purification, love, dreams, and psychic development. Associated with oceans, rivers, lakes, rain, and springs.', '**Direction:** West', '**Tools:** Chalice, Cauldron, Bowl of Water, Shells', '**Colors:** Blue, Silver, Indigo'] }, { id: 'soul', name: 'Spirit (Aether)', associations: ['**Qualities:** Wholeness, transcendence, connection to the divine, magic, balance, unity, truth, life force, the all.', '**Pagan Significance:** The unifying force behind the other four elements; the essence of all things. Represents the divine spark within, the connection to the cosmos, and the ultimate source of magic. Often invoked for spiritual connection, enlightenment, and bringing all aspects into harmony.', '**Direction:** Center (or above/below)', '**Tools:** The Altar itself, your Will, your Breath', '**Colors:** White, Violet, Gold, Rainbow'] }];

// Colour Theory Data
const colourTheoryData = [{ id: 'red', name: 'Red', emotional: 'Passion, anger, love, energy, danger, strength, excitement.', chakra: 'Root Chakra (Muladhara) - grounding, security, survival.', magical: 'Energy, courage, protection, lust, strength, vitality, banishing negativity, fast action.', pagan: 'Life, blood, fire, war, fertility, protection, passion, the God aspect, masculine energy.' }, { id: 'orange', name: 'Orange', emotional: 'Enthusiasm, creativity, joy, determination, warmth, success, stimulation.', chakra: 'Sacral Chakra (Svadhisthana) - creativity, sexuality, emotions, pleasure.', magical: 'Creativity, success, attraction, joy, stimulation, ambition, legal matters, justice.', pagan: 'Fertility, abundance, warmth, attraction, success, the sun\'s energy, harvest.' }, { id: 'yellow', name: 'Yellow', emotional: 'Happiness, optimism, intellect, clarity, caution, cheerfulness, deceit.', chakra: 'Solar Plexus Chakra (Manipura) - personal power, will, self-esteem, digestion.', magical: 'Intellect, communication, confidence, success, joy, learning, focus, persuasion, healing.', pagan: 'Sun, intellect, wisdom, air, communication, inspiration, blessings, happiness.' }, { id: 'green', name: 'Green', emotional: 'Growth, harmony, nature, healing, envy, freshness, balance, stability.', chakra: 'Heart Chakra (Anahata) - love, compassion, healing, balance, connection.', magical: 'Prosperity, abundance, healing, growth, fertility, luck, nature magic, money.', pagan: 'Earth, nature, fertility, growth, prosperity, healing, the Green Man, fae folk.' }, { id: 'blue', name: 'Blue', emotional: 'Calm, serenity, sadness, trust, loyalty, wisdom, peace, introspection.', chakra: 'Throat Chakra (Vishuddha) - communication, self-expression, truth.', magical: 'Peace, healing, wisdom, truth, protection, intuition, dreams, psychic abilities, calm.', pagan: 'Water, healing, peace, truth, wisdom, intuition, dreams, protection, the Goddess aspect, feminine energy.' }, { id: 'indigo', name: 'Indigo', emotional: 'Intuition, wisdom, spiritual insight, mystery, devotion, integrity.', chakra: 'Third Eye Chakra (Ajna) - intuition, psychic abilities, inner wisdom, perception.', magical: 'Deep meditation, psychic awareness, spiritual growth, wisdom, truth, breaking curses, deep healing.', pagan: 'Deep wisdom, psychic insight, the subconscious, the cosmic mind, ancient knowledge.' }, { id: 'violet', name: 'Violet', emotional: 'Spirituality, mystery, imagination, royalty, creativity, wisdom, transformation.', chakra: 'Crown Chakra (Sahasrara) - spiritual connection, enlightenment, cosmic consciousness.', magical: 'Spirituality, psychic abilities, wisdom, meditation, divination, protection, transformation, breaking habits.', pagan: 'Spirit, magic, psychic power, spiritual connection, transformation, higher consciousness.' }, { id: 'white', name: 'White', emotional: 'Purity, innocence, peace, cleanliness, new beginnings, emptiness.', chakra: 'All chakras (cleansing, balancing).', magical: 'Purity, cleansing, protection, truth, healing, spirituality, new beginnings, blessings, moon magic.', pagan: 'Purity, cleansing, peace, protection, the Goddess, moon magic, spirit, truth.' }, { id: 'black', name: 'Black', emotional: 'Mystery, elegance, death, fear, power, formality, sophistication, grief.', chakra: 'Root Chakra (grounding, protection).', magical: 'Protection, banishing negativity, binding, absorbing negativity, grounding, divination, endings, wisdom.', pagan: 'Protection, banishing, absorbing, endings, the void, introspection, mystery, the Crone aspect.' }, { id: 'silver', name: 'Silver', emotional: 'Grace, elegance, intuition, sophistication, coolness, moonlight.', chakra: 'Crown Chakra (spiritual connection), Third Eye (intuition).', magical: 'Intuition, psychic abilities, moon magic, dreams, protection, reflection, feminine energy, scrying.', pagan: 'Moon, Goddess, intuition, psychic power, dreams, reflection, feminine mysteries.' }, { id: 'gold', name: 'Gold', emotional: 'Wealth, luxury, success, prestige, illumination, wisdom, divinity.', chakra: 'Solar Plexus (power), Crown (divine connection).', magical: 'Wealth, prosperity, success, solar energy, divine connection, healing, protection, male energy, luck.', pagan: 'Sun, God, prosperity, success, divine power, illumination, masculine energy.' }, { id: 'brown', name: 'Brown', emotional: 'Stability, reliability, warmth, nature, comfort, security, practicality.', chakra: 'Root Chakra (grounding, stability).', magical: 'Grounding, stability, home, animal magic, material gain, healing animals, practical matters.', pagan: 'Earth, grounding, stability, home, hearth, animals, practical magic, connection to the land.' }, { id: 'pink', name: 'Pink', emotional: 'Love, compassion, nurturing, friendship, tenderness, joy, innocence.', chakra: 'Heart Chakra (love, compassion).', magical: 'Love (especially self-love, friendship, romantic love), compassion, healing, emotional healing, peace, joy.', pagan: 'Love, friendship, compassion, nurturing, emotional healing, the Goddess in her loving aspects.' }, { id: 'grey', name: 'Grey', emotional: 'Neutrality, balance, compromise, detachment, sadness, uncertainty.', chakra: 'None specifically; can be used for balancing or neutralizing.', magical: 'Neutrality, balance, illusion, invisibility, banishing negative influences, scrying, wisdom, removing obstacles.', pagan: 'Neutrality, balance, wisdom, the in-between, hidden aspects, fog, twilight.' },];


// --- Shared Interfaces ---
interface MenuItem { id: string; name: string; subItems?: MenuItem[]; }
interface SpreadPosition { id: number; name: string; }
interface SpreadSelectionItem { id: number; name: string; cardId: string; orientation: 'upright' | 'reversed'; }
interface SpreadDefinition { name: string; positions: SpreadPosition[]; layoutComponent: React.FC; description: string; }

// --- Menu Component ---
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
    setOpenSections(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    w-64 bg-purple-900 text-purple-200 p-4 shadow-xl transition-transform duration-300 ease-in-out
                    z-30 sm:relative sm:translate-x-0 sm:w-64 sm:flex-shrink-0 overflow-y-auto max-h-screen`}>
      <div className="flex justify-between items-center mb-6 sm:hidden">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button onClick={onToggleMenu} className="text-purple-200 hover:text-white focus:outline-none text-3xl">
          &times;
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className="mb-2">
              {item.subItems ? (
                <div>
                  <button onClick={() => toggleSection(item.id)} className="w-full text-left flex justify-between items-center py-2 px-3 rounded-md bg-purple-800 hover:bg-purple-700 font-semibold text-lg focus:outline-none">
                    {item.name} <span className="text-xl">{openSections.includes(item.id) ? '▲' : '▼'}</span>
                  </button>
                  {openSections.includes(item.id) && (
                    <ul className="ml-4 mt-2 border-l border-purple-700 pl-3">
                      {item.subItems.map(subItem => (
                        <li key={subItem.id} className="mb-1">
                          {subItem.subItems ? (
                            <div>
                              <button onClick={() => toggleSection(subItem.id)} className="w-full text-left flex justify-between items-center py-2 px-3 rounded-md bg-purple-800 hover:bg-purple-700 font-semibold text-base focus:outline-none">
                                {subItem.name} <span className="text-xl">{openSections.includes(subItem.id) ? '▲' : '▼'}</span>
                              </button>
                              {openSections.includes(subItem.id) && (
                                <ul className="ml-4 mt-2 border-l border-purple-700 pl-3">
                                  {subItem.subItems.map(subSubItem => (
                                    <li key={subSubItem.id} className="mb-1">
                                      <button onClick={() => { onSelect(subSubItem.id); onToggleMenu(); }} className={`w-full text-left py-2 px-3 rounded-md text-sm transition-colors duration-200 ${selectedItem === subSubItem.id ? 'bg-purple-700 text-white font-medium' : 'hover:bg-purple-800'}`}>
                                        {subSubItem.name}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <button onClick={() => { onSelect(subItem.id); onToggleMenu(); }} className={`w-full text-left py-2 px-3 rounded-md text-base transition-colors duration-200 ${selectedItem === subItem.id ? 'bg-purple-700 text-white font-medium' : 'hover:bg-purple-800'}`}>
                              {subItem.name}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button onClick={() => { onSelect(item.id); onToggleMenu(); }} className={`w-full text-left py-2 px-3 rounded-md text-lg font-semibold transition-colors duration-200 ${selectedItem === item.id ? 'bg-purple-700 text-white' : 'bg-purple-800 hover:bg-purple-700'}`}>
                  {item.name}
                </button>
              )}
            </li>
          ))}
          {/* NEW: Journal Menu Item */}
          <li className="mb-2 mt-4">
            <button onClick={() => { onSelect('journal'); onToggleMenu(); }} className={`w-full text-left py-2 px-3 rounded-md text-lg font-semibold transition-colors duration-200 ${selectedItem === 'journal' ? 'bg-purple-700 text-white' : 'bg-purple-800 hover:bg-purple-700'}`}>
              Journal
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// --- SVG Card Layout Components ---
interface CardPositionProps { x: number; y: number; label: string; rotation?: number; }
const CardPosition: React.FC<CardPositionProps> = ({ x, y, label, rotation = 0 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
    <rect x="-30" y="-45" width="60" height="90" rx="8" ry="8" fill="#5A2D82" stroke="#B088F0" strokeWidth="2" />
    <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">{label}</text>
  </g>
);
const CelticCrossLayout: React.FC = () => (<svg viewBox="0 0 450 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="180" y="150" label="1" /> <CardPosition x="220" y="150" label="2" rotation={90} /> <CardPosition x="180" y="100" label="3" /> <CardPosition x="180" y="200" label="4" /> <CardPosition x="130" y="150" label="5" /> <CardPosition x="230" y="150" label="6" /> <CardPosition x="370" y="260" label="7" /> <CardPosition x="370" y="210" label="8" /> <CardPosition x="370" y="160" label="9" /> <CardPosition x="370" y="110" label="10" /> <CardPosition x="370" y="60" label="11" /> <CardPosition x="370" y="10" label="12" /> </svg>);
const ThreeCardLayout: React.FC = () => (<svg viewBox="0 0 300 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="70" y="75" label="1" /> <CardPosition x="150" y="75" label="2" /> <CardPosition x="230" y="75" label="3" /> </svg>);
const StarSpreadLayout: React.FC = () => (<svg viewBox="0 0 400 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="200" y="150" label="1" /> <CardPosition x="200" y="50" label="2" /> <CardPosition x="300" y="100" label="3" rotation={30} /> <CardPosition x="300" y="200" label="4" rotation={-30} /> <CardPosition x="200" y="250" label="5" /> <CardPosition x="100" y="200" label="6" rotation={30} /> </svg>);
const HeartAndHeadLayout: React.FC = () => (<svg viewBox="0 0 300 250" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="150" y="50" label="1" /> <CardPosition x="220" y="125" label="2" /> <CardPosition x="80" y="125" label="3" /> <CardPosition x="150" y="200" label="4" /> </svg>);
const PastPresentFutureLayout: React.FC = () => (<svg viewBox="0 0 350 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="70" y="75" label="1" /> <CardPosition x="175" y="75" label="2" /> <CardPosition x="280" y="75" label="3" /> </svg>);
const TreeOfLifeLayout: React.FC = () => (<svg viewBox="0 0 300 550" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="150" y="30" label="1" /> <CardPosition x="80" y="120" label="2" /> <CardPosition x="220" y="120" label="3" /> <CardPosition x="80" y="210" label="4" /> <CardPosition x="220" y="210" label="5" /> <CardPosition x="150" y="300" label="6" /> <CardPosition x="80" y="390" label="7" /> <CardPosition x="220" y="390" label="8" /> <CardPosition x="150" y="450" label="9" /> <CardPosition x="150" y="510" label="10" /> </svg>);
const HorseshoeLayout: React.FC = () => (<svg viewBox="0 0 400 250" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="50" y="125" label="1" rotation={-15} /> <CardPosition x="100" y="70" label="2" rotation={-5} /> <CardPosition x="175" y="50" label="3" /> <CardPosition x="250" y="70" label="4" rotation={5} /> <CardPosition x="300" y="125" label="5" rotation={15} /> <CardPosition x="350" y="170" label="6" rotation={25} /> <CardPosition x="200" y="200" label="7" /> </svg>);
const YearAheadLayout: React.FC = () => { const center = { x: 200, y: 200 }; const radius = 120; const positions = Array.from({ length: 12 }, (_, i) => { const angle = (i * (360 / 12) - 90) * (Math.PI / 180); const x = center.x + radius * Math.cos(angle); const y = center.y + radius * Math.sin(angle); return { x, y, label: `${i + 1}` }; }); return (<svg viewBox="0 0 400 400" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> {positions.map((pos, index) => (<CardPosition key={index} x={pos.x} y={pos.y} label={pos.label} />))} </svg>); };
const MonthAheadLayout: React.FC = () => (<svg viewBox="0 0 400 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="50" y="75" label="1" /> <CardPosition x="150" y="75" label="2" /> <CardPosition x="250" y="75" label="3" /> <CardPosition x="350" y="75" label="4" /> </svg>);
const WeekAheadLayout: React.FC = () => (<svg viewBox="0 0 450 150" className="w-full h-auto max-h-64 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="40" y="75" label="1" /> <CardPosition x="100" y="75" label="2" /> <CardPosition x="160" y="75" label="3" /> <CardPosition x="220" y="75" label="4" /> <CardPosition x="280" y="75" label="5" /> <CardPosition x="340" y="75" label="6" /> <CardPosition x="400" y="75" label="7" /> </svg>);
const DeckInterviewLayout: React.FC = () => (<svg viewBox="0 0 400 300" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="100" y="75" label="1" /> <CardPosition x="200" y="75" label="2" /> <CardPosition x="300" y="75" label="3" /> <CardPosition x="100" y="225" label="4" /> <CardPosition x="200" y="225" label="5" /> <CardPosition x="300" y="225" label="6" /> </svg>);
const DeckBondingLayout: React.FC = () => (<svg viewBox="0 0 350 250" className="w-full h-auto max-h-96 mx-auto mb-8 border border-purple-700 rounded-lg bg-purple-900 shadow-inner"> <CardPosition x="175" y="50" label="1" /> <CardPosition x="175" y="200" label="2" /> <CardPosition x="75" y="125" label="3" /> <CardPosition x="275" y="125" label="4" /> </svg>);


// --- Central Spread Definitions Object ---
const spreadDefinitions: { [key: string]: SpreadDefinition } = {
  celticCross: { name: 'Celtic Cross & Staff Spread', positions: celticCrossPositions, layoutComponent: CelticCrossLayout, description: 'Select a card and its orientation for each of the 12 positions.', },
  threeCard: { name: 'Three Card Spread', positions: threeCardPositions, layoutComponent: ThreeCardLayout, description: 'Select three cards for a quick reading (e.g., Past, Present, Future).', },
  starSpread: { name: 'Star Spread', positions: starSpreadPositions, layoutComponent: StarSpreadLayout, description: 'A spread to gain insight into your hopes, fears, strengths, and weaknesses.', },
  heartAndHead: { name: 'Heart and Head Spread', positions: heartAndHeadPositions, layoutComponent: HeartAndHeadLayout, description: 'This spread reveals the spiritual, intellectual, and emotional aspects of your life.', },
  pastPresentFuture: { name: 'Past Present & Future Spread', positions: pastPresentFuturePositions, layoutComponent: PastPresentFutureLayout, description: 'A classic spread for understanding your journey from past to future.', },
  treeOfLife: { name: 'Tree of Life Spread', positions: treeOfLifePositions, layoutComponent: TreeOfLifeLayout, description: 'Explore the different aspects of your life through the Tree of Life Qabalistic system.', },
  horseshoe: { name: 'Horseshoe Spread', positions: horseshoePositions, layoutComponent: HorseshoeLayout, description: 'A comprehensive spread for examining influences, obstacles, and potential outcomes.', },
  yearAhead: { name: 'Year Ahead Spread', positions: yearAheadPositions, layoutComponent: YearAheadLayout, description: 'Gain insight into the themes and energies of each month in the coming year.', },
  monthAhead: { name: 'Month Ahead Spread', positions: monthAheadPositions, layoutComponent: MonthAheadLayout, description: 'A weekly breakdown of energies and insights for the upcoming month.', },
  weekAhead: { name: 'Week Ahead Spread', positions: weekAheadPositions, layoutComponent: WeekAheadLayout, description: 'A daily guide to the energies and events of the upcoming week.', },
  deckInterview: { name: 'Deck Interview Spread', positions: deckInterviewPositions, layoutComponent: DeckInterviewLayout, description: 'A spread to help you get to know a new or existing tarot deck.', },
  deckBonding: { name: 'Deck Bonding Spread', positions: deckBondingPositions, layoutComponent: DeckBondingLayout, description: 'A spread to deepen your connection and bond with your tarot deck.', },
};


// --- Modals ---
interface SearchModalProps {
  isOpen: boolean; onClose: () => void; name: string; imageUrl: string | null;
  meaningText: string; isLoadingImage: boolean; isLoadingMeaning: boolean; type: string;
}

const SearchResultModal: React.FC<SearchModalProps> = ({
  isOpen, onClose, name, imageUrl, meaningText, isLoadingImage, isLoadingMeaning, type
}) => {
  if (!isOpen) return null;

  const placeholderText = type === 'Crystal' ? 'Crystal' : (type === 'Deity' ? 'Deity' : (type === 'Herb' ? 'Herb' : 'Item'));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 max-w-lg w-full text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-purple-200 hover:text-white text-3xl font-bold focus:outline-none">
          &times;
        </button>
        <h3 className="text-3xl font-semibold mb-6 text-purple-200">
          {name ? `About ${name}` : `${type} Search Result`}
        </h3>
        <div className="flex flex-col items-center mb-6">
          {isLoadingImage ? (
            <div className="w-40 h-40 flex items-center justify-center bg-purple-700 rounded-full mb-4 border-2 border-purple-600 shadow-lg text-sm text-purple-300">
              Generating Image...
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={name} className="w-40 h-40 object-cover rounded-full mb-4 border-2 border-purple-600 shadow-lg"
              onError={(e) => { e.currentTarget.src = `https://placehold.co/160x160/7B68EE/FFFFFF?text=${placeholderText}`; console.error(`Failed to load AI image for searched ${type.toLowerCase()} ${name}.`); }}
            />
          ) : (
            imageUrl === 'error' && (
              <div className="w-40 h-40 flex items-center justify-center bg-red-700 text-white rounded-full mb-4 border-2 border-red-600 shadow-lg text-sm">
                Image Error
              </div>
            )
          )}
        </div>
        <div className="bg-purple-800 p-4 rounded-lg shadow-inner text-purple-100 max-h-60 overflow-y-auto">
          <p className="text-lg text-center">
            {isLoadingMeaning ? `Please wait, generating ${type.toLowerCase()} information...` : (
              <span dangerouslySetInnerHTML={{ __html: meaningText.replace(/\n/g, '<br />') }} />
            )}
          </p>
        </div>
        <button onClick={onClose} className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
          Close
        </button>
      </div>
    </div>
  );
};

interface HolidayDetailsModalProps {
  isOpen: boolean; onClose: () => void; holiday: HolidayData | null;
  imageUrl: string | null; isLoadingImage: boolean;
}

const HolidayDetailsModal: React.FC<HolidayDetailsModalProps> = ({
  isOpen, onClose, holiday, imageUrl, isLoadingImage,
}) => {
  if (!isOpen || !holiday) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 max-w-2xl w-full text-center relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-purple-200 hover:text-white text-3xl font-bold focus:outline-none">
          &times;
        </button>
        <h3 className="text-3xl font-semibold mb-6 text-purple-200">{holiday.name}</h3>
        <div className="flex flex-col items-center mb-6">
          {isLoadingImage ? (
            <div className="w-64 h-64 flex items-center justify-center bg-purple-700 rounded-lg mb-4 border-2 border-purple-600 shadow-lg text-sm text-purple-300">
              Generating Image...
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={holiday.name} className="w-64 h-64 object-cover rounded-lg mb-4 border-2 border-purple-600 shadow-lg"
              onError={(e) => { e.currentTarget.src = `https://placehold.co/256x256/7B68EE/FFFFFF?text=${holiday.name}`; console.error(`Failed to load AI image for holiday ${holiday.name}.`); }}
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-purple-700 rounded-lg mb-4 border-2 border-purple-600 shadow-lg text-sm text-purple-300">
              No Image
            </div>
          )}
        </div>
        <div className="text-left text-purple-100 space-y-4">
          <p className="text-lg"><strong className="text-purple-300">Date:</strong> {holiday.date}</p>
          <p className="text-lg"><strong className="text-purple-300">Zodiac:</strong> {holiday.zodiac}</p>
          <p className="text-lg"><strong className="text-purple-300">Description:</strong> {holiday.description}</p>
          <p className="text-lg"><strong className="text-purple-300">Symbols:</strong> {holiday.symbols.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Animals:</strong> {holiday.animals.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Deities:</strong> {holiday.deities.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Food:</strong> {holiday.food.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Incense & Oils:</strong> {holiday.incense_oils.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Herbs & Flowers:</strong> {holiday.herbs_flowers.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Crystals & Stones:</strong> {holiday.crystals_stones.join(', ')}</p>
          <p className="text-lg"><strong className="text-purple-300">Colors:</strong> {holiday.colors.join(', ')}</p>
        </div>
        <button onClick={onClose} className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
          Close
        </button>
      </div>
    </div>
  );
};


// --- Tools/Viewers (New Components) ---

interface TarotSpreadViewerProps {
  currentSpreadType: string;
  currentSpreadPositions: SpreadPosition[];
  currentSpreadSelections: SpreadSelectionItem[];
  handleCardSelect: (positionId: number, cardId: string) => void;
  handleOrientationSelect: (positionId: number, orientation: 'upright' | 'reversed') => void;
  generateRead: () => Promise<void>;
  clearCurrentSpreadSelection: () => void;
  readMessage: string;
  llmInterpretation: string;
  isLoadingInterpretation: boolean;
  allTarotCards: { id: string; name: string; }[];
}

const TarotSpreadViewer: React.FC<TarotSpreadViewerProps> = ({
  currentSpreadType, currentSpreadPositions, currentSpreadSelections,
  handleCardSelect, handleOrientationSelect, generateRead, clearCurrentSpreadSelection,
  readMessage, llmInterpretation, isLoadingInterpretation, allTarotCards
}) => {
  const spreadDef = spreadDefinitions[currentSpreadType];
  if (!spreadDef) return null; // Should not happen if selectedMenuItem is valid

  const LayoutComponent = spreadDef.layoutComponent;

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">{spreadDef.name}</h2>
      <p className="text-md text-purple-300 mb-6 text-center">
        {spreadDef.description}
      </p>
      {LayoutComponent && (<LayoutComponent />)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {currentSpreadSelections.map((position: SpreadSelectionItem) => (
          <div key={position.id} className="bg-purple-900 p-4 rounded-lg shadow-md border border-purple-700">
            <h3 className="text-lg font-medium text-purple-100 mb-2">{position.name}</h3>
            <select
              className="w-full p-2 mb-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={position.cardId}
              onChange={(e) => handleCardSelect(position.id, e.target.value)}
            >
              <option value="">Select Card</option>
              {allTarotCards.map(card => (
                <option key={card.id} value={card.id} disabled={currentSpreadSelections.some(sel => sel.cardId === card.id && sel.id !== position.id)}>
                  {card.name}
                </option>
              ))}
            </select>
            {position.cardId && (
              <div className="flex justify-around items-center text-purple-200">
                <label className="inline-flex items-center">
                  <input type="radio" name={`orientation-${position.id}`} value="upright" checked={position.orientation === 'upright'} onChange={() => handleOrientationSelect(position.id, 'upright')} className="form-radio text-purple-500 h-4 w-4" />
                  <span className="ml-2">Upright</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name={`orientation-${position.id}`} value="reversed" checked={position.orientation === 'reversed'} onChange={() => handleOrientationSelect(position.id, 'reversed')} className="form-radio text-purple-500 h-4 w-4" />
                  <span className="ml-2">Reversed</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button onClick={generateRead} disabled={isLoadingInterpretation} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
          {isLoadingInterpretation ? 'Generating...' : 'Generate Read'}
        </button>
        <button onClick={clearCurrentSpreadSelection} disabled={isLoadingInterpretation} className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
          Clear Selection
        </button>
      </div>
      {readMessage && (
        <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap mt-6">
          <h3 className="text-xl font-semibold mb-3 text-center">Your Reading Summary:</h3>
          <p className="text-lg">{readMessage}</p>
        </div>
      )}
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
};

interface CardMeaningViewerProps {
  selectedCardForMeaning: string;
  setSelectedCardForMeaning: React.Dispatch<React.SetStateAction<string>>;
  cardMeaningText: string;
  isLoadingCardMeaning: boolean;
  allTarotCards: { id: string; name: string; }[];
  fetchCardMeaning: (cardName: string) => Promise<void>;
}

const CardMeaningViewer: React.FC<CardMeaningViewerProps> = ({
  selectedCardForMeaning, setSelectedCardForMeaning, cardMeaningText,
  isLoadingCardMeaning, allTarotCards, fetchCardMeaning
}) => {
  useEffect(() => {
    const card = allTarotCards.find(c => c.id === selectedCardForMeaning);
    fetchCardMeaning(card ? card.name : '');
  }, [selectedCardForMeaning, allTarotCards, fetchCardMeaning]);

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
          {allTarotCards.map(card => (<option key={card.id} value={card.id}>{card.name}</option>))}
        </select>
      </div>
      <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100">
        <h3 className="text-xl font-semibold mb-3 text-center">Meaning:</h3>
        <p className="text-lg">
          {isLoadingCardMeaning ? 'Generating meaning...' : (<span dangerouslySetInnerHTML={{ __html: cardMeaningText.replace(/\n/g, '<br />') }} />)}
        </p>
      </div>
    </div>
  );
};

interface ZodiacSignViewerProps {
  selectedMenuItem: string;
  zodiacSignsData: { id: string; name: string; symbol: string; description: string; }[];
}

const ZodiacSignViewer: React.FC<ZodiacSignViewerProps> = ({ selectedMenuItem, zodiacSignsData }) => {
  const zodiacSign = zodiacSignsData.find(sign => sign.id === selectedMenuItem);
  if (!zodiacSign) return null;

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-4 text-purple-200">{zodiacSign.name}</h2>
      <p className="text-6xl mb-4">{zodiacSign.symbol}</p>
      <p className="text-lg text-purple-300 leading-relaxed">
        {zodiacSign.description}
      </p>
    </div>
  );
};

interface RunesViewerProps {
  selectedMenuItem: string;
  witchesRunesData: { id: string; name: string; symbol: string; description: string; }[];
  elderFutharkRunesData: { id: string; name: string; symbol: string; description: string; }[];
  youngerFutharkRunesData: { id: string; name: string; symbol: string; description: string; }[];
}

const RunesViewer: React.FC<RunesViewerProps> = ({ selectedMenuItem, witchesRunesData, elderFutharkRunesData, youngerFutharkRunesData }) => {
  let title = '';
  let description = '';
  let runesToDisplay: { id: string; name: string; symbol: string; description: string; }[] = [];

  switch (selectedMenuItem) {
    case 'witchesRunes':
      title = 'The 13 Witches Runes';
      description = 'Explore the meanings of the Witches Runes, a modern set of symbols used for divination.';
      runesToDisplay = witchesRunesData;
      break;
    case 'elderFuthark':
      title = 'Elder Futhark Runes';
      description = 'Explore the meanings of the 24 runes of the Elder Futhark, the oldest form of the runic alphabet.';
      runesToDisplay = elderFutharkRunesData;
      break;
    case 'youngerFuthark':
      title = 'Younger Futhark Runes';
      description = 'Explore the meanings of the 16 runes of the Younger Futhark, a later and more simplified runic alphabet.';
      runesToDisplay = youngerFutharkRunesData;
      break;
    default:
      return null;
  }

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">{title}</h2>
      <p className="text-md text-purple-300 mb-6 text-center">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {runesToDisplay.map(rune => (
          <div key={rune.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center">
            <h3 className="text-xl font-semibold text-purple-100 mb-2">{rune.name}</h3>
            <p className="text-5xl mb-3 font-['Segoe UI Historic']">{rune.symbol}</p>
            <p className="text-md text-purple-300 leading-relaxed">{rune.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CrystalsViewerProps {
  textApiUrl: string;
  imageGenApiUrl: string;
  commonCrystalsData: { id: string; name: string; description: string; }[];
}

const CrystalsViewer: React.FC<CrystalsViewerProps> = ({ textApiUrl, imageGenApiUrl, commonCrystalsData }) => {
  const [crystalSearchTerm, setCrystalSearchTerm] = useState('');
  const [crystalMeaningText, setCrystalMeaningText] = useState('Search for any crystal to learn its properties.');
  const [isLoadingCrystalMeaning, setIsLoadingCrystalMeaning] = useState(false);
  const [searchedCrystalImage, setSearchedCrystalImage] = useState<string | null>(null);
  const [isLoadingSearchedCrystalImage, setIsLoadingSearchedCrystalImage] = useState(false);
  const [showCrystalSearchModal, setShowCrystalSearchModal] = useState(false);
  const [commonCrystalImages, setCommonCrystalImages] = useState<Record<string, string>>({});
  const [loadingCommonCrystalImages, setLoadingCommonCrystalImages] = useState<Record<string, boolean>>({});

  const fetchCrystalImage = useCallback(async (crystalId: string, crystalName: string) => {
    setLoadingCommonCrystalImages(prev => ({ ...prev, [crystalId]: true }));
    setCommonCrystalImages(prev => ({ ...prev, [crystalId]: '' }));
    const prompt = `A realistic, high-quality photograph of a raw, natural ${crystalName} crystal, with soft, mystical lighting and a clean, dark background. Focus on the texture and natural form of the crystal.`;
    try {
      console.log(`[CrystalsViewer] Sending image generation request for ${crystalName} to Imagen API...`);
      const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
      const response = await fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log(`[CrystalsViewer] Imagen API response for ${crystalName}:`, result);

      if (response.ok && result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setCommonCrystalImages(prev => ({ ...prev, [crystalId]: imageUrl }));
      } else {
        console.error(`[CrystalsViewer] Failed to generate image for ${crystalName}:`, result);
        setCommonCrystalImages(prev => ({ ...prev, [crystalId]: 'error' }));
      }
    } catch (error) {
      console.error(`[CrystalsViewer] Error generating image for ${crystalName}:`, error);
      setCommonCrystalImages(prev => ({ ...prev, [crystalId]: 'error' }));
    } finally {
      setLoadingCommonCrystalImages(prev => ({ ...prev, [crystalId]: false }));
    }
  }, [imageGenApiUrl]);

  const fetchCrystalMeaning = useCallback(async () => {
    if (!crystalSearchTerm.trim()) { setCrystalMeaningText('Please enter a crystal name to search.'); setSearchedCrystalImage(null); return; }
    setCrystalMeaningText('Generating crystal information...'); setSearchedCrystalImage(null);
    setIsLoadingCrystalMeaning(true); setIsLoadingSearchedCrystalImage(true); setShowCrystalSearchModal(true);
    const textPrompt = `Provide a concise description of the metaphysical properties and uses of the crystal "${crystalSearchTerm.trim()}". Focus on its spiritual and energetic qualities relevant to divination or personal growth. If it's not a real crystal, state that it's not a recognized crystal and provide a general spiritual message.`;
    const imagePrompt = `A realistic, high-quality photograph of a raw, natural ${crystalSearchTerm.trim()} crystal, with soft, mystical lighting and a clean, dark background. Focus on the texture and natural form of the crystal.`;

    try {
      console.log(`[CrystalsViewer] Sending search request for "${crystalSearchTerm}" to APIs...`);
      const [textResult, imageResult] = await Promise.allSettled([
        fetch(textApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: textPrompt }) }).then(res => res.json()),
        fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1 } }) }).then(res => res.json())
      ]);
      console.log('[CrystalsViewer] Text API result:', textResult);
      console.log('[CrystalsViewer] Image API result:', imageResult);

      if (textResult.status === 'fulfilled' && textResult.value && textResult.value.interpretation) { setCrystalMeaningText(textResult.value.interpretation); } else { setCrystalMeaningText('Failed to generate meaning. Please try again.'); console.error('[CrystalsViewer] Text generation failed:', textResult); }
      setIsLoadingCrystalMeaning(false);

      if (imageResult.status === 'fulfilled' && imageResult.value && imageResult.value.predictions && imageResult.value.predictions.length > 0 && imageResult.value.predictions[0].bytesBase64Encoded) { setSearchedCrystalImage(`data:image/png;base64,${imageResult.value.predictions[0].bytesBase64Encoded}`); } else { console.error(`[CrystalsViewer] Failed to generate image for ${crystalSearchTerm}:`, imageResult); setSearchedCrystalImage('error'); }
      setIsLoadingSearchedCrystalImage(false);
    } catch (error) {
      console.error('[CrystalsViewer] Error in fetchCrystalMeaning:', error);
      setCrystalMeaningText('An unexpected error occurred during search. Please try again.');
      setIsLoadingCrystalMeaning(false);
      setIsLoadingSearchedCrystalImage(false);
    }
  }, [crystalSearchTerm, textApiUrl, imageGenApiUrl]);

  useEffect(() => {
    console.log('[CrystalsViewer] Component mounted/re-rendered. Triggering common crystal image fetches.');
    commonCrystalsData.forEach((crystal, index) => {
      setTimeout(() => { fetchCrystalImage(crystal.id, crystal.name); }, index * 1500);
    });
  }, [fetchCrystalImage, commonCrystalsData]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Crystals for Divination & Growth</h2>
      <p className="text-md text-purple-300 mb-8 text-center">Explore common crystals or search for any crystal to learn its metaphysical properties.</p>
      <div className="mb-10 pb-8 border-b border-purple-700">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Search Any Crystal</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="text" placeholder="e.g., Lapis Lazuli, Obsidian, Emerald..." className="flex-grow p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" value={crystalSearchTerm} onChange={(e) => setCrystalSearchTerm(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { fetchCrystalMeaning(); } }} disabled={isLoadingCrystalMeaning || isLoadingSearchedCrystalImage} />
          <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg" onClick={fetchCrystalMeaning} disabled={isLoadingCrystalMeaning || isLoadingSearchedCrystalImage}>
            {isLoadingCrystalMeaning || isLoadingSearchedCrystalImage ? 'Searching...' : 'Search Crystal'}
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Common Crystals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonCrystalsData.map(crystal => (
            <div key={crystal.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center flex flex-col items-center">
              <h4 className="text-xl font-semibold text-purple-100 mb-2">{crystal.name}</h4>
              {loadingCommonCrystalImages[crystal.id] ? (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">Loading...</div>) : commonCrystalImages[crystal.id] ? (<img src={commonCrystalImages[crystal.id]} alt={crystal.name} className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-purple-600 shadow-lg" onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/7B68EE/FFFFFF?text=Crystal`; console.error(`Failed to load AI image for ${crystal.name}.`); }} />) : (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">No Image</div>)}
              <p className="text-md text-purple-300 leading-relaxed">{crystal.description}</p>
            </div>
          ))}
        </div>
      </div>
      <SearchResultModal isOpen={showCrystalSearchModal} onClose={() => setShowCrystalSearchModal(false)} name={crystalSearchTerm} imageUrl={searchedCrystalImage} meaningText={crystalMeaningText} isLoadingImage={isLoadingSearchedCrystalImage} isLoadingMeaning={isLoadingCrystalMeaning} type="Crystal" />
    </div>
  );
};

interface DeitiesViewerProps {
  textApiUrl: string;
  imageGenApiUrl: string;
  commonDeitiesData: { id: string; name: string; description: string; }[];
}

const DeitiesViewer: React.FC<DeitiesViewerProps> = ({ textApiUrl, imageGenApiUrl, commonDeitiesData }) => {
  const [deitySearchTerm, setDeitySearchTerm] = useState('');
  const [deityMeaningText, setDeityMeaningText] = useState('Search for any deity to learn about them.');
  const [isLoadingDeityMeaning, setIsLoadingDeityMeaning] = useState(false);
  const [searchedDeityImage, setSearchedDeityImage] = useState<string | null>(null);
  const [isLoadingSearchedDeityImage, setIsLoadingSearchedDeityImage] = useState(false);
  const [showDeitySearchModal, setShowDeitySearchModal] = useState(false);
  const [commonDeityImages, setCommonDeityImages] = useState<Record<string, string>>({});
  const [loadingCommonDeityImages, setLoadingCommonDeityImages] = useState<Record<string, boolean>>({});

  const fetchDeityImage = useCallback(async (deityId: string, deityName: string) => {
    setLoadingCommonDeityImages(prev => ({ ...prev, [deityId]: true }));
    setCommonDeityImages(prev => ({ ...prev, [deityId]: '' }));
    const prompt = `A mystical and respectful portrayal of ${deityName}, a deity, in a style appropriate to their mythology. Focus on their key attributes or symbols. Avoid modern or anachronistic elements.`;
    try {
      console.log(`[DeitiesViewer] Sending image generation request for ${deityName} to Imagen API...`);
      const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
      const response = await fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log(`[DeitiesViewer] Imagen API response for ${deityName}:`, result);

      if (response.ok && result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setCommonDeityImages(prev => ({ ...prev, [deityId]: imageUrl }));
      } else {
        console.error(`[DeitiesViewer] Failed to generate image for ${deityName}:`, result);
        setCommonDeityImages(prev => ({ ...prev, [deityId]: 'error' }));
      }
    } catch (error) {
      console.error(`[DeitiesViewer] Error generating image for ${deityName}:`, error);
      setCommonDeityImages(prev => ({ ...prev, [deityId]: 'error' }));
    } finally {
      setLoadingCommonDeityImages(prev => ({ ...prev, [deityId]: false }));
    }
  }, [imageGenApiUrl]);

  const fetchDeityMeaning = useCallback(async () => {
    if (!deitySearchTerm.trim()) { setDeityMeaningText('Please enter a deity name to search.'); setSearchedDeityImage(null); return; }
    setDeityMeaningText('Generating deity information...'); setSearchedDeityImage(null);
    setIsLoadingDeityMeaning(true); setIsLoadingSearchedDeityImage(true); setShowDeitySearchModal(true);
    const textPrompt = `Provide a concise description of the mythology, domain, and significance of the deity "${deitySearchTerm.trim()}". Focus on their role in spiritual practices or their symbolic meaning. If it's not a recognized deity, state that and provide a general spiritual message.`;
    const imagePrompt = `A mystical and respectful portrayal of ${deitySearchTerm.trim()}, a deity, in a style appropriate to their mythology. Focus on their key attributes or symbols. Avoid modern or anachronistic elements.`;

    try {
      console.log(`[DeitiesViewer] Sending search request for "${deitySearchTerm}" to APIs...`);
      const [textResult, imageResult] = await Promise.allSettled([
        fetch(textApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: textPrompt }) }).then(res => res.json()),
        fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1 } }) }).then(res => res.json())
      ]);
      console.log('[DeitiesViewer] Text API result:', textResult);
      console.log('[DeitiesViewer] Image API result:', imageResult);

      if (textResult.status === 'fulfilled' && textResult.value && textResult.value.interpretation) { setDeityMeaningText(textResult.value.interpretation); } else { setDeityMeaningText('Failed to generate meaning. Please try again.'); console.error('[DeitiesViewer] Deity text generation failed:', textResult); }
      setIsLoadingDeityMeaning(false);

      if (imageResult.status === 'fulfilled' && imageResult.value && imageResult.value.predictions && imageResult.value.predictions.length > 0 && imageResult.value.predictions[0].bytesBase64Encoded) { setSearchedDeityImage(`data:image/png;base64,${imageResult.value.predictions[0].bytesBase64Encoded}`); } else { console.error(`[DeitiesViewer] Failed to generate image for ${deitySearchTerm}:`, imageResult); setSearchedDeityImage('error'); }
      setIsLoadingSearchedDeityImage(false);
    } catch (error) {
      console.error('[DeitiesViewer] Error in fetchDeityMeaning:', error);
      setDeityMeaningText('An unexpected error occurred during search. Please try again.');
      setIsLoadingDeityMeaning(false);
      setIsLoadingSearchedDeityImage(false);
    }
  }, [deitySearchTerm, textApiUrl, imageGenApiUrl]);

  useEffect(() => {
    console.log('[DeitiesViewer] Component mounted/re-rendered. Triggering common deity image fetches.');
    commonDeitiesData.forEach((deity, index) => {
      setTimeout(() => { fetchDeityImage(deity.id, deity.name); }, index * 1500);
    });
  }, [fetchDeityImage, commonDeitiesData]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Deities & Divine Beings</h2>
      <p className="text-md text-purple-300 mb-8 text-center">Explore common deities or search for any divine being to learn about their mythology and significance.</p>
      <div className="mb-10 pb-8 border-b border-purple-700">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Search Any Deity</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="text" placeholder="e.g., Thor, Hecate, Anubis..." className="flex-grow p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" value={deitySearchTerm} onChange={(e) => setDeitySearchTerm(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { fetchDeityMeaning(); } }} disabled={isLoadingDeityMeaning || isLoadingSearchedDeityImage} />
          <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg" onClick={fetchDeityMeaning} disabled={isLoadingDeityMeaning || isLoadingSearchedDeityImage}>
            {isLoadingDeityMeaning || isLoadingSearchedDeityImage ? 'Searching...' : 'Search Deity'}
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Common Deities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonDeitiesData.map(deity => (
            <div key={deity.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center flex flex-col items-center">
              <h4 className="text-xl font-semibold text-purple-100 mb-2">{deity.name}</h4>
              {loadingCommonDeityImages[deity.id] ? (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">Loading...</div>) : commonDeityImages[deity.id] ? (<img src={commonDeityImages[deity.id]} alt={deity.name} className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-purple-600 shadow-lg" onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/7B68EE/FFFFFF?text=Deity`; console.error(`Failed to load AI image for ${deity.name}.`); }} />) : (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">No Image</div>)}
              <p className="text-md text-purple-300 leading-relaxed">{deity.description}</p>
            </div>
          ))}
        </div>
      </div>
      <SearchResultModal isOpen={showDeitySearchModal} onClose={() => setShowDeitySearchModal(false)} name={deitySearchTerm} imageUrl={searchedDeityImage} meaningText={deityMeaningText} isLoadingImage={isLoadingSearchedDeityImage} isLoadingMeaning={isLoadingDeityMeaning} type="Deity" />
    </div>
  );
};

interface HerbMagicViewerProps {
  textApiUrl: string;
  imageGenApiUrl: string;
  commonHerbsData: { id: string; name: string; description: string; }[];
}

const HerbMagicViewer: React.FC<HerbMagicViewerProps> = ({ textApiUrl, imageGenApiUrl, commonHerbsData }) => {
  const [herbSearchTerm, setHerbSearchTerm] = useState('');
  const [herbMeaningText, setHerbMeaningText] = useState('Search for any magical herb to learn its properties.');
  const [isLoadingHerbMeaning, setIsLoadingHerbMeaning] = useState(false);
  const [searchedHerbImage, setSearchedHerbImage] = useState<string | null>(null);
  const [isLoadingSearchedHerbImage, setIsLoadingSearchedHerbImage] = useState(false);
  const [showHerbSearchModal, setShowHerbSearchModal] = useState(false);
  const [commonHerbImages, setCommonHerbImages] = useState<Record<string, string>>({});
  const [loadingCommonHerbImages, setLoadingCommonHerbImages] = useState<Record<string, boolean>>({});

  const fetchHerbImage = useCallback(async (herbId: string, herbName: string) => {
    setLoadingCommonHerbImages(prev => ({ ...prev, [herbId]: true }));
    setCommonHerbImages(prev => ({ ...prev, [herbId]: '' }));
    const prompt = `A realistic, high-quality photograph of the magical herb "${herbName}", with a focus on its natural form and a subtle, mystical background.`;
    try {
      console.log(`[HerbMagicViewer] Sending image generation request for ${herbName} to Imagen API...`);
      const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
      const response = await fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log(`[HerbMagicViewer] Imagen API response for ${herbName}:`, result);

      if (response.ok && result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setCommonHerbImages(prev => ({ ...prev, [herbId]: imageUrl }));
      } else {
        console.error(`[HerbMagicViewer] Failed to generate image for ${herbName}:`, result);
        setCommonHerbImages(prev => ({ ...prev, [herbId]: 'error' }));
      }
    } catch (error) {
      console.error(`[HerbMagicViewer] Error generating image for ${herbName}:`, error);
      setCommonHerbImages(prev => ({ ...prev, [herbId]: 'error' }));
    } finally {
      setLoadingCommonHerbImages(prev => ({ ...prev, [herbId]: false }));
    }
  }, [imageGenApiUrl]);

  const fetchHerbMeaning = useCallback(async () => {
    if (!herbSearchTerm.trim()) { setHerbMeaningText('Please enter a herb name to search.'); setSearchedHerbImage(null); return; }
    setHerbMeaningText('Generating herb information...'); setSearchedHerbImage(null);
    setIsLoadingHerbMeaning(true); setIsLoadingSearchedHerbImage(true); setShowHerbSearchModal(true);
    const textPrompt = `Provide a concise description of the magical and spiritual properties and uses of the herb "${herbSearchTerm.trim()}". Focus on its relevance to Paganism, Wicca, or folk magic. If it's not a recognized magical herb, state that and provide a general spiritual message about nature.`;
    const imagePrompt = `A realistic, high-quality photograph of the magical herb "${herbSearchTerm.trim()}", with a focus on its natural form and a subtle, mystical background.`;

    try {
      console.log(`[HerbMagicViewer] Sending search request for "${herbSearchTerm}" to APIs...`);
      const [textResult, imageResult] = await Promise.allSettled([
        fetch(textApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: textPrompt }) }).then(res => res.json()),
        fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1 } }) }).then(res => res.json())
      ]);
      console.log('[HerbMagicViewer] Text API result:', textResult);
      console.log('[HerbMagicViewer] Image API result:', imageResult);

      if (textResult.status === 'fulfilled' && textResult.value && textResult.value.interpretation) { setHerbMeaningText(textResult.value.interpretation); } else { setHerbMeaningText('Failed to generate meaning. Please try again.'); console.error('[HerbMagicViewer] Herb text generation failed:', textResult); }
      setIsLoadingHerbMeaning(false);

      if (imageResult.status === 'fulfilled' && imageResult.value && imageResult.value.predictions && imageResult.value.predictions.length > 0 && imageResult.value.predictions[0].bytesBase64Encoded) { setSearchedHerbImage(`data:image/png;base64,${imageResult.value.predictions[0].bytesBase64Encoded}`); } else { console.error(`[HerbMagicViewer] Failed to generate image for ${herbSearchTerm}:`, imageResult); setSearchedHerbImage('error'); }
      setIsLoadingSearchedHerbImage(false);
    } catch (error) {
      console.error('[HerbMagicViewer] Error in fetchHerbMeaning:', error);
      setHerbMeaningText('An unexpected error occurred during search. Please try again.');
      setIsLoadingHerbMeaning(false);
      setIsLoadingSearchedHerbImage(false);
    }
  }, [herbSearchTerm, textApiUrl, imageGenApiUrl]);

  useEffect(() => {
    console.log('[HerbMagicViewer] Component mounted/re-rendered. Triggering common herb image fetches.');
    commonHerbsData.forEach((herb, index) => {
      setTimeout(() => { fetchHerbImage(herb.id, herb.name); }, index * 1500);
    });
  }, [fetchHerbImage, commonHerbsData]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Herb Magic: Properties & Uses</h2>
      <p className="text-md text-purple-300 mb-8 text-center">Explore common magical herbs or search for any herb to learn its spiritual and magical properties.</p>
      <div className="mb-10 pb-8 border-b border-purple-700">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Search Any Herb</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="text" placeholder="e.g., Rosemary, Mugwort, Basil..." className="flex-grow p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" value={herbSearchTerm} onChange={(e) => setHerbSearchTerm(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { fetchHerbMeaning(); } }} disabled={isLoadingHerbMeaning || isLoadingSearchedHerbImage} />
          <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg" onClick={fetchHerbMeaning} disabled={isLoadingHerbMeaning || isLoadingSearchedHerbImage}>
            {isLoadingHerbMeaning || isLoadingSearchedHerbImage ? 'Searching...' : 'Search Herb'}
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Common Magical Herbs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonHerbsData.map(herb => (
            <div key={herb.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center flex flex-col items-center">
              <h4 className="text-xl font-semibold text-purple-100 mb-2">{herb.name}</h4>
              {loadingCommonHerbImages[herb.id] ? (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">Loading...</div>) : commonHerbImages[herb.id] ? (<img src={commonHerbImages[herb.id]} alt={herb.name} className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-purple-600 shadow-lg" onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/7B68EE/FFFFFF?text=Herb`; console.error(`Failed to load AI image for ${herb.name}.`); }} />) : (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">No Image</div>)}
              <p className="text-md text-purple-300 leading-relaxed">{herb.description}</p>
            </div>
          ))}
        </div>
      </div>
      <SearchResultModal isOpen={showHerbSearchModal} onClose={() => setShowHerbSearchModal(false)} name={herbSearchTerm} imageUrl={searchedHerbImage} meaningText={herbMeaningText} isLoadingImage={isLoadingSearchedHerbImage} isLoadingMeaning={isLoadingHerbMeaning} type="Herb" />
    </div>
  );
};

interface IncenseOilsViewerProps {
  textApiUrl: string;
  imageGenApiUrl: string;
  commonIncenseOilsData: { id: string; name: string; description: string; }[];
}

const IncenseOilsViewer: React.FC<IncenseOilsViewerProps> = ({ textApiUrl, imageGenApiUrl, commonIncenseOilsData }) => {
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemMeaningText, setItemMeaningText] = useState('Search for any incense or oil to learn its properties.');
  const [isLoadingItemMeaning, setIsLoadingItemMeaning] = useState(false);
  const [searchedItemImage, setSearchedItemImage] = useState<string | null>(null);
  const [isLoadingSearchedItemImage, setIsLoadingSearchedItemImage] = useState(false);
  const [showItemSearchModal, setShowItemSearchModal] = useState(false);
  const [commonItemImages, setCommonItemImages] = useState<Record<string, string>>({});
  const [loadingCommonItemImages, setLoadingCommonItemImages] = useState<Record<string, boolean>>({});

  const fetchItemImage = useCallback(async (itemId: string, itemName: string) => {
    setLoadingCommonItemImages(prev => ({ ...prev, [itemId]: true }));
    setCommonItemImages(prev => ({ ...prev, [itemId]: '' }));
    const prompt = `A realistic, high-quality photograph of "${itemName}", focusing on its form (e.g., incense stick, essential oil bottle, resin) with a subtle, mystical background.`;
    try {
      console.log(`[IncenseOilsViewer] Sending image generation request for ${itemName} to Imagen API...`);
      const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
      const response = await fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log(`[IncenseOilsViewer] Imagen API response for ${itemName}:`, result);

      if (response.ok && result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setCommonItemImages(prev => ({ ...prev, [itemId]: imageUrl }));
      } else {
        console.error(`[IncenseOilsViewer] Failed to generate image for ${itemName}:`, result);
        setCommonItemImages(prev => ({ ...prev, [itemId]: 'error' }));
      }
    } catch (error) {
      console.error(`[IncenseOilsViewer] Error generating image for ${itemName}:`, error);
      setCommonItemImages(prev => ({ ...prev, [itemId]: 'error' }));
    } finally {
      setLoadingCommonItemImages(prev => ({ ...prev, [itemId]: false }));
    }
  }, [imageGenApiUrl]);

  const fetchItemMeaning = useCallback(async () => {
    if (!itemSearchTerm.trim()) { setItemMeaningText('Please enter an incense or oil name to search.'); setSearchedItemImage(null); return; }
    setItemMeaningText('Generating information...'); setSearchedItemImage(null);
    setIsLoadingItemMeaning(true); setIsLoadingSearchedItemImage(true); setShowItemSearchModal(true);
    const textPrompt = `Provide a concise description of the shamanic, spiritual, and magical properties and uses of "${itemSearchTerm.trim()}" (incense or oil). Focus on its relevance to spiritual practices, rituals, or folk magic. If it's not a recognized item, state that and provide a general spiritual message.`;
    const imagePrompt = `A realistic, high-quality photograph of "${itemSearchTerm.trim()}", focusing on its form (e.g., incense stick, essential oil bottle, resin) with a subtle, mystical background.`;

    try {
      console.log(`[IncenseOilsViewer] Sending search request for "${itemSearchTerm}" to APIs...`);
      const [textResult, imageResult] = await Promise.allSettled([
        fetch(textApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: textPrompt }) }).then(res => res.json()),
        fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1 } }) }).then(res => res.json())
      ]);
      console.log('[IncenseOilsViewer] Text API result:', textResult);
      console.log('[IncenseOilsViewer] Image API result:', imageResult);

      if (textResult.status === 'fulfilled' && textResult.value && textResult.value.interpretation) { setItemMeaningText(textResult.value.interpretation); } else { setItemMeaningText('Failed to generate meaning. Please try again.'); console.error('[IncenseOilsViewer] Item text generation failed:', textResult); }
      setIsLoadingItemMeaning(false);

      if (imageResult.status === 'fulfilled' && imageResult.value && imageResult.value.predictions && imageResult.value.predictions.length > 0 && imageResult.value.predictions[0].bytesBase64Encoded) { setSearchedItemImage(`data:image/png;base64,${imageResult.value.predictions[0].bytesBase64Encoded}`); } else { console.error(`[IncenseOilsViewer] Failed to generate image for ${itemSearchTerm}:`, imageResult); setSearchedItemImage('error'); }
      setIsLoadingSearchedItemImage(false);
    } catch (error) {
      console.error('[IncenseOilsViewer] Error in fetchItemMeaning:', error);
      setItemMeaningText('An unexpected error occurred during search. Please try again.');
      setIsLoadingItemMeaning(false);
      setIsLoadingSearchedItemImage(false);
    }
  }, [itemSearchTerm, textApiUrl, imageGenApiUrl]);

  useEffect(() => {
    console.log('[IncenseOilsViewer] Component mounted/re-rendered. Triggering common incense/oil image fetches.');
    commonIncenseOilsData.forEach((item, index) => {
      setTimeout(() => { fetchItemImage(item.id, item.name); }, index * 1500);
    });
  }, [fetchItemImage, commonIncenseOilsData]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Incense & Oils: Shamanic Properties</h2>
      <p className="text-md text-purple-300 mb-8 text-center">Explore common incense and oils used in shamanic rituals and faith, or search for any item to learn its spiritual properties.</p>
      <div className="mb-10 pb-8 border-b border-purple-700">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Search Any Incense or Oil</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="text" placeholder="e.g., Frankincense, Sandalwood, Cedarwood Oil..." className="flex-grow p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" value={itemSearchTerm} onChange={(e) => setItemSearchTerm(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { fetchItemMeaning(); } }} disabled={isLoadingItemMeaning || isLoadingSearchedItemImage} />
          <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg" onClick={fetchItemMeaning} disabled={isLoadingItemMeaning || isLoadingSearchedItemImage}>
            {isLoadingItemMeaning || isLoadingSearchedItemImage ? 'Searching...' : 'Search Item'}
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Common Incense & Oils</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonIncenseOilsData.map(item => (
            <div key={item.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-center flex flex-col items-center">
              <h4 className="text-xl font-semibold text-purple-100 mb-2">{item.name}</h4>
              {loadingCommonItemImages[item.id] ? (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">Loading...</div>) : commonItemImages[item.id] ? (<img src={commonItemImages[item.id]} alt={item.name} className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-purple-600 shadow-lg" onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/7B68EE/FFFFFF?text=Item`; console.error(`Failed to load AI image for ${item.name}.`); }} />) : (<div className="w-24 h-24 flex items-center justify-center bg-purple-700 rounded-full mb-3 border-2 border-purple-600 shadow-lg text-sm text-purple-300">No Image</div>)}
              <p className="text-md text-purple-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <SearchResultModal isOpen={showItemSearchModal} onClose={() => setShowItemSearchModal(false)} name={itemSearchTerm} imageUrl={searchedItemImage} meaningText={itemMeaningText} isLoadingImage={isLoadingSearchedItemImage} isLoadingMeaning={isLoadingItemMeaning} type="Item" />
    </div>
  );
};

// ... (other viewer components like PalmistryTool, SpellCreatorTool, NumerologyTool, DreamInterpretationTool,
// ElementsViewer, CardinalPointsViewer, ColourTheoryViewer, AboutResourcesViewer, GuidedMeditationsViewer, AltarSetupViewer, ShintoViewer)
// These are defined in the previous turn's App.tsx and are now assumed to be in their own files.
// For the purpose of this response, I'm including them here as a single block for completeness,
// but in practice, they would be separate files.

interface PalmistryToolProps { geminiFlashApiUrl: string; }

const PalmistryTool: React.FC<PalmistryToolProps> = ({ geminiFlashApiUrl }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [palmReading, setPalmReading] = useState<string>('Upload or take a photo of your palm to get a reading.');
  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedImage(reader.result as string); setPalmReading('Click "Get Reading" to analyze your palm.'); };
      reader.readAsDataURL(file);
    } else { setSelectedImage(null); setPalmReading('Upload or take a photo of your palm to get a reading.'); }
  };

  const triggerFileInput = () => { if (fileInputRef.current) { fileInputRef.current.click(); } };

  const getPalmReading = useCallback(async () => {
    if (!selectedImage) { setPalmReading('Please upload an image of your palm first.'); return; }
    setIsLoadingReading(true); setPalmReading('Analyzing your palm... This may take a moment.');
    const [mimeType, base64Data] = selectedImage.split(';base64,');
    const actualMimeType = mimeType.split(':')[1];
    const prompt = `Analyze the provided image of a human palm. Identify and interpret the major lines (Heart Line, Head Line, Life Line), any prominent mounts (e.g., Mount of Venus, Mount of Jupiter), and the overall shape of the hand/fingers if discernible. Provide a concise palmistry reading based on these observations. If the image is not a palm or is unclear, state that it cannot be read. Frame the reading as insightful and for entertainment/inspiration.`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: actualMimeType, data: base64Data } }] }];
    const payload = { contents: chatHistory };

    try {
      console.log('Sending palm reading request to Gemini API...');
      const response = await fetch(geminiFlashApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log('Gemini API response for palm reading:', result);

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        setPalmReading(result.candidates[0].content.parts[0].text);
      } else {
        setPalmReading('Failed to get a reading. The AI could not process the image or an unknown error occurred. Please try a clearer image.');
        console.error('Gemini API response unexpected:', result);
      }
    } catch (error) {
      console.error('Error calling Gemini API for palm reading:', error);
      setPalmReading('Error during analysis. Please ensure your API key is correctly configured and try again.');
    } finally {
      setIsLoadingReading(false);
    }
  }, [selectedImage, geminiFlashApiUrl]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-purple-200">Palmistry: Your Hand, Your Story</h2>
      <p className="text-md text-purple-300 mb-6">Upload or take a clear photo of your palm to get a reading. For best results, ensure your palm is well-lit, flat, and fills most of the frame.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
        <button onClick={triggerFileInput} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg">Upload / Take Photo</button>
        <button onClick={() => { setSelectedImage(null); setPalmReading('Upload or take a photo of your palm to get a reading.'); }} className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg">Clear Image</button>
      </div>
      {selectedImage && (
        <div className="mb-8 p-4 bg-purple-900 rounded-lg border border-purple-700">
          <h3 className="text-xl font-semibold mb-4 text-purple-200">Your Palm Image:</h3>
          <img src={selectedImage} alt="User's Palm" className="max-w-full h-auto max-h-80 object-contain mx-auto rounded-lg shadow-md border border-purple-600" />
          <button onClick={getPalmReading} disabled={isLoadingReading} className="mt-6 px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg">
            {isLoadingReading ? 'Getting Reading...' : 'Get Reading'}
          </button>
        </div>
      )}
      <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap text-left">
        <h3 className="text-xl font-semibold mb-3 text-center">Your Palm Reading:</h3>
        <p className="text-lg">{palmReading}</p>
      </div>
      <p className="text-sm text-purple-400 mt-6"><strong className="text-purple-300">Disclaimer:</strong> This palm reading is generated by AI for entertainment and inspirational purposes only. It should not be taken as definitive advice regarding health, finances, or life decisions.</p>
    </div>
  );
};

interface SpellCreatorToolProps { geminiFlashApiUrl: string; }
interface GeneratedSpell { purpose: string; ingredients: string[]; ritual_steps: string[]; }

const SpellCreatorTool: React.FC<SpellCreatorToolProps> = ({ geminiFlashApiUrl }) => {
  const [spellCategory, setSpellCategory] = useState<string>('');
  const [generatedSpell, setGeneratedSpell] = useState<GeneratedSpell | null>(null);
  const [isLoadingSpell, setIsLoadingSpell] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerateSpell = useCallback(async () => {
    if (!spellCategory.trim()) { setErrorMessage('Please enter a category for the spell (e.g., protection, anxiety, purity).'); setGeneratedSpell(null); return; }
    setIsLoadingSpell(true); setErrorMessage(''); setGeneratedSpell(null);
    const prompt = `Generate a Pagan Wiccan spell for the purpose of "${spellCategory.trim()}". Provide the output as a JSON object with the following keys: 'purpose' (string), 'ingredients' (array of strings), 'ritual_steps' (array of strings). Ensure the spell is respectful of Wiccan traditions, focuses on natural elements and intentions, and is suitable for a beginner.`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", properties: { purpose: { type: "STRING" }, ingredients: { type: "ARRAY", items: { type: "STRING" } }, ritual_steps: { type: "ARRAY", items: { type: "STRING" } } }, required: ["purpose", "ingredients", "ritual_steps"]
        }
      }
    };

    try {
      console.log('Sending spell generation request to Gemini API...');
      const response = await fetch(geminiFlashApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log('Gemini API response for spell generation:', result);

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        try { setGeneratedSpell(JSON.parse(jsonText)); } catch (parseError) { setErrorMessage('Failed to parse the spell. The AI response was not in the expected format.'); console.error('JSON parse error:', parseError, 'Raw AI response:', jsonText); }
      } else {
        setErrorMessage('Failed to generate a spell. The AI could not provide a suitable response.');
        console.error('Gemini API response unexpected for spell generation:', result);
      }
    } catch (error) {
      setErrorMessage('Error during spell generation. Please ensure your API key is correctly configured and try again.');
      console.error('Error calling Gemini API for spell generation:', error);
    } finally {
      setIsLoadingSpell(false);
    }
  }, [spellCategory, geminiFlashApiUrl]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-purple-200">Spell Casting: Spell Creator</h2>
      <p className="text-md text-purple-300 mb-6">Enter a category for the spell you'd like to create (e.g., "protection," "anxiety relief," "purity"). The AI will generate a Pagan Wiccan spell for you.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <input type="text" placeholder="e.g., protection, love, healing, prosperity..." className="flex-grow p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" value={spellCategory} onChange={(e) => setSpellCategory(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { handleGenerateSpell(); } }} disabled={isLoadingSpell} />
        <button onClick={handleGenerateSpell} disabled={isLoadingSpell} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg">
          {isLoadingSpell ? 'Generating Spell...' : 'Generate Spell'}
        </button>
      </div>
      {errorMessage && (<div className="bg-red-800 p-4 rounded-lg shadow-inner text-red-100 mb-6"><p className="text-lg">{errorMessage}</p></div>)}
      {generatedSpell && (
        <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap text-left">
          <h3 className="text-xl font-semibold mb-3 text-center">Your Generated Spell:</h3>
          <h4 className="text-lg font-bold text-purple-300 mb-2">Purpose:</h4><p className="text-md mb-4">{generatedSpell.purpose}</p>
          <h4 className="text-lg font-bold text-purple-300 mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside mb-4">{generatedSpell.ingredients.map((item, index) => (<li key={index} className="text-md">{item}</li>))}</ul>
          <h4 className="text-lg font-bold text-purple-300 mb-2">Ritual Steps:</h4>
          <ol className="list-decimal list-inside">{generatedSpell.ritual_steps.map((step, index) => (<li key={index} className="text-md mb-1">{step}</li>))}</ol>
        </div>
      )}
      <p className="text-sm text-purple-400 mt-6"><strong className="text-purple-300">Disclaimer:</strong> AI-generated spells are for creative inspiration and entertainment purposes only. Always research and understand any spiritual practices before engaging with them.</p>
    </div>
  );
};

interface NumerologyToolProps { geminiFlashApiUrl: string; }

const NumerologyTool: React.FC<NumerologyToolProps> = ({ geminiFlashApiUrl }) => {
  const [inputValue, setInputValue] = useState('');
  const [numerologyResult, setNumerologyResult] = useState('Enter your name or date of birth (e.g., "John Doe" or "15/05/1990") to get a numerology reading.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getNumerologyReading = useCallback(async () => {
    if (!inputValue.trim()) { setErrorMessage('Please enter a name or date of birth.'); setNumerologyResult(''); return; }
    setIsLoading(true); setErrorMessage(''); setNumerologyResult('Calculating your numerology... This may take a moment.');
    const prompt = `Provide a numerology reading for the input "${inputValue.trim()}". If the input is a name, calculate the Destiny Number and describe its significance. If the input is a date of birth (in DD/MM/YYYY format), calculate the Life Path Number and describe its significance. If both are present, address both. Explain the core concept of the calculated number(s) and provide an insightful, positive, and general interpretation suitable for entertainment and self-reflection. If the input is not a valid name or date, state that it cannot be read and provide a general inspirational message about seeking inner wisdom.`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    try {
      console.log('Sending numerology request to Gemini API...');
      const response = await fetch(geminiFlashApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log('Gemini API response for numerology:', result);

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        setNumerologyResult(result.candidates[0].content.parts[0].text);
      } else {
        setNumerologyResult('Failed to get a reading. The AI could not process the input or an unknown error occurred. Please try again.');
        console.error('Gemini API response unexpected for numerology:', result);
      }
    } catch (error) {
      console.error('Error calling Gemini API for numerology:', error);
      setNumerologyResult('Error during calculation. Please ensure your API key is correctly configured and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, geminiFlashApiUrl]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-purple-200">Numerology: Unveiling Your Numbers</h2>
      <p className="text-md text-purple-300 mb-6">Enter your full name or your date of birth (DD/MM/YYYY) to receive an AI-generated numerology reading. Numerology is the study of the mystical relationship between numbers and events, revealing insights into personality, destiny, and life path.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <input type="text" placeholder="e.g., Jane Doe or 15/05/1990" className="flex-grow p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { getNumerologyReading(); } }} disabled={isLoading} />
        <button onClick={getNumerologyReading} disabled={isLoading} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg">
          {isLoading ? 'Calculating...' : 'Get Reading'}
        </button>
      </div>
      {errorMessage && (<div className="bg-red-800 p-4 rounded-lg shadow-inner text-red-100 mb-6"><p className="text-lg">{errorMessage}</p></div>)}
      <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap text-left">
        <h3 className="text-xl font-semibold mb-3 text-center">Your Numerology Reading:</h3>
        <p className="text-lg">{numerologyResult}</p>
      </div>
      <p className="text-sm text-purple-400 mt-6"><strong className="text-purple-300">Disclaimer:</strong> This numerology reading is generated by AI for entertainment and inspirational purposes only. It should not be taken as definitive advice regarding health, finances, or life decisions.</p>
    </div>
  );
};

interface DreamInterpretationToolProps { geminiFlashApiUrl: string; }

const DreamInterpretationTool: React.FC<DreamInterpretationToolProps> = ({ geminiFlashApiUrl }) => {
  const [dreamDescription, setDreamDescription] = useState('');
  const [interpretation, setInterpretation] = useState('Describe your dream to receive an AI-generated interpretation.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getDreamInterpretation = useCallback(async () => {
    if (!dreamDescription.trim()) { setErrorMessage('Please enter a description of your dream.'); setInterpretation(''); return; }
    setIsLoading(true); setErrorMessage(''); setInterpretation('Interpreting your dream... This may take a moment.');
    const prompt = `Interpret the following dream description from a symbolic, psychological, and spiritual perspective. Focus on common dream archetypes, emotions, and potential subconscious messages. Provide an insightful and compassionate interpretation, emphasizing self-reflection and personal growth. If the description is too vague or nonsensical, state that a clear interpretation cannot be given and offer a general message about the nature of dreams. Dream Description: "${dreamDescription.trim()}"`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    try {
      console.log('Sending dream interpretation request to Gemini API...');
      const response = await fetch(geminiFlashApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log('Gemini API response for dream interpretation:', result);

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        setInterpretation(result.candidates[0].content.parts[0].text);
      } else {
        setInterpretation('Failed to get an interpretation. The AI could not process the dream or an unknown error occurred. Please try again with a more detailed description.');
        console.error('Gemini API response unexpected for dream interpretation:', result);
      }
    } catch (error) {
      console.error('Error calling Gemini API for dream interpretation:', error);
      setInterpretation('Error during interpretation. Please ensure your API key is correctly configured and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dreamDescription, geminiFlashApiUrl]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-purple-200">Dream Interpretation: Unravel Your Subconscious</h2>
      <p className="text-md text-purple-300 mb-6">Enter a detailed description of your dream, and our AI will provide a symbolic, psychological, and spiritual interpretation. Dreams are often messages from our subconscious, offering insights into our waking lives.</p>
      <div className="flex flex-col gap-4 mb-8">
        <textarea placeholder="Describe your dream in detail: what happened, how did you feel, what symbols or characters appeared?" className="w-full p-3 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg h-40 resize-y" value={dreamDescription} onChange={(e) => setDreamDescription(e.target.value)} disabled={isLoading}></textarea>
        <button onClick={getDreamInterpretation} disabled={isLoading} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg">
          {isLoading ? 'Interpreting...' : 'Get Interpretation'}
        </button>
      </div>
      {errorMessage && (<div className="bg-red-800 p-4 rounded-lg shadow-inner text-red-100 mb-6"><p className="text-lg">{errorMessage}</p></div>)}
      <div className="bg-purple-800 p-6 rounded-lg shadow-inner text-purple-100 whitespace-pre-wrap text-left">
        <h3 className="text-xl font-semibold mb-3 text-center">Your Dream Interpretation:</h3>
        <p className="text-lg">{interpretation}</p>
      </div>
      <p className="text-sm text-purple-400 mt-6"><strong className="text-purple-300">Disclaimer:</strong> This dream interpretation is generated by AI for entertainment and inspirational purposes only. It should not be taken as definitive psychological or spiritual advice. Always consult with a professional for personal guidance.</p>
    </div>
  );
};

interface ElementsViewerProps { selectedMenuItem: string; elementsData: { id: string; name: string; associations: string[]; }[]; }
const ElementsViewer: React.FC<ElementsViewerProps> = ({ selectedMenuItem, elementsData }) => {
  const elementData = elementsData.find(el => el.id === selectedMenuItem);
  if (!elementData) return null;
  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-purple-200">{elementData.name} Element</h2>
      <div className="text-left text-purple-100 space-y-4">
        {elementData.associations.map((line, index) => (<p key={index} className="text-lg" dangerouslySetInnerHTML={{ __html: line.replace(/\n/g, '<br />') }} />))}
      </div>
    </div>
  );
};

interface CardinalPointsViewerProps { selectedMenuItem: string; cardinalPointsData: { id: string; name: string; element: string; direction: string; dwarf: string; associations: string[]; }[]; }
const CardinalPointsViewer: React.FC<CardinalPointsViewerProps> = ({ selectedMenuItem, cardinalPointsData }) => {
  const cardinalPointData = cardinalPointsData.find(point => point.id === selectedMenuItem);
  if (!cardinalPointData) return null;
  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-purple-200">{cardinalPointData.name} (Norse Mythology)</h2>
      <div className="text-left text-purple-100 space-y-4">
        <p className="text-lg"><strong className="text-purple-300">Associated Element:</strong> {cardinalPointData.element}</p>
        <p className="text-lg"><strong className="text-purple-300">Direction of:</strong> {cardinalPointData.direction}</p>
        <p className="text-lg"><strong className="text-purple-300">Dwarf Guardian:</strong> {cardinalPointData.dwarf}</p>
        <h3 className="text-xl font-bold text-purple-300 mt-4 mb-2">Key Associations:</h3>
        <ul className="list-disc list-inside space-y-1">
          {cardinalPointData.associations.map((assoc, index) => (<li key={index} className="text-lg">{assoc}</li>))}
        </ul>
      </div>
    </div>
  );
};

interface ColourTheoryViewerProps { colourTheoryData: { id: string; name: string; emotional: string; chakra: string; magical: string; pagan: string; }[]; }
const ColourTheoryViewer: React.FC<ColourTheoryViewerProps> = ({ colourTheoryData }) => {
  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Colour Theory in Paganism</h2>
      <p className="text-md text-purple-300 mb-8 text-center">Colours hold significant energetic and symbolic meanings in Paganism, witchcraft, and spiritual practices. They are used in spellwork, rituals, altar decoration, and meditation to invoke specific energies and intentions.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colourTheoryData.map(color => (
          <div key={color.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700 text-left">
            <h3 className="text-xl font-semibold text-purple-100 mb-2 flex items-center">
              <span className={`inline-block w-6 h-6 rounded-full mr-3 border border-purple-600`} style={{ backgroundColor: color.id }}></span>
              {color.name}
            </h3>
            <div className="text-md text-purple-300 space-y-2">
              <p><strong className="text-purple-200">Emotional Associations:</strong> {color.emotional}</p>
              <p><strong className="text-purple-200">Chakra Association:</strong> {color.chakra}</p>
              <p><strong className="text-purple-200">Magical Uses:</strong> {color.magical}</p>
              <p><strong className="text-purple-200">Pagan Significance:</strong> {color.pagan}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AboutResourcesViewerProps { currentItemName: string; }
const AboutResourcesViewer: React.FC<AboutResourcesViewerProps> = ({ currentItemName }) => (
  <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
    <h2 className="text-3xl font-semibold mb-6 text-purple-200">About Chicksands Divination & Resources</h2>
    <p className="text-lg text-purple-300 mb-6 text-left">Chicksands Divination is designed to be a modern companion for those exploring the rich and diverse world of Pagan spiritual practices and divination. Our aim is to provide an accessible and insightful platform for learning, reflection, and personal growth.</p>
    <div className="text-left text-purple-100 space-y-4">
      <h3 className="text-xl font-bold text-purple-300 mt-4 mb-2">Our Mission:</h3>
      <p className="text-lg">To empower individuals on their spiritual journeys by offering tools and knowledge rooted in ancient wisdom, interpreted through modern technology. We believe in fostering a deeper connection to self, nature, and the divine.</p>
      <h3 className="text-xl font-bold text-purple-300 mt-4 mb-2">How it Works:</h3>
      <p className="text-lg">This application utilizes advanced AI models to provide interpretations and information across various divination methods and spiritual topics. While the AI offers insightful perspectives, remember that true wisdom comes from within and through personal study and practice.</p>
      <h3 className="text-xl font-bold text-purple-300 mt-4 mb-2">Recommended Resources (Coming Soon):</h3>
      <ul className="list-disc list-inside space-y-2">
        <li className="text-lg">Books on Tarot, Runes, and Paganism</li>
        <li className="text-lg">Online communities and forums for spiritual discussion</li>
        <li className="text-lg">Ethical suppliers for crystals, herbs, and ritual tools</li>
        <li className="text-lg">Guided meditation and mindfulness apps</li>
      </ul>
      <p className="text-lg text-purple-300 mt-4">We are continuously expanding our knowledge base and features. Thank you for being a part of our journey!</p>
    </div>
  </div>
);

interface GuidedMeditationsViewerProps { currentItemName: string; }
const GuidedMeditationsViewer: React.FC<GuidedMeditationsViewerProps> = ({ currentItemName }) => (
  <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
    <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName}</h2>
    <p className="text-lg text-purple-300">This section will feature a variety of guided meditations to help you connect with your inner self, find peace, and enhance your spiritual practice.</p>
    <p className="text-md text-purple-400 mt-4">Stay tuned for guided meditations focused on grounding, chakra balancing, lunar cycles, elemental connection, and more!</p>
  </div>
);

interface AltarSetupViewerProps { currentItemName: string; }
const AltarSetupViewer: React.FC<AltarSetupViewerProps> = ({ currentItemName }) => (
  <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
    <h2 className="text-3xl font-semibold mb-4 text-purple-200">{currentItemName}</h2>
    <p className="text-lg text-purple-300">This section will provide guidance on creating and consecrating your personal altar. An altar is a sacred space for spiritual work, meditation, and connecting with the divine.</p>
    <p className="text-md text-purple-400 mt-4">Learn about:</p>
    <ul className="list-disc list-inside text-left mx-auto max-w-md text-purple-300">
      <li>Choosing your altar space</li>
      <li>Essential altar tools and their symbolism</li>
      <li>Representing the elements and deities</li>
      <li>Rituals for cleansing and consecrating your altar</li>
      <li>Seasonal altar decorations</li>
    </ul>
  </div>
);

interface ShintoViewerProps { currentItemName: string; }
const ShintoViewer: React.FC<ShintoViewerProps> = ({ currentItemName }) => (
  <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
    <h2 className="text-3xl font-semibold mb-6 text-purple-200">Shinto: The Way of the Kami</h2>
    <p className="text-lg text-purple-300 mb-6 text-left">Shinto, meaning "the way of the Kami," is the indigenous spiritual practice of Japan. It is deeply rooted in the reverence for nature and the belief that divine spirits, or Kami, inhabit all things – from mountains and rivers to trees, rocks, and even abstract concepts like growth and creativity.</p>
    <div className="text-left text-purple-100 space-y-4">
      <h3 className="text-xl font-bold text-purple-300 mt-4 mb-2">Key Aspects of Shinto:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><strong className="text-purple-200">Kami (神):</strong> The central figures of Shinto. Kami are not singular, omnipotent gods in the Western sense, but rather divine essences, spirits, or phenomena. They can be ancestral spirits, deities of natural forces (e.g., Amaterasu Omikami, the Sun Goddess), or spirits of places and objects. Reverence for Kami is expressed through rituals, prayers, and offerings.</li>
        <li><strong className="text-purple-200">Sacred Spaces (Jinja - 神社):</strong> Shinto shrines are places where Kami are enshrined and worshipped. They are typically located in natural settings, often marked by a *torii* gate (鳥居) at the entrance, signifying the transition from the mundane to the sacred. Purity and cleanliness are paramount when entering a shrine.</li>
        <li><strong className="text-purple-200">Rituals and Practices:</strong> Shinto rituals emphasize purification (*harai*), offerings (*shinsen*), prayers (*norito*), and symbolic dances (*kagura*). The goal is often to establish harmony with the Kami, express gratitude, and seek blessings. Festivals (*matsuri*) are vibrant community events dedicated to specific Kami.</li>
        <li><strong className="text-purple-200">Daily Life & Nature:</strong> Shinto is not a strict dogma but a way of life that encourages living in harmony with nature and respecting its inherent divinity. Many daily customs and traditions in Japan have Shinto roots, emphasizing cleanliness, respect, and gratitude for blessings. The changing seasons and natural phenomena are deeply celebrated.</li>
        <li><strong className="text-purple-200">Purity (清浄 - Seijō):</strong> Purity is a core concept. This refers not just to physical cleanliness but also spiritual purity, free from defilement (*kegare*). Rituals like *misogi* (washing with water) and *harai* (exorcism of impurities) are performed to achieve this state.</li>
      </ul>
      <p className="text-lg text-purple-300 mt-4">Shinto offers a profound connection to the natural world and a path to spiritual well-being through reverence and harmony.</p>
    </div>
  </div>
);


// --- Main App Component ---
function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('celticCross');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tarot Spread States
  const [currentSpreadType, setCurrentSpreadType] = useState<string>('celticCross');
  const [currentSpreadPositions, setCurrentSpreadPositions] = useState<SpreadPosition[]>(celticCrossPositions);
  const [currentSpreadSelections, setCurrentSpreadSelections] = useState<SpreadSelectionItem[]>(
    celticCrossPositions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
  );
  const [readMessage, setReadMessage] = useState('');
  const [llmInterpretation, setLlmInterpretation] = useState('');
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);

  // Card Meaning States
  const [selectedCardForMeaning, setSelectedCardForMeaning] = useState('');
  const [cardMeaningText, setCardMeaningText] = useState('Select a card to see its meaning.');
  const [isLoadingCardMeaning, setIsLoadingCardMeaning] = useState(false);

  // Holiday States
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayData | null>(null);
  const [showHolidayDetailsModal, setShowHolidayDetailsModal] = useState(false);
  const [holidayImage, setHolidayImage] = useState<string | null>(null);
  const [isLoadingHolidayImage, setIsLoadingHolidayImage] = useState(false);


  // API URLs
  const textApiUrl = 'https://cpif4zh0bf.execute-api.eu-north-1.amazonaws.com/prod';
  const API_KEY_FOR_GEMINI = typeof __initial_api_key !== 'undefined' ? __initial_api_key : (typeof process !== 'undefined' && process.env.REACT_APP_GEMINI_API_KEY ? process.env.REACT_APP_GEMINI_API_KEY : "");
  const imageGenApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY_FOR_GEMINI}`;
  const geminiFlashApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY_FOR_GEMINI}`;

  // Log API keys to ensure they are being picked up
  useEffect(() => {
    console.log("API_KEY_FOR_GEMINI:", API_KEY_FOR_GEMINI ? "Loaded" : "Not Loaded");
    console.log("imageGenApiUrl:", imageGenApiUrl);
    console.log("geminiFlashApiUrl:", geminiFlashApiUrl);
  }, [API_KEY_FOR_GEMINI, imageGenApiUrl, geminiFlashApiUrl]);


  // Callbacks for Tarot Spreads
  const handleCardSelect = useCallback((positionId: number, cardId: string) => {
    setCurrentSpreadSelections(prevSelections =>
      prevSelections.map(selection =>
        selection.id === positionId ? { ...selection, cardId: cardId } : selection
      )
    );
    setReadMessage('');
    setLlmInterpretation('');
  }, []);

  const handleOrientationSelect = useCallback((positionId: number, orientation: 'upright' | 'reversed') => {
    setCurrentSpreadSelections(prevSelections =>
      prevSelections.map(selection =>
        selection.id === positionId ? { ...selection, orientation: orientation } : selection
      )
    );
    setReadMessage('');
    setLlmInterpretation('');
  }, []);

  const generateRead = useCallback(async () => {
    const spreadDef = spreadDefinitions[currentSpreadType];
    if (!spreadDef) return;

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
      console.log('Sending Tarot interpretation request to AWS Lambda proxy...');
      const response = await fetch(textApiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt })
      });
      const result = await response.json();
      console.log('AWS Lambda proxy response for Tarot:', result);

      if (response.ok && result && result.interpretation) {
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
  }, [currentSpreadType, currentSpreadSelections, allTarotCards, textApiUrl]);

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

  // Callback for Card Meanings
  const fetchCardMeaning = useCallback(async (cardName: string) => {
    if (!cardName) { setCardMeaningText('Select a card to see its meaning.'); return; }
    setCardMeaningText('Generating meaning...'); setIsLoadingCardMeaning(true);
    const prompt = `Provide concise keyword descriptions for the Tarot card "${cardName}". Structure your answer clearly with "**Upright:**" followed by comma-separated keywords, then a blank line (double newline), and then "**Reversed:**" followed by comma-separated keywords.`;

    try {
      console.log('Sending card meaning request to AWS Lambda proxy...');
      const response = await fetch(textApiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt })
      });
      const result = await response.json();
      console.log('AWS Lambda proxy response for card meaning:', result);

      if (response.ok && result && result.interpretation) {
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
  }, [textApiUrl]);


  // Callbacks for Holidays
  const fetchHolidayImage = useCallback(async (holidayName: string) => {
    setIsLoadingHolidayImage(true); setHolidayImage(null);
    const prompt = `A vibrant and symbolic illustration representing the pagan holiday of ${holidayName}, incorporating its key symbols and colors. For example, for Beltane, show a Maypole with ribbons and flowers. For Yule, show a Yule log and evergreens. For Ostara, show eggs and spring flowers.`;
    try {
      console.log('Sending holiday image generation request to Imagen API...');
      const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
      const response = await fetch(imageGenApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      console.log('Imagen API response for holiday image:', result);

      if (response.ok && result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        setHolidayImage(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
      } else {
        console.error(`Failed to generate image for ${holidayName}:`, result);
        setHolidayImage('error');
      }
    } catch (error) {
      console.error(`Error generating image for ${holidayName}:`, error);
      setHolidayImage('error');
    } finally {
      setIsLoadingHolidayImage(false);
    }
  }, [imageGenApiUrl]);

  const handleOpenHolidayDetails = useCallback((holiday: HolidayData) => {
    setSelectedHoliday(holiday);
    setShowHolidayDetailsModal(true);
    fetchHolidayImage(holiday.name);
  }, [fetchHolidayImage]);

  const handleCloseHolidayDetails = useCallback(() => {
    setShowHolidayDetailsModal(false);
    setSelectedHoliday(null);
    setHolidayImage(null);
  }, []);


  // Menu Item Selection Logic
  const handleMenuItemSelect = useCallback((itemId: string) => {
    const isHolidaySubItem = holidaysData.some(holiday => holiday.id === itemId);
    if (isHolidaySubItem) {
      setSelectedMenuItem('holidays');
      const holidayToOpen = holidaysData.find(h => h.id === itemId);
      if (holidayToOpen) { handleOpenHolidayDetails(holidayToOpen); }
    } else {
      setSelectedMenuItem(itemId);
      setShowHolidayDetailsModal(false);
      setSelectedHoliday(null);
      setHolidayImage(null);
    }
  }, [handleOpenHolidayDetails]);

  // Effect to reset states and trigger initial loads for some sections
  useEffect(() => {
    console.log(`Selected menu item changed to: ${selectedMenuItem}`);
    // Reset states for all dynamic content sections when menu item changes
    setCurrentSpreadType('');
    setCurrentSpreadPositions([]);
    setCurrentSpreadSelections([]);
    setReadMessage('');
    setLlmInterpretation('');
    setSelectedCardForMeaning('');
    setCardMeaningText('Select a card to see its meaning.');
    setIsLoadingCardMeaning(false);
    setShowHolidayDetailsModal(false);
    setSelectedHoliday(null);
    setHolidayImage(null);

    // Now handle specific logic for the selected menu item
    if (spreadDefinitions[selectedMenuItem]) {
      const initialSpreadDef = spreadDefinitions[selectedMenuItem];
      setCurrentSpreadType(selectedMenuItem);
      setCurrentSpreadPositions(initialSpreadDef.positions);
      setCurrentSpreadSelections(
        initialSpreadDef.positions.map(pos => ({ ...pos, cardId: '', orientation: 'upright' }))
      );
    }
  }, [selectedMenuItem]);


  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Helper function to find the display name for any menu item, including nested ones
  const getMenuItemDisplayName = (id: string) => {
    for (const item of menuItems) {
      if (item.id === id) return item.name;
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.id === id) return subItem.name;
          if (subItem.subItems) {
            for (const subSubItem of subItem.subItems) {
              if (subSubItem.id === id) return subSubItem.name;
            }
          }
        }
      }
    }
    return '';
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'celticCross':
      case 'starSpread':
      case 'threeCard':
      case 'heartAndHead':
      case 'pastPresentFuture':
      case 'treeOfLife':
      case 'horseshoe':
      case 'yearAhead':
      case 'monthAhead':
      case 'weekAhead':
      case 'deckInterview':
      case 'deckBonding':
        return (
          <TarotSpreadViewer
            currentSpreadType={currentSpreadType}
            currentSpreadPositions={currentSpreadPositions}
            currentSpreadSelections={currentSpreadSelections}
            handleCardSelect={handleCardSelect}
            handleOrientationSelect={handleOrientationSelect}
            generateRead={generateRead}
            clearCurrentSpreadSelection={clearCurrentSpreadSelection}
            readMessage={readMessage}
            llmInterpretation={llmInterpretation}
            isLoadingInterpretation={isLoadingInterpretation}
            allTarotCards={allTarotCards}
          />
        );
      case 'cardMeanings':
        return (
          <CardMeaningViewer
            selectedCardForMeaning={selectedCardForMeaning}
            setSelectedCardForMeaning={setSelectedCardForMeaning}
            cardMeaningText={cardMeaningText}
            isLoadingCardMeaning={isLoadingCardMeaning}
            allTarotCards={allTarotCards}
            fetchCardMeaning={fetchCardMeaning}
          />
        );
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
        return <ZodiacSignViewer selectedMenuItem={selectedMenuItem} zodiacSignsData={zodiacSignsData} />;
      case 'witchesRunes':
      case 'elderFuthark':
      case 'youngerFuthark':
        return (
          <RunesViewer
            selectedMenuItem={selectedMenuItem}
            witchesRunesData={witchesRunesData}
            elderFutharkRunesData={elderFutharkRunesData}
            youngerFutharkRunesData={youngerFutharkRunesData}
          />
        );
      case 'crystals':
        return (
          <CrystalsViewer
            textApiUrl={textApiUrl}
            imageGenApiUrl={imageGenApiUrl}
            commonCrystalsData={commonCrystalsData}
          />
        );
      case 'deities':
        return (
          <DeitiesViewer
            textApiUrl={textApiUrl}
            imageGenApiUrl={imageGenApiUrl}
            commonDeitiesData={commonDeitiesData}
          />
        );
      case 'herbMagic':
        return (
          <HerbMagicViewer
            textApiUrl={textApiUrl}
            imageGenApiUrl={imageGenApiUrl}
            commonHerbsData={commonHerbsData}
          />
        );
      case 'incenseOils':
        return (
          <IncenseOilsViewer
            textApiUrl={textApiUrl}
            imageGenApiUrl={imageGenApiUrl}
            commonIncenseOilsData={commonIncenseOilsData}
          />
        );
      case 'holidays':
        return (
          <HolidaysViewer
            holidaysData={holidaysData}
            handleOpenHolidayDetails={handleOpenHolidayDetails}
            showHolidayDetailsModal={showHolidayDetailsModal}
            handleCloseHolidayDetails={handleCloseHolidayDetails}
            selectedHoliday={selectedHoliday}
            holidayImage={holidayImage}
            isLoadingHolidayImage={isLoadingHolidayImage}
          />
        );
      case 'palmistry':
        return <PalmistryTool geminiFlashApiUrl={geminiFlashApiUrl} />;
      case 'spellCreator':
        return <SpellCreatorTool geminiFlashApiUrl={geminiFlashApiUrl} />;
      case 'shinto':
        return <ShintoViewer currentItemName={getMenuItemDisplayName(selectedMenuItem)} />;
      case 'numerology':
        return <NumerologyTool geminiFlashApiUrl={geminiFlashApiUrl} />;
      case 'aboutResources':
        return <AboutResourcesViewer currentItemName={getMenuItemDisplayName(selectedMenuItem)} />;
      case 'dreamInterpretation':
        return <DreamInterpretationTool geminiFlashApiUrl={geminiFlashApiUrl} />;
      case 'guidedMeditations':
        return <GuidedMeditationsViewer currentItemName={getMenuItemDisplayName(selectedMenuItem)} />;
      case 'altarSetup':
        return <AltarSetupViewer currentItemName={getMenuItemDisplayName(selectedMenuItem)} />;
      case 'earth':
      case 'wind':
      case 'fire':
      case 'water':
      case 'soul':
        return <ElementsViewer selectedMenuItem={selectedMenuItem} elementsData={elementsData} />;
      case 'north':
      case 'east':
      case 'south':
      case 'west':
        return <CardinalPointsViewer selectedMenuItem={selectedMenuItem} cardinalPointsData={cardinalPointsData} />;
      case 'colourTheory':
        return <ColourTheoryViewer colourTheoryData={colourTheoryData} />;
      case 'journal': // NEW: Journaling Tool
        return <JournalingTool />;
      default:
        return (
          <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">Welcome to Chicksands Divination</h2>
            <p className="text-lg text-purple-300">Select an option from the menu to get started.</p>
          </div>
        );
    }
  };


  return (
    <div className="min-h-screen bg-black text-purple-300 font-sans flex flex-col sm:flex-row">
      {showHomeScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4 z-50">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-center text-white animate-pulse">Chicksands Divination</h1>
          <div className="bg-purple-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-700 max-w-2xl text-center max-h-[70vh] overflow-y-auto flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">Embrace the Wisdom of Pagan Divination</h2>
            <p className="text-base text-purple-300 mb-6 leading-relaxed">
              Welcome to Chicksands Divination, your digital sanctuary for exploring the ancient art of divination. Rooted in the rich traditions of Paganism, this app offers a unique journey into self-discovery and spiritual insight.
              <br /><br />
              Pagan divination is a practice of seeking knowledge or insight into the future, the unknown, or the hidden through supernatural means. It often involves interpreting signs, symbols, and patterns found in nature, rituals, or tools like tarot cards. It's a way to connect with the subtle energies of the universe, gain clarity on life's challenges, and align with your true path.
              <br /><br />
              Here, you can delve into various tarot spreads, explore the significance of the elements, and understand the influence of the zodiac, all guided by intuitive AI interpretations.
            </p>
          </div>
          <button onClick={() => setShowHomeScreen(false)} className="mt-6 px-10 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-xl">
            Enter the Sanctuary
          </button>
        </div>
      )}

      {!showHomeScreen && (
        <>
          <button onClick={toggleMenu} className="fixed top-4 left-4 z-40 p-3 bg-purple-700 text-white rounded-lg shadow-lg sm:hidden focus:outline-none focus:ring-2 focus:ring-purple-500">
            ☰ Menu
          </button>
          <div className={`flex-1 p-4 sm:p-8 flex flex-col items-center transition-all duration-300 ease-in-out ${isMenuOpen ? 'sm:ml-64' : 'sm:ml-0'} pt-20 sm:pt-8`}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white">Chicksands Divination</h1>
            <Menu menuItems={menuItems} selectedItem={selectedMenuItem} onSelect={handleMenuItemSelect} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
