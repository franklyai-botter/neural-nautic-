"use client";
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedCollection from "./components/FeaturedCollection";
import AtelierNote from "./components/AtelierNote";
import JournalList from "./components/JournalList";
import Footer from "./components/Footer";

type View = "atelier" | "collection" | "journal";

export default function Page() {
  const [view, setView] = useState<View>("atelier");

  return (
    <>
      <Header current={view} onNav={(id) => setView(id as View)} />
      <main>
        {view === "atelier" && (
          <>
            <Hero onNav={(id) => setView(id as View)} />
            <FeaturedCollection onOpen={(o) => { if (o) setView("collection"); }} />
            <AtelierNote />
            <JournalList onOpen={() => setView("journal")} />
          </>
        )}
        {view === "collection" && (
          <FeaturedCollection onOpen={() => {}} />
        )}
        {view === "journal" && (
          <JournalList onOpen={() => {}} />
        )}
      </main>
      <Footer />
    </>
  );
}
