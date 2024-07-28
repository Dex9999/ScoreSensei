import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="home">
        {/* <img className="wlcm" src="/images/scoresensei.png" width="50" height="50" /> */}
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
  );
}
