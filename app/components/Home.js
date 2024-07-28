import { useEffect } from "react";
import Link from "next/link";
import { getCookie, setLevel, updateElementsBasedOnLevel } from "../utils";

export default function Home({ startLevel }) {
  useEffect(() => {
    let level = getCookie("level");
    if (!level) {
      setLevel(1);
      level = "1";
    }
    document.getElementsByTagName("h1")[0].style.fontSize = "6vw";
    updateElementsBasedOnLevel(level);
  }, []);

  return (
    <div id="home">
      <h1 className="ttl" style={{ marginTop: "100px" }}>Welcome to Score Sensei!</h1>
      <div id="app"></div>
      <Level id="1" startLevel={startLevel} title="The Basics" />
      <Level id="2" startLevel={startLevel} title="New Notes" />
      <Level id="3" startLevel={startLevel} title="Sharp Notes" />
    </div>
  );
}

function Level({ id, startLevel, title }) {
  return (
    <>
      <h1>Level {id}</h1>
      <Link href={`/level/${id}`} onClick={() => startLevel(id)}>
        <img
          className="button"
          src="/playbutton.png"
          width="150"
          height="150"
          id={id}
          alt="Play Button"
        />
      </Link>
      <h1 id={id}>{title}</h1>
      <br />
    </>
  );
}
