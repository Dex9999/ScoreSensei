"use client";
import Image from "next/image";
import { updatePitch } from "../pitchDetection.js";
import { use, useEffect } from "react";
import levelsData from "../../public/levels.json";
import Vex from "vexflow";

export default function Game({ level }) {
  useEffect(() => {
    const { Factory, EasyScore, System } = Vex.Flow;

    const vf = new Factory({
      renderer: { elementId: 'output', width: 500, height: 200 },
    });

    const score = vf.EasyScore();
    const system = vf.System();
    
    //all quarter notes for now
    let staffNotes = levelsData[level - 1].notes.map(note => note + "4/q").join(", ");
    
    system
      .addStave({
        voices: [
          score.voice(score.notes(staffNotes, { stem: 'up' }))
        ],
      })
      .addClef('treble')
      .addTimeSignature('4/4');

    vf.draw();
  }, []);
  async function startPitchDetect() {

    let start = { time: 0 };
    var currentNote = 0;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    mediaStreamSource.connect(analyser);

    const detectorElem = document.getElementById("detector");
    const pitchElem = document.getElementById("pitch");
    const noteElem = document.getElementById("note");
    const detuneElem = document.getElementById("detune");
    const detuneAmount = document.getElementById("detune_amt");


    updatePitch(analyser, audioContext, detectorElem, pitchElem, noteElem, detuneElem, detuneAmount, start, currentNote, levelsData[level - 1].notes, levelsData[level - 1].tempo, level);
    // style={{marginTop: "100px"}}
  }

  return (
    <div id="game">
      <div className="logo-container" >
        <a href="/">
          <Image src="/logo.png" alt="Home" width={50} height={50} />
        </a>
      </div>
      <p><button onClick={startPitchDetect} className="modern-button">Start</button></p>
      <div id="detector" className="vague">
        Current Note:
        <br />
        <div className="note" style={{ fontSize: "20px" }}><span id="note"></span></div>
      </div>
      <div id="output" style={{background: "white"}} width="100%"></div>
    </div>
  );
}
