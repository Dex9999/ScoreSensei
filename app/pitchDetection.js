let rafID = null;
let buflen = 2048;
let buf = new Float32Array(buflen);
const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteFromPitch(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

export function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function centsOffFromPitch(frequency, note) {
  return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

export function autoCorrelate(buf, sampleRate) {
  // Auto-correlation logic
}

export function updatePitch(analyser, audioContext, detectorElem, pitchElem, noteElem, detuneElem, detuneAmount, waveCanvas) {
  analyser.getFloatTimeDomainData(buf);
  const ac = autoCorrelate(buf, audioContext.sampleRate);

  if (ac === -1) {
    detectorElem.className = "vague";
    pitchElem.innerText = "--";
    noteElem.innerText = "-";
    detuneElem.className = "";
    detuneAmount.innerText = "--";
  } else {
    detectorElem.className = "confident";
    const pitch = ac;
    pitchElem.innerText = Math.round(pitch);
    const note = noteFromPitch(pitch);
    noteElem.innerHTML = noteStrings[note % 12];
    const detune = centsOffFromPitch(pitch, note);
    detuneElem.className = detune === 0 ? "" : (detune < 0 ? "flat" : "sharp");
    detuneAmount.innerHTML = Math.abs(detune);
  }

  rafID = window.requestAnimationFrame(() => updatePitch(analyser, audioContext, detectorElem, pitchElem, noteElem, detuneElem, detuneAmount, waveCanvas));
}
