"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { push } = useRouter();
  const [nickname, setNickname] = useState("");

  const handleSearchClick = () => {
    if (nickname.trim()) {
      push(`/search-results?nickname=${encodeURIComponent(nickname)}`);
    }
  };
  
  const handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue = "@" + inputValue.replace(/@+/g, "").trim();
    setNickname(inputValue);
  };

  const handleFocus = () => {
    if (!nickname.startsWith("@")) {
      setNickname("@");
    }
  };

  const handleBlur = () => {
    if (nickname === "@") {
      setNickname("");
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 pt-[80px]">
      <main className="flex flex-col row-start-2 items-center text-center">
        <div className="max-w-[500px]">
          <p className="font-semibold	text-5xl mb-4 tracking-[-3px]">
            Око телеграмма
          </p>
          <p className="font-normal text-base mb-[50px]">
            Быстрый поиск людей по никнейму — начните прямо сейчас!
          </p>
          <input
            type="text"
            value={nickname}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            className="search-input"
            placeholder={"Введите ник, например, @kate_tg"}
          />
          <button
            type="button"
            className="search-button mt-3"
            onClick={handleSearchClick}
          >
            Поиск!
          </button>
        </div>
      </main>
    </div>
  );
}
