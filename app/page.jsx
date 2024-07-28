"use client";


import { useEffect } from "react";
import Image from "next/image";
import 'globals.css'


export default function Home() {
  useEffect(() => {
    async function load() {
      let level = getCookie("level");
      console.log(level);
      if (!level) {
        console.log("set");
        document.cookie = "level=1;";
        level = "1";
      }
      document.getElementsByTagName("h1")[0].style.fontSize = "6vw";

      document.querySelectorAll("h1").forEach((element) => {
        if (element.id < level && element.id != "0") {
          element.innerText += " Completed";
          element.style.color = "#2df412";
        }
      });

      document.querySelectorAll("a").forEach((element) => {
        if (element.id > level && element.id != "0") {
          element.href = "#";
          element.onclick = null;
        }
      });

      document.querySelectorAll("img").forEach((element) => {
        if (element.id < level && element.id != "0") {
          element.src = "/images/completebutton.png";
        } else if (element.id > level && element.id != "0") {
          element.src = "/images/redbutton.png";
        }
      });
    }

    function getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    async function startLevel(lvl) {
      document.getElementById("home").style.display = "none";
      document.getElementById("game").style.display = "block";
      document.getElementById("image").src = "https://scoresensei.vercel.app/public/" + ((lvl == 1) ? "1-1" : lvl) + ".png";
      go(lvl);
    }

    async function home() {
      document.getElementById("game").style.display = "block";
      document.getElementById("home").style.display = "none";
      load();
    }

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
      MAX_SIZE = Math.max(4, Math.floor(audioContext.sampleRate / 5000));

      detectorElem = document.getElementById("detector");
      canvasElem = document.getElementById("output");
      DEBUGCANVAS = document.getElementById("waveform");
      if (DEBUGCANVAS) {
        waveCanvas = DEBUGCANVAS.getContext("2d");
        waveCanvas.strokeStyle = "black";
        waveCanvas.lineWidth = 1;
      }
      pitchElem = document.getElementById("pitch");
      noteElem = document.getElementById("note");
      detuneElem = document.getElementById("detune");
      detuneAmount = document.getElementById("detune_amt");

      detectorElem.ondragenter = function () {
        this.classList.add("droptarget");
        return false;
      };
      detectorElem.ondragleave = function () {
        this.classList.remove("droptarget");
        return false;
      };
      detectorElem.ondrop = function (e) {
        this.classList.remove("droptarget");
        e.preventDefault();
        theBuffer = null;

        var reader = new FileReader();
        reader.onload = function (event) {
          audioContext.decodeAudioData(event.target.result, function (buffer) {
            theBuffer = buffer;
          }, function () { alert("error loading!"); });
        };
        reader.onerror = function (event) {
          alert("Error: " + reader.error);
        };
        reader.readAsArrayBuffer(e.dataTransfer.files[0]);
        return false;
      };
    }

    function startPitchDetect() {
      audioContext = new AudioContext();

      navigator.mediaDevices.getUserMedia({
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        }
      }).then((stream) => {
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect(analyser);
        updatePitch();
      }).catch((err) => {
        console.error(`${err.name}: ${err.message}`);
        alert('Stream generation failed.');
      });
    }

    var rafID = null;
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
      var SIZE = buf.length;
      var rms = 0;

      for (var i = 0; i < SIZE; i++) {
        var val = buf[i];
        rms += val * val;
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < 0.01)
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

      if (DEBUGCANVAS) {
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
          return true;
        }
        else if (noteStrings[note % 12] != noteTaken && startTime > 0) {
          startTime = 0;
          return false;
        }
      }

      if (window.location.href.split("#")[1] == "level2") {
        notes = notesTwo;
        levl = 2;
      } else if (window.location.href.split("#")[1] == "level3") {
        notes = notesThree;
        levl = 3;
      } else {
        notes = notesOne;
        levl = 1;
      }

      currentNote += levelMap(notes, tempo, currentNote);

      function levelMap(notes, tempo, currentNote) {
        if (playNote(notes[currentNote], tempo[currentNote])) {
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
    }

    load();
  }, []);

  return (
    <>
      <style jsx>{`
          .button {
            filter: drop-shadow(10px 10px 10px #0f0f4f);
          }
  
          .wlcm {
            transform: translate(-230px, 80px);
          }
  
          .ttl {
            transform: translate(30px, 0px);
          }
  
          .modern-button {
            background-color: white;
            color: black;
            border: 2px solid black;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s, transform 0.3s;
          }
  
          .modern-button:hover {
            background-color: black;
            color: white;
            transform: scale(1.05);
          }
  
          .modern-button:active {
            transform: scale(1);
          }
        `}</style>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div id="home">
          <h1 className="ttl" style={{ marginTop: "100px" }}>Welcome to Score Sensei!</h1>
          <div id="app"></div>
          <h1>Level One</h1>
          <a id="1" href="#level1" onClick={() => startLevel(1)}>
            <img className="button" src="/images/playbutton.png" width="150" height="150" id="1" />
          </a>
          <h1 id="1">The Basics</h1>
          <br />
          <h1>Level Two</h1>
          <a id="2" href="#level2" onClick={() => startLevel(2)}>
            <img className="button" src="/images/playbutton.png" width="150" height="150" id="2" />
          </a>
          <h1 id="2">New Notes</h1>
          <br />
          <h1>Level Three</h1>
          <a id="3" href="#level3" onClick={() => startLevel(3)}>
            <img className="button" src="/images/playbutton.png" width="150" height="150" id="3" />
          </a>
          <h1 id="3">Sharp Notes</h1>
        </div>
  
        <div id="game" style={{ display: "none" }}>
          <div className="home" style={{ marginTop: "100px" }}>
            <a href="/">
              <img src="https://scoresensei.vercel.app/images/scoresensei.png" alt="Logo" style={{ width: "70px", height: "70px" }} className="center" />
            </a>
          </div>
          <p><button onClick={() => startPitchDetect()} className="modern-button">Start</button></p>
          <div id="detector" className="vague">
            <div className="pitch" style={{ display: "none" }}><span id="pitch"></span></div>
            <p>Your Note:</p>
            <div className="note"><span id="note"></span></div>   
            <canvas id="output" width="300" height="42"></canvas>
            <div id="detune" style={{ display: "none" }}><span id="detune_amt">--</span><span id="flat">cents &#9837;</span><span id="sharp">cents &#9839;</span></div>
          </div>
          <img src="" id="image" alt="Detector" />
        </div>
      </main>
    </>
  );
}
