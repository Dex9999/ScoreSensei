"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Home from "./components/Home";
import Game from "./components/Game";
import { getCookie, setLevel } from "./utils";
import { updatePitch } from "./pitchDetection";

// Dynamically import components with no SSR
const DynamicHome = dynamic(() => import("./components/Home"), { ssr: false });
const DynamicGame = dynamic(() => import("./components/Game"), { ssr: false });

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // useEffect(() => {
  //   const level = pathname.split("/").pop();
  //   if (level) {
  //     startLevel(parseInt(level));
  //   }

  //   const handleRouteChange = () => {
  //     const newLevel = pathname.split("/").pop();
  //     if (newLevel) {
  //       startLevel(parseInt(newLevel));
  //     }
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [pathname, router]);

  async function startLevel(lvl) {
    document.getElementById("home").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("image").src = `https://scoresensei.vercel.app/public/${lvl === 1 ? "1-1" : lvl}.png`;
    // Initialize pitch detection or other level-specific logic
  }

  async function startPitchDetect() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    mediaStreamSource.connect(analyser);

    const detectorElem = document.getElementById("detector");
    const pitchElem = document.getElementById("pitch");
    const noteElem = document.getElementById("note");
    const detuneElem = document.getElementById("detune");
    const detuneAmount = document.getElementById("detune_amt");
    const waveCanvas = document.getElementById("waveform")?.getContext("2d");

    updatePitch(analyser, audioContext, detectorElem, pitchElem, noteElem, detuneElem, detuneAmount, waveCanvas);
  }

  return (
    <>
      <div>
        <Home startLevel={startLevel} />
        <Game startPitchDetect={startPitchDetect} />
      </div>
    </>
  );
}
