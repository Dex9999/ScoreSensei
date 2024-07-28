import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="home">
<!--     <img class="wlcm" src="/images/scoresensei.png" width="50" height="50" /> -->
    <h1 class="ttl" style="margin-top: 100px">Welcome to Score Sensei!</h1>
    <div id="app"></div>
    <h1>Level One</h1>
    <a id="1" href="#level1" onclick="startLevel(1)">
      <img class="button" src="/images/playbutton.png" width="150" height="150" id="1" />
    </a>
    <h1 id="1">The Basics</h1>
    <br />
    <h1>Level Two</h1>
    <a id="2" href="#level2" onclick="startLevel(2)">
      <img class="button" src="/images/playbutton.png" width="150" height="150" id="2" />
    </a>
    <h1 id="2">New Notes</h1>
    <br />
    <h1>Level Three</h1>
    <a id="3" href="#level3" onclick="startLevel(3)">
      <img class="button" src="/images/playbutton.png" width="150" height="150" id="3" />
    </a>
    <h1 id="3">Sharp Notes</h1>
  </div>
  
  <div id="game" style="display: none;">
    <div class="home" style="margin-top: 100px">
      <a href="/">
        <img src="https://scoresensei.vercel.app/images/scoresensei.png" alt="Logo" style="width:70px;height:70px;" class="center">
      </a>
    </div>
    <p><button onclick="startPitchDetect();" class="modern-button">Start</button></p>
    <div id="detector" class="vague">
      <div class="pitch" style="display: none;"><span id="pitch"></span></div>
      <p>Your Note:</p>
      <div class="note"><span id="note"></span></div>   
      <canvas id="output" width="300" height="42"></canvas>
      <div id="detune" style="display: none;"><span id="detune_amt">--</span><span id="flat">cents &#9837;</span><span id="sharp">cents &#9839;</span></div>
    </div>
    <img src="" id="image"></img>

  </div>

    </main>
  );
}
