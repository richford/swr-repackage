import { config } from "../config/config";
import { imgContent, audioContent, isTouchScreen } from "../config/preload";
import AudioMultiResponsePlugin from "@jspsych-contrib/plugin-audio-multi-response";

/* define instructions trial */

const introTrialsContent = [
  { stimulus: () => isTouchScreen ? audioContent.intro1T : audioContent.intro1,
    prompt: () => {
      return (`
        <h1 id='lexicality-intro-header'>Welcome to the world of Lexicality!</h1>
        <div class="row">
          <div class="column_1">
            <img class="characterleft" src="${imgContent.wizardMagic}" alt="animation of a wizard waving a magic wand">
          </div>
          <div class="column_3">
            <p class="middle"> You are a wizard searching for the gate that will return you to your home on Earth. To reach the gate, you must journey over lands ruled by magical guardians.</p>
            <p class="middle"> In order for the guardians to let you pass through the land, you will have to tell the difference between made-up words and real words.&nbsp;</p>
          </div>
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue </div>' : ''}`
      )
    } ,
  },
  { stimulus: () => isTouchScreen ? audioContent.intro2T : audioContent.intro2,
    prompt: () => { 
      return (`
        <h1>A real or made-up word will flash very quickly at the center of the screen.</h1>
        <div class="row">
          <div class="column_2_upper" style="background-color:#f2f2f2;">
            <p style = "text-align:left;">The made-up words might look like English words, but they do not mean anything in English. For example, laip, bove, or cigbert are made-up words. <span class="orange"><b>If you see a made-up word, press the LEFT ARROW.</b></span></p>
          </div>
          <div class="column_2_upper" style="background-color:#f2f2f2;">
            <p style = "text-align:left;"> The real words will be ones you recognize. They are real English words like is, and, basket, or lion. <span class="blue"><b> If you see a real word, press the RIGHT ARROW.</b></span></p>
          </div>
        </div>
        <div class="row">
          <div class="column_2_lower" style="background-color:#f2f2f2;">
            <img width="100%" src=${imgContent.arrowLeftP2} alt="Magic Word, Press the Left Arrow Key" align="right">
          </div>
          <div class="column_2_lower" style="background-color:#f2f2f2;">
            <img width="100%" src=${imgContent.arrowRightP2} alt="Real Word, Press the Right Arrow key">
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}`
      )
    },
  },
  { stimulus: () => isTouchScreen ? audioContent.intro3T : audioContent.intro3,
    prompt: () => {
      return (
        ` <h1>Let us review which arrow we press for made-up words and real words.</h1>
          <div>
            <img class = 'cues' src="${imgContent.keyP3}" alt="arrow keys">
            <p class = "center"> Try to be as accurate as possible.</p>
            <p>Some words will be hard, and that&#39s okay. If you&#39re not sure, just give your best guess!</p>
          </div>
          ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to practice</div>' : ''}`
      )
    },
  },
]

const introTrialsMapped = introTrialsContent.map((trial, i) => {
  return (
    {
      type: AudioMultiResponsePlugin,
      stimulus: trial.stimulus,
      keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
      button_choices: () => isTouchScreen ? ["HERE"] : [],
      button_html: `<button class='button'>Press <span class='yellow'>%choice%</span> to ${isTouchScreen && i === 2 ? 'practice' : 'continue'}</button>`,
      response_allowed_while_playing: config.testingOnly,
      prompt: trial.prompt,
      prompt_above_buttons: true,
    }
  )
})


export const introduction_trials = {
  timeline: [...introTrialsMapped],
}

export const post_practice_intro = {
  type: AudioMultiResponsePlugin,
  stimulus: () => isTouchScreen ? audioContent.coinIntroT : audioContent.coinIntro,
  keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
  button_choices: () => isTouchScreen ? ["HERE"] : [],
  button_html: "<button class='button'>Press <span class='yellow'>%choice%</span> to begin</button>",
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> You will earn gold coins along the way.</p>
        <img class = "coin" src="${imgContent.goldCoin}" alt="gold">
      </div>
    ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to begin</div>' : ''}`,
  prompt_above_buttons: true
};

