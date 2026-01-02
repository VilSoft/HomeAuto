"use client";

import { useEffect, useState } from "react";
import { SiDuckduckgo } from "react-icons/si";

type Suggestion = {
  phrase: string;
};

export default function DDGSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {}
    };

    const id = setTimeout(fetchSuggestions, 150);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query]);

  const submit = (value: string) => {
    if (!value.trim()) return;
    window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
  };
  
  return (
    <div className="relative w-full sm:w-72">
      {/* ICON */}
      <div
        className="absolute inset-y-0 left-2 flex items-center cursor-pointer text-default-500 hover:text-default-700"
        onClick={() => submit(query || "")}
        title="Search DuckDuckGo"
      >
        {query == "" ? <SiDuckduckgo size={18} /> : <></>}
        
      </div>

      {/* INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit(query);
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="   Search DuckDuckGo"
        className="w-full rounded-md border bg-background px-3 py-2 pl-9 outline-none focus:ring-2 focus:ring-primary"
      />

      {/* SUGGESTIONS */}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow">
          {suggestions.map((s) => (
            <li
              key={s.phrase}
              className="cursor-pointer px-3 py-2 hover:bg-default-100"
              onClick={() => submit(s.phrase)}
            >
              {s.phrase}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
