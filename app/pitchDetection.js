import { getCookie } from "./utils";

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
  // Implements the ACF2+ algorithm
  var SIZE = buf.length;
  var rms = 0;

  for (var i = 0; i < SIZE; i++) {
    var val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) // not enough signal
    return -1;

  var r1 = 0, r2 = SIZE - 1, thres = 0.2;
  for (var i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (var i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  var c = new Array(SIZE).fill(0);
  for (var i = 0; i < SIZE; i++)
    for (var j = 0; j < SIZE - i; j++)
      c[i] = c[i] + buf[j] * buf[j + i];

  var d = 0; while (c[d] > c[d + 1]) d++;
  var maxval = -1, maxpos = -1;
  for (var i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  var T0 = maxpos;

  var x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export function updatePitch(analyser, audioContext, detectorElem, pitchElem, noteElem, detuneElem, detuneAmount, start, currentNote, notes, tempo, level) {
  analyser.getFloatTimeDomainData(buf);
  const ac = autoCorrelate(buf, audioContext.sampleRate);
  // console.log(ac);
  // console.log(start.time, currentNote, notes, tempo, level);
  let note;
  if (ac === -1) {
    // detectorElem.className = "vague";
    // pitchElem.innerText = "--";
    noteElem.innerText = "-";
    // detuneElem.className = "";
    // detuneAmount.innerText = "--";
  } else {
    // detectorElem.className = "confident";
    const pitch = ac;
    // pitchElem.innerText = Math.round(pitch);
    note = noteFromPitch(pitch);
    noteElem.innerHTML = noteStrings[note % 12];
    // const detune = centsOffFromPitch(pitch, note);
    // detuneElem.className = detune === 0 ? "" : (detune < 0 ? "flat" : "sharp");
    // detuneAmount.innerHTML = Math.abs(detune);
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  rafID = window.requestAnimationFrame(() => updatePitch(analyser, audioContext, detectorElem, pitchElem, noteElem, detuneElem, detuneAmount, start, currentNote, notes, tempo, level));

  //hacky stuff
  
  currentNote += levelMap(notes, tempo, currentNote, start);
  if (currentNote > notes.length - 1) {
    if (level == getCookie("level")) {
      document.cookie = "level=" + (parseInt(level) + 1) + ";";
      console.log(document.cookie);
    }
    window.location.href = "/";
  }

  function levelMap(notes, tempo, currentNote, start) {
    //bool notePlayed = playNote("C", 50);
    if (playNote(notes[currentNote], tempo[currentNote], start)) {
      console.log(currentNote);
      return 1;
    }
    else return 0;
  }
  
  function playNote(noteTaken, time, start) {
    if (noteStrings[note % 12] == noteTaken && start.time == 0) {
      start.time = Date.now();
    }
    if (noteStrings[note % 12] == noteTaken && Date.now() - start.time >= time) {
      start.time = 0;
      // console.log("ALOOO");
      return true;
    }
    else if (noteStrings[note % 12] != noteTaken && start.time > 0) {
      start.time = 0;
      return false;
    }
  }
  
}