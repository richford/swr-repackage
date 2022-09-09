/* eslint-disable no-plusplus */
import { config, realpseudo2arrow, readCSV } from "./config";

// Word corpus imports
import dataPracticeURL from "./wordlist/ldt-items-practice.csv";
import dataValidatedURL from "./wordlist/item_bank_new.csv";
import dataNewURL from "./wordlist/ldt-new-items.csv";

// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // use "destructuring assignment" syntax
    // eslint-disable-next-line no-param-reassign
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const csvPromises = {
  practice: readCSV(dataPracticeURL),
  validated: readCSV(dataValidatedURL),
  new: readCSV(dataNewURL),
};

const csvAssets = await loadAll(csvPromises);

const transformCSV = (csvInput, isPractice) => csvInput.reduce((accum, row) => {
  const newRow = {
    stimulus: row.word,
    correct_response: realpseudo2arrow(row.realpseudo),
    difficulty: isPractice ? row.difficulty : row.b,
    corpus_src: isPractice ? row.block : row.corpusId,
    realpseudo: row.realpseudo,
  };
  accum.push(newRow);
  return accum;
}, []);

const csvTransformed = {
  practice: transformCSV(csvAssets.practice, true),
  validated: transformCSV(csvAssets.validated, false),
  new: csvAssets.new,
};

function transformNewwords(csv_new) {
  const csv_new_transform = csv_new.reduce((accum, row) => {
    const newRow = {
      realword: row.realword,
      pseudoword: row.pseudoword,
    };
    accum.push(newRow);
    return accum;
  }, []);

  const newArray = shuffle(csv_new_transform);

  const splitArray = [];
  for (let i = 0; i < newArray.length; i++) {
    const realRow = {
      stimulus: newArray[i].realword,
      correct_response: "ArrowRight",
      difficulty: null, // default level
      corpus_src: "corpusNew",
      realpseudo: "real",
    };
    splitArray.push(realRow);
    const pseudoRow = {
      stimulus: newArray[i].pseudoword,
      correct_response: "ArrowLeft",
      difficulty: null, // default level
      corpus_src: "corpusNew",
      realpseudo: "pseudo",
    };
    splitArray.push(pseudoRow);
  }
  return shuffle(splitArray);
}

const corpusA = {
  name: "corpusA",
  corpus_pseudo: csvTransformed.validated.filter(row => (row.corpus_src === "A" && row.realpseudo === "pseudo")),
  corpus_real: csvTransformed.validated.filter(row => (row.corpus_src === "A" && row.realpseudo === "real"))
};

const corpusB = {
  name: "corpusB",
  corpus_pseudo: csvTransformed.validated.filter((row) => (row.corpus_src === "B" && row.realpseudo === "pseudo")),
  corpus_real: csvTransformed.validated.filter(row => (row.corpus_src === "B" && row.realpseudo === "real"))
};

const corpusC = {
  name: "corpusC",
  corpus_pseudo: csvTransformed.validated.filter((row) => (row.corpus_src === "C" && row.realpseudo === "pseudo")),
  corpus_real: csvTransformed.validated.filter(row => (row.corpus_src === "C" && row.realpseudo === "real"))
};

export const corpusAll = {
  name: "corpusAll",
  corpus_pseudo: csvTransformed.validated.filter(row => row.realpseudo === "pseudo"),
  corpus_real: csvTransformed.validated.filter(row => row.realpseudo === "real")
}

const fixedBlockList = [corpusA, corpusB, corpusC]; // always starts from Block A
const randomBlockList = shuffle(fixedBlockList); // every block is randomized

const getStimulusLists = () => {
  if (config.userMode === "beginner") {
    return fixedBlockList.slice(0, config.stimulusRuleList.length);
  }
  return randomBlockList.slice(0, config.stimulusRuleList.length);
};

export const stimulusLists = getStimulusLists();
export const blockNew = shuffle(transformNewwords(csvTransformed.new));
export const blockPractice = csvTransformed.practice.slice(0, config.totalTrialsPractice);
