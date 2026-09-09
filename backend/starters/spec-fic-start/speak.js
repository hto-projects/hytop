const VOICE_NUM = 5;

const synth = window.speechSynthesis;

function speakStory(storyText) {
  const voices = synth.getVoices();
  if (!voices.length) {
    alert("voices not found");
    return;
  }

  let voiceNum = voices.length > VOICE_NUM + 1 ? VOICE_NUM : 0;
  const utterance = new SpeechSynthesisUtterance(storyText);
  utterance.voice = voices[voiceNum];
  synth.speak(utterance);
}

function readStory() {
  const contentEl = document.querySelector("#story-container");
  const contentTxt = contentEl.innerText;
  speakStory(contentTxt);
}
