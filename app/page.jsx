"use client";

import { useEffect } from "react";
import Image from "next/image";
import './globals.css';
import { load } from './utils/load';
import { startLevel, home, startPitchDetect } from './utils/game';

export default function Home() {
  useEffect(() => {
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
            <img
              className="button"
              src="/playbutton.png"
              width="150"
              height="150"
              id="1"
              alt="Play Button"
            />
          </a>
          <h1 id="1">The Basics</h1>
          <br />
          <h1>Level Two</h1>
          <a id="2" href="#level2" onClick={() => startLevel(2)}>
            <img
              className="button"
              src="/playbutton.png"
              width="150"
              height="150"
              id="1"
              alt="Play Button"
            />
          </a>
          <h1 id="2">New Notes</h1>
          <br />
          <h1>Level Three</h1>
          <a id="3" href="#level3" onClick={() => startLevel(3)}>
            <img
              className="button"
              src="/playbutton.png"
              width="150"
              height="150"
              id="1"
              alt="Play Button"
            />
          </a>
          <h1 id="3">Sharp Notes</h1>
        </div>

        <div id="game" style={{ display: "none" }}>
          <div className="home" style={{ marginTop: "100px" }}>
            <a href="/">
              <img src="https://scoresensei.vercel.app/public/scoresensei.png" alt="Logo" style={{ width: "70px", height: "70px" }} className="center" />
            </a>
          </div>
          <p><button onClick={startPitchDetect} className="modern-button">Start</button></p>
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
