"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookie, setLevel, updateElementsBasedOnLevel } from "../utils";
import levelsData from "../../public/levels.json";


export default function Home() {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    let level = getCookie("level");
    if (!level) {
      setLevel(1);
      level = "1";
    }
    updateElementsBasedOnLevel(level);

    setLevels(levelsData);
  }, []);

  return (
    <div id="home">
      <h1 className="ttl" style={{ marginTop: "100px", fontSize: "6vw"}}>Welcome to Score Sensei!</h1>
      <div id="app"></div>
      {levels.map(level => (
        <Level key={level.id} id={level.id} title={level.title} />
      ))}
    </div>
  );
}

function Level({ id, title }) {
  return (
    <>
      <h1>Level {id}</h1>
      <Link href={`/level/${id}`}>
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
