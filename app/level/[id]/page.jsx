"use client";

import Game from '../../components/Game';

export default function Page({ params }) {
    return (
        <Game level={params.id}/>
    )
  }