"use client";

import { useEffect, useState } from "react";

export function LocaleToggle() {
  const [locale, setLocale] = useState<"en" | "ml">("en");
  useEffect(() => {
    const saved = localStorage.getItem("ragavazhi-locale") as "en" | "ml" | null;
    if (saved) setLocale(saved);
  }, []);
  const change = (next: "en" | "ml") => {
    setLocale(next);
    localStorage.setItem("ragavazhi-locale", next);
    document.documentElement.lang = next;
  };
  return <div className="lang-toggle" aria-label="Language preference">
    <button className={locale === "en" ? "active" : ""} onClick={() => change("en")}>EN</button>
    <button className={locale === "ml" ? "active malayalam" : "malayalam"} onClick={() => change("ml")}>മല</button>
  </div>;
}
