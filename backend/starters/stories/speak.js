const synth = window.speechSynthesis;

function speakStory(storyText) {
  const voices = synth.getVoices();
  const utterance = new SpeechSynthesisUtterance(storyText);
  utterance.voice = voices[6];
  synth.speak(utterance);
}
