import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function load() {
      let level = getCookie("level");
      console.log(level);
      if (!level) {
        console.log("set");
        document.cookie = "level=1;";
        level = 1;
      }
      document.getElementsByTagName("h1")[0].style.fontSize = "6vw";

      document.querySelectorAll("h1").forEach((element) => {
        if (Number(element.id) < level && element.id != "0") {
          element.innerText += " Completed";
          element.style.color = "#2df412";
        }
      });

      document.querySelectorAll("a").forEach((element) => {
        if (Number(element.id) > level && element.id != "0") {
          element.href = "#";
          element.onclick = null;
        }
      });

      document.querySelectorAll("img").forEach((element) => {
        if (Number(element.id) < level && element.id != "0") {
          element.src = "/images/completebutton.png";
        } else if (Number(element.id) > level && element.id != "0") {
          element.src = "/images/redbutton.png";
        }
      });

      function getCookie(cname: string) {
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
    }
    load();
  }, []);

  async function startLevel(lvl: number) {
    document.getElementById("home")!.style.display = "none";
    document.getElementById("game")!.style.display = "block";

    const imgSrc =
      "https://scoresensei.vercel.app/public/" + (lvl === 1 ? "1-1" : lvl) + ".png";
    (document.getElementById("image") as HTMLImageElement).src = imgSrc;
    go(lvl);
  }

  async function home() {
    document.getElementById("game")!.style.display = "none";
    document.getElementById("home")!.style.display = "block";
    load();
  }

  return (
    <div id="home">
      <h1 className="ttl" style={{ marginTop: "100px" }}>Welcome to Score Sensei!</h1>
      <div id="app"></div>
      <h1>Level One</h1>
      <a id="1" href="#level1" onClick={() => startLevel(1)}>
        <Image
          className="button"
          src="/images/playbutton.png"
          width={150}
          height={150}
          alt="Play Level 1"
          id="1"
        />
      </a>
      <h1 id="1">The Basics</h1>
      <br />
      <h1>Level Two</h1>
      <a id="2" href="#level2" onClick={() => startLevel(2)}>
        <Image
          className="button"
          src="/images/playbutton.png"
          width={150}
          height={150}
          alt="Play Level 2"
          id="2"
        />
      </a>
      <h1 id="2">New Notes</h1>
      <br />
      <h1>Level Three</h1>
      <a id="3" href="#level3" onClick={() => startLevel(3)}>
        <Image
          className="button"
          src="/images/playbutton.png"
          width={150}
          height={150}
          alt="Play Level 3"
          id="3"
        />
      </a>
      <h1 id="3">Sharp Notes</h1>
    </div>
    <div id="game" style={{ display: "none" }}>
      <div className="home" style={{ marginTop: "100px" }}>
        <a href="/">
          <Image
            src="https://scoresensei.vercel.app/images/scoresensei.png"
            alt="Logo"
            width={70}
            height={70}
            className="center"
          />
        </a>
      </div>
      <p>
        <button onClick={startPitchDetect} className="modern-button">Start</button>
      </p>
      <div id="detector" className="vague">
        <div className="pitch" style={{ display: "none" }}>
          <span id="pitch"></span>
        </div>
        <p>Your Note:</p>
        <div className="note">
          <span id="note"></span>
        </div>
        <canvas id="output" width="300" height="42"></canvas>
        <div id="detune" style={{ display: "none" }}>
          <span id="detune_amt">--</span>
          <span id="flat">cents &#9837;</span>
          <span id="sharp">cents &#9839;</span>
        </div>
      </div>
      <Image src="" alt="Game Image" id="image" width={300} height={300} />
    </div>
  );
}
