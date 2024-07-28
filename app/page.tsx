import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="home">
{/*         <h1 class="ttl" style="margin-top: 100px">Welcome to Score Sensei!</h1> */}
        <div id="app"></div>
        <h1>Level One</h1>
        <h1 id="1">The Basics</h1>
        <br>
        <h1>Level Two</h1>
        <h1 id="2">New Notes</h1>
        <br>
        <h1>Level Three</h1>
        <h1 id="3">Sharp Notes</h1>
      </div>

    </main>
  );
}
