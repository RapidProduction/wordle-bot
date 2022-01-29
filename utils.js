const engWords = require('an-array-of-english-words');

const WORD_LENGTH = 5;
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const WORDLE_WORDS = engWords.filter((w) => w.length === WORD_LENGTH);

const countWordChar = (words) => {
  const charCount = new Object();
  words.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (charCount[char] == null) {
        charCount[char] = 1;
      } else {
        charCount[char]++;
      }
    }
  });
  return charCount;
};

const readInput = () => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Give me some clues? ', (result) => {
      rl.close();
      resolve(result);
    });
  });
};

const translateClue = (clue) => {
  const splittedClue = clue.split(',');

  const notContainedChar = splittedClue.filter((c) => c.length === 1);

  const containedCharNotOnIndex = new Object();
  const containAtIndexChar = new Object();
  splittedClue.forEach((c, i) => {
    if (c.length === 3 && c[0] === '[') containAtIndexChar[c[1]] = i;
    if (c.length === 3 && c[0] === '(') containedCharNotOnIndex[c[1]] = i;
  });

  return [containAtIndexChar, containedCharNotOnIndex, notContainedChar];
};

const isDistinct = (word) => {
  const charSet = new Set();

  for (let i = 0; i < word.length; i++) {
    if (charSet.has(word[i])) return false;
    charSet.add(word[i]);
  }
  return true;
};

const distinctWords = (words) => {
  const distinctCharWords = [];
  words.forEach((word) => {
    if (isDistinct(word)) distinctCharWords.push(word);
  });

  return distinctCharWords;
};

const countCharFrequency = (words) => {
  const charCount = countWordChar(words);
  const count = [];

  for (const [_, value] of Object.entries(charCount)) count.push(value);
  return Object.entries(charCount).sort((a, b) => b[1] - a[1]);
};

const isCorrect = (clue) => clue.split(',').filter((c) => c.length === 3 && c[0] === '[').length === WORD_LENGTH;

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

module.exports = {
  WORDLE_WORDS,
  VOWELS,
  countCharFrequency,
  countWordChar,
  distinctWords,
  isCorrect,
  isDistinct,
  readInput,
  shuffle,
  translateClue,
};
