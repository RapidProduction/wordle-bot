const { WORDLE_WORDS, VOWELS, countCharFrequency, distinctWords, isCorrect, translateClue } = require('./utils');

// find propability
const getMostDistinctVowelsWords = (words, vowels) => {
  const vowelWords = new Object();

  words.forEach((word) => {
    let vowelCount = 0;
    let clonedVowels = vowels.slice();

    for (let i = 0; i < word.length; i++) {
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
  const sortedCharCount = countCharFrequency(words);
  const top5Chars = sortedCharCount.slice(0, 5).map((c) => c[0]);
  const distinctCharWords = distinctWords(words);

  // rate char contain in word
  let maxRate = 0;
  const ratedWord = new Object();

  distinctCharWords.forEach((word) => {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
      if (top5Chars.includes(word[i])) count++;
    }
    ratedWord[word] = count;

    if (maxRate < count) maxRate = count;
  });

  const maxRatedWord = Object.entries(ratedWord).filter((wordEntry) => wordEntry[1] >= maxRate);

  return maxRatedWord.length > 0 ? maxRatedWord.map((w) => w[0]) : [];
};

// filtering
const filterWordByContainChar = (words, containedCharNotOnIndex) => {
  const filteredWords = [];

  words.forEach((word) => {
    let containedChars = Object.keys(containedCharNotOnIndex);

    for (let i = 0; i < word.length; i++) {
      if (containedChars.includes(word[i]) && containedCharNotOnIndex[word[i]] !== i) {
        containedChars = containedChars.filter((c) => c !== word[i]);
      }
    }

    if (containedChars.length === 0) filteredWords.push(word);
  });

  return filteredWords;
};

const filterWordByNotContainChar = (words, containedChar) => {
  const filteredWords = [];

  words.forEach((word) => {
    let isContained = false;
    for (let i = 0; i < word.length; i++) {
      if (containedChar.includes(word[i])) {
        isContained = true;
        break;
      }
    }

    if (!isContained) filteredWords.push(word);
  });

  return filteredWords;
};

const filterWordByContainFixedChar = (words, charAtIndexes) => {
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

const filterCorrectWords = (words, containAtIndexChar, containedCharNotOnIndex, notContainedChar) => {
  let filteredWords = words;

  if (Object.keys(containAtIndexChar).length > 0) {
    filteredWords = filterWordByContainFixedChar(filteredWords, containAtIndexChar);
  }

  if (notContainedChar.length > 0) {
    filteredWords = filterWordByNotContainChar(filteredWords, notContainedChar);
  }

  if (Object.keys(containedCharNotOnIndex).length > 0) {
    filteredWords = filterWordByContainChar(filteredWords, containedCharNotOnIndex);
  }

  return filteredWords;
};

const filterExploredWords = (words, containAtIndexChar, containedCharNotOnIndex, notContainedChar) => {
  let triedOutChar = [];

  if (Object.keys(containAtIndexChar).length > 0) {
    triedOutChar = triedOutChar.concat(Object.keys(containAtIndexChar));
  }

  if (Object.keys(containedCharNotOnIndex).length > 0) {
    triedOutChar = triedOutChar.concat(Object.keys(containedCharNotOnIndex));
  }

  if (notContainedChar.length > 0) {
    triedOutChar = triedOutChar.concat(notContainedChar);
  }

  let filteredWords = filterWordByNotContainChar(words, triedOutChar);
  filteredWords = distinctWords(filteredWords);

  return filteredWords;
};

const determine = (state, clue) => {
  const round = state.round;
  let possibleCorrectWords = state.possibleWords.slice();
  let containAtIndexChar = { ...state.containAtIndexChar };
  let containedCharNotOnIndex = { ...state.containedCharNotOnIndex };
  let notContainedChar = state.notContainedChar.slice();

  let tryWord = null;

  if (round === 1) {
    tryWord = getMostDistinctVowelsWords(WORDLE_WORDS, VOWELS);
  } else {
    let [a, b, c] = translateClue(clue);
    containAtIndexChar = { ...containAtIndexChar, ...a };
    containedCharNotOnIndex = { ...containedCharNotOnIndex, ...b };
    notContainedChar = notContainedChar.concat(c);

    possibleCorrectWords = filterCorrectWords(
      possibleCorrectWords,
      containAtIndexChar,
      containedCharNotOnIndex,
      notContainedChar,
    );

    let possibleExploredWords = filterExploredWords(
      WORDLE_WORDS,
      containAtIndexChar,
      containedCharNotOnIndex,
      notContainedChar,
    );

    if (possibleCorrectWords.length > 4 && possibleExploredWords.length > 1) {
      // explore words if possible
      tryWord = possibleExploredWords[0];
    } else {
      // try possible corrects words
      const distinctWords = getMostDistinctFrequentCharWords(possibleCorrectWords);

      if (round < 5 && distinctWords && distinctWords.length > 0) {
        tryWord = distinctWords[0];
      } else {
        tryWord = possibleCorrectWords[0];
      }
    }
  }

  return {
    tryWord,
    state: {
      round: round + 1,
      possibleWords: possibleCorrectWords,
      containAtIndexChar,
      containedCharNotOnIndex,
      notContainedChar,
    },
  };
};

// main
const play = async (getInput, verbose) => {
  // initial state
  let clue = null;
  let state = {
    round: 1,
    possibleWords: WORDLE_WORDS.slice(),
    containAtIndexChar: new Object(),
    containedChar: [],
    notContainedChar: [],
  };

  let round = 1;
  while (round <= 6) {
    const result = determine(state, clue);
    const tryWord = result.tryWord;
    state = result.state;

    if (tryWord == null) {
      if (verbose) console.log(`Fail to determine word :(`);

      return { status: 'fail', try: round, cause: 0 };
    } else if (clue != null && isCorrect(clue)) {
      if (verbose) {
        console.log(`BRAVO! it's ${tryWord.toUpperCase()}`);
        console.log(`Number of tries: ${round}`);
      }

      return { status: 'pass', try: round };
    } else {
      if (verbose) console.log(`Try "${tryWord.toUpperCase()}"`);

      clue = await getInput(tryWord);

      if (verbose) console.log(clue);
    }

    round++;
  }

  if (verbose) console.log('Exceed number of trying :(');
  return { status: 'fail', try: round, cause: 1 };
};

module.exports = { play };
