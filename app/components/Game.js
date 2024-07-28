"use client";

export default function Game({ startPitchDetect }) {
  return (
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
  );
}
