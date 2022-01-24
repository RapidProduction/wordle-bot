const WORD_LENGTH = 5;

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

module.exports = {
  countCharFrequency,
  countWordChar,
  distinctWords,
  isCorrect,
  isDistinct,
  readInput,
  translateClue,
};
