"use client";

import { useEffect, useRef, useState } from "react";
import { mockData } from "../../public/mockdata";
import ReactMarkdown from "react-markdown";

type UserData = {
  nickname: string;
  description: string;
};

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchClick = () => {
    if (nickname.trim() && nickname.length > 1) {
      setLoading(true);
      setUserData(null); // Очистить предыдущие результаты
      setTimeout(() => {
        // Симуляция получения данных
        setUserData({
          nickname,
          description: mockData.description,
        });
        setLoading(false);
      }, 2000); // Имитируем задержку получения данных
    }
  };

  useEffect(() => {
    if (!loading && userData && resultsRef.current) {
      const topOffset =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  }, [loading, userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (!inputValue.startsWith("@")) {
      inputValue = "@" + inputValue.replace(/@+/g, "").trim();
    } else {
      inputValue = "@" + inputValue.slice(1).replace(/@+/g, "").trim();
    }
    setNickname(inputValue);

    // Установить курсор в конец текста
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(
          inputValue.length,
          inputValue.length
        );
      }
    }, 0);
  };

  const handleFocus = () => {
    if (!nickname.startsWith("@")) {
      setNickname("@");
    }
    // Установить курсор в конец текста
    if (inputRef.current) {
      inputRef.current.setSelectionRange(nickname.length, nickname.length);
    }
  };

  const handleBlur = () => {
    if (nickname === "@") {
      setNickname("");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || 0;
      if (cursorPosition <= 1) {
        // Перемещаем курсор за @
        setTimeout(() => {
          inputRef.current?.setSelectionRange(1, 1);
        }, 0);
      }
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
            ref={inputRef}
            type="text"
            value={nickname}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            onClick={handleClick}
            className="search-input"
            placeholder={"Введите ник, например, @kate_tg"}
          />
          <button
            type="button"
            className="search-button mt-3"
            onClick={handleSearchClick}
            disabled={loading || nickname.trim() === "@"}
          >
            {loading ? "Поиск..." : "Поиск!"}
          </button>
        </div>
      </main>
      {userData && (
        <div
          ref={resultsRef}
          className="p-4 pb-10 pt-[40px] bg-gray-100 mt-8 rounded"
        >
          <h1
            className="font-semibold text-3xl mb-9 tracking-[-2px] max-w-full text-black text-center"
            style={{
              whiteSpace: "initial",
              wordWrap: "break-word",
            }}
          >
            Результаты для {userData.nickname}
          </h1>
          <div className="text-left text-black">
            <ReactMarkdown>{userData.description}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
