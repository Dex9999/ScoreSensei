



window.AudioContext = window.AudioContext || window.webkitAudioContext;

var startTime = 0;
var timeDif = 0;
var notePlayed = false;
var currentNote = 0;
let levl = 1;

const notesOne = ["G", "G", "G", "G"];
const notesTwo = ["G", "A", "G", "B"];
const notesThree = ["G", "G#", "A", "A#"];
const tempo = [250, 250, 250, 250];

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var detectorElem,
    canvasElem,
    waveCanvas,
    pitchElem,
    noteElem,
    detuneElem,
    detuneAmount;

function go() {
    audioContext = new AudioContext();
    MAX_SIZE = Math.max(4, Math.floor(audioContext.sampleRate / 5000));	// corresponds to a 5kHz signal

    detectorElem = document.getElementById("detector");
    canvasElem = document.getElementById("output");
    pitchElem = document.getElementById("pitch");
    noteElem = document.getElementById("note");
    detuneElem = document.getElementById("detune");
    detuneAmount = document.getElementById("detune_amt");


}
function startPitchDetect() {
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    navigator.mediaDevices.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }).then((stream) => {
            // Create an AudioNode from the stream.
            mediaStreamSource = audioContext.createMediaStreamSource(stream);

            // Connect it to the destination.
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            mediaStreamSource.connect(analyser);
            updatePitch();
        }).catch((err) => {
            // always check for errors at the end.
            console.error(`${err.name}: ${err.message}`);
            alert('Stream generation failed.');
        });
}

var rafID = null;
var tracks = null;
var buflen = 2048;
var buf = new Float32Array(buflen);

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch(frequency) {
    var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
    return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

function autoCorrelate(buf, sampleRate) {
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
    a = (x1 + x3 - 2 * x2) / 2;
    b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
}

function updatePitch(time) {
    var cycles = new Array;
    analyser.getFloatTimeDomainData(buf);
    var ac = autoCorrelate(buf, audioContext.sampleRate);
    // TODO: Paint confidence meter on canvasElem here.

    if (DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
        waveCanvas.clearRect(0, 0, 512, 256);
        waveCanvas.strokeStyle = "red";
        waveCanvas.beginPath();
        waveCanvas.moveTo(0, 0);
        waveCanvas.lineTo(0, 256);
        waveCanvas.moveTo(128, 0);
        waveCanvas.lineTo(128, 256);
        waveCanvas.moveTo(256, 0);
        waveCanvas.lineTo(256, 256);
        waveCanvas.moveTo(384, 0);
        waveCanvas.lineTo(384, 256);
        waveCanvas.moveTo(512, 0);
        waveCanvas.lineTo(512, 256);
        waveCanvas.stroke();
        waveCanvas.strokeStyle = "black";
        waveCanvas.beginPath();
        waveCanvas.moveTo(0, buf[0]);
        for (var i = 1; i < 512; i++) {
            waveCanvas.lineTo(i, 128 + (buf[i] * 128));
        }
        waveCanvas.stroke();
    }

    if (ac == -1) {
        detectorElem.className = "vague";
        pitchElem.innerText = "--";
        noteElem.innerText = "-";
        detuneElem.className = "";
        detuneAmount.innerText = "--";
    } else {
        detectorElem.className = "confident";
        pitch = ac;
        pitchElem.innerText = Math.round(pitch);
        var note = noteFromPitch(pitch);
        noteElem.innerHTML = noteStrings[note % 12];
        var detune = centsOffFromPitch(pitch, note);
        if (detune == 0) {
            detuneElem.className = "";
            detuneAmount.innerHTML = "--";
        } else {
            if (detune < 0)
                detuneElem.className = "flat";
            else
                detuneElem.className = "sharp";
            detuneAmount.innerHTML = Math.abs(detune);
        }
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    rafID = window.requestAnimationFrame(updatePitch);

    function playNote(noteTaken, time) {
        if (noteStrings[note % 12] == noteTaken && startTime == 0) {
            startTime = Date.now();
        }
        if (noteStrings[note % 12] == noteTaken && Date.now() - startTime >= time) {
            startTime = 0;
            // console.log("ALOOO");
            return true;
        }
        else if (noteStrings[note % 12] != noteTaken && startTime > 0) {
            startTime = 0;
            return false;
        }
    }

    //notePlayed = playNote("C", 50);
    if (window.location.href.split("#") == "level2") {
        notes = notesTwo;
        levl = 2;
    } else if (window.location.href.split("#") == "level3") {
        notes = notesThree;
        levl = 3;
    } else {
        notes = notesOne;
        levl = 1;
    }

    currentNote += levelMap(notes, tempo, currentNote);

    function levelMap(notes, tempo, currentNote) {
        if (playNote(notes[currentNote], tempo[currentNote])) {
            console.log(currentNote);
            return 1;
        }
        else return 0;
    }
    if (currentNote > notes.length - 1) {
        if (levl == getCookie("level")) {
            document.cookie = "level=" + (levl + 1) + ";";
            console.log(document.cookie);
        }
        window.location.href = "/";
    }
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}