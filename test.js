const { WORDLE_WORDS, shuffle } = require('./utils');
const { play } = require('./algor');

const interactClue = (answeredWord, tryWord) => {
  let clue = '';

  for (let i = 0; i < answeredWord.length; i++) {
    if (i > 0) clue += ',';

    if (answeredWord[i] === tryWord[i]) {
      clue += `[${tryWord[i]}]`;
    } else {
      let hasChar = false;
      for (let j = 0; j < tryWord.length; j++) {
        if (answeredWord[j] === tryWord[i]) {
          hasChar = true;
          break;
        }
      }

      if (hasChar) {
        clue += `(${tryWord[i]})`;
      } else {
        clue += tryWord[i];
      }
    }
  }

  return clue;
};

// test cases
const problems_static = [
  'paper',
  'beard',
  'knoll',
  'royst',
  'breed',
  'forum',
  'climb',
  'scene',
  'theft',
  'shock',
  'swell',
  'tribe',
  'mercy',
  'cover',
  'glory',
  'dance',
  'decay',
  'grain',
  'round',
  'field',
  'trace',
  'piece',
  'rumor',
  'stand',
  'guide',
  'shave',
  'hobby',
  'worry',
  'space',
  'acute',
  'stall',
  'fruit',
  'ankle',
  'score',
  'merit',
  'salad',
  'breed',
  'shell',
  'spine',
  'steam',
  'apple',
  'budge',
  'honor',
  'video',
  'unity',
  'equip',
  'total',
  'adopt',
  'ivory',
  'giant',
  'lunch',
  'donor',
  'light',
  'chain',
  'disco',
  'shark',
  'stamp',
  'equal',
  'album',
  'enter',
  'amuse',
  'perky',
];
const problems_static2 = [
  'razes',
  'sulfa',
  'theme',
  'rammy',
  'banjo',
  'usual',
  'soral',
  'gazes',
  'saint',
  'weest',
  'mahua',
  'gazon',
  'herry',
  'jimmy',
  'gamba',
  'junky',
  'wites',
  'sined',
  'melas',
  'tondi',
  'jotty',
  'bowls',
  'heath',
  'zonae',
  'avgas',
  'unjam',
  'flubs',
  'smash',
  'micro',
  'prems',
  'terfs',
  'wring',
  'vires',
  'jammy',
  'hodja',
  'heros',
  'whish',
  'viced',
  'tozes',
  'bosks',
  'bancs',
  'sabin',
  'adhan',
  'flack',
  'ohmic',
  'convo',
  'vagus',
  'sager',
  'swarm',
  'fards',
  'roams',
  'melba',
  'nival',
  'sooms',
  'selah',
  'mirks',
  'caxon',
  'tawed',
  'fuzzy',
  'huzzy',
  'hends',
  'mummy',
  'funny',
  'stuns',
  'leves',
  'sizar',
  'moots',
  'mates',
  'chill',
  'whips',
  'bunns',
  'swoon',
  'alder',
  'swath',
  'choon',
  'tenon',
  'mumps',
  'rakes',
  'shred',
  'faddy',
  'wolly',
  'mense',
  'tawas',
  'feuds',
  'monte',
  'covey',
  'enurn',
  'tewed',
  'soyas',
  'wafts',
  'shads',
  'wited',
  'moted',
  'kenaf',
  'dewar',
  'cronk',
  'zobus',
  'views',
  'anent',
  'onned',
];
const problems_static_500 = WORDLE_WORDS.slice(5000, 5501);
const problems_shuffle = shuffle(WORDLE_WORDS.slice()).slice(0, 5000);

const run = async () => {
  const results = [];
  for (const word of problems_shuffle) {
    const result = await play((tryWord) => new Promise((resolve) => resolve(interactClue(word, tryWord))), true);
    console.log(`Word: ${word.toUpperCase()}`);
    console.log(result);
    results.push({ ...result, word });
  }

  return results;
};

run().then((results) => {
  const count = results.length;
  const pass = results.filter((r) => r.status === 'pass').length;

  console.log(`Fail: ${count - pass} / ${count}`);
  console.log('Failed words');
  console.log(results.filter((r) => r.status !== 'pass').map((r) => r.word));
});
