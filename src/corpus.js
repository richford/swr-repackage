/* eslint-disable no-plusplus */
import {
  config, realpseudo2arrow, readCSV, shuffle,
} from "./config";

// Word corpus imports
import dataPracticeURL from "./wordlist/ldt-items-practice.csv";
import dataValidatedURL from "./wordlist/item_bank_new.csv";
import dataNewURL from "./wordlist/ldt-new-items-v2.csv";

// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

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
  new: shuffle(transformCSV(csvAssets.new, false)), // csvAssets.new,
};

/*
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
      difficulty: 0, // default level
      corpus_src: "corpusNew",
      realpseudo: "real",
    };
    splitArray.push(realRow);
    const pseudoRow = {
      stimulus: newArray[i].pseudoword,
      correct_response: "ArrowLeft",
      difficulty: 0, // default level
      corpus_src: "corpusNew",
      realpseudo: "pseudo",
    };
    splitArray.push(pseudoRow);
  }
  return shuffle(splitArray);
}

 */

export const corpusAll = {
  name: "corpusAll",
  corpus_pseudo: csvTransformed.validated.filter((row) => row.realpseudo === "pseudo"),
  corpus_real: csvTransformed.validated.filter((row) => row.realpseudo === "real"),
};

export const blockPractice = csvTransformed.practice.slice(0, config.totalTrialsPractice);
// const blockNew = shuffle(transformNewwords(csvTransformed.new));
export const corpusNew = {
  name: "corpusNew",
  corpus_pseudo: csvTransformed.new.filter((row) => row.realpseudo === "pseudo"),
  corpus_real: csvTransformed.new.filter((row) => row.realpseudo === "real"),
};
