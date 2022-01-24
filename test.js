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

const problems = [
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
];

const run = async () => {
  const results = [];
  for (const word of problems) {
    const result = await play((tryWord) => new Promise((resolve) => resolve(interactClue(word, tryWord))), true);
    console.log(`Word: ${word.toUpperCase()}`);
    console.log(result);
    results.push(result);
  }

  return results;
};

run();
