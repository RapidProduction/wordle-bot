const engWords = require('an-array-of-english-words');

const WORD_LENGTH = 5;
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const WORDLE_WORDS = engWords.filter((w) => w.length === WORD_LENGTH);

// utils
const countWordChar = (words) => {
  const charCount = new Object();
  words.forEach((word) => {
    for (let i = 0; i < WORD_LENGTH; i++) {
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
  const containedChar = splittedClue.filter((c) => c.length === 3).map((c) => c[1]);
  const containAtIndexChar = new Object();
  splittedClue.forEach((c, i) => {
    if (c.length === 3 && c[0] === '[') containAtIndexChar[c[1]] = i;
  });

  return [containAtIndexChar, containedChar, notContainedChar];
};

const isCorrect = (clue) => clue.split(',').filter((c) => c.length === 3 && c[0] === '[').length === WORD_LENGTH;

// find possibility

const getMostDistinctVowelsWords = (words, vowels) => {
  const vowelWords = new Object();

  words.forEach((word) => {
    let vowelCount = 0;
    let clonedVowels = vowels.slice();

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (clonedVowels.includes(word[i])) {
        clonedVowels = clonedVowels.filter((cv) => cv !== word[i]);
        vowelCount++;
      }
    }

    vowelWords[word] = vowelCount;
  });

  const sortedVowelWords = Object.entries(vowelWords).sort((a, b) => b[1] - a[1]);

  return sortedVowelWords[0][0];
};

const getMostDistinctFrequentCharWords = (words) => {
  const charCount = countWordChar(words);
  const count = [];

  for (const [key, value] of Object.entries(charCount)) {
    count.push(value);
  }

  const sortedCharCount = Object.entries(charCount).sort((a, b) => b[1] - a[1]);
  const top5Chars = sortedCharCount.slice(0, 5).map((c) => c[0]);
  return top5Chars;
};

// filtering
const filterWordByContainAllChar = (words, containedChar) => {
  const filterdWords = [];

  words.forEach((word) => {
    let clonedContainedChar = containedChar.slice();

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (containedChar.includes(word[i])) {
        clonedContainedChar = clonedContainedChar.filter((c) => c !== word[i]);
      }
    }

    if (clonedContainedChar.length === 0) filterdWords.push(word);
  });

  return filterdWords;
};

const filterWordByNotContainChar = (words, containedChar) => {
  const filteredWords = [];

  words.forEach((word) => {
    let isContained = false;
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (containedChar.includes(word[i])) {
        isContained = true;
        break;
      }
    }

    if (!isContained) filteredWords.push(word);
  });

  return filteredWords;
};

const filterWordByFixedChar = (words, charAtIndexes) => {
  const filteredWords = [];

  words.forEach((word) => {
    let isContained = true;
    for (const [key, index] of Object.entries(charAtIndexes)) {
      if (word[index] !== key) {
        isContained = false;
        break;
      }
    }

    if (isContained) filteredWords.push(word);
  });

  return filteredWords;
};

const filterWords = (words, containAtIndexChar, containedChar, notContainedChar) => {
  let filteredWords = words;

  if (Object.keys(containAtIndexChar).length > 0) {
    filteredWords = filterWordByFixedChar(filteredWords, containAtIndexChar);
  }

  if (notContainedChar.length > 0) {
    filteredWords = filterWordByNotContainChar(filteredWords, notContainedChar);
  }

  if (containedChar.length > 0) {
    filteredWords = filterWordByContainAllChar(filteredWords, containedChar);
  }

  return filteredWords;
};

const play = async () => {
  let possibleWords = WORDLE_WORDS.slice();
  let containAtIndexChar = new Object();
  let containedChar = [];
  let notContainedChar = [];

  let tryWord = getMostDistinctVowelsWords(WORDLE_WORDS, VOWELS);

  let round = 1;
  while (round <= 6) {
    console.log(`Try "${tryWord.toUpperCase()}" - Round ${round}`);
    const clue = await readInput();

    if (isCorrect(clue)) {
      console.log(`BRAVO! it's ${tryWord.toUpperCase()}`);
      console.log(`Number of tries: ${round}`);
      break;
    } else {
      let [a, b, c] = translateClue(clue);

      containAtIndexChar = { ...containAtIndexChar, ...a };
      containedChar = containedChar.concat(b);
      notContainedChar = notContainedChar.concat(c);
      possibleWords = filterWords(possibleWords, containAtIndexChar, containedChar, notContainedChar);
      tryWord = possibleWords[0];
    }

    round++;
  }
};

play();
