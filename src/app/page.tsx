"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mixpanel } from "@/components/Mixpanel";
import UserCard from "@/components/UserCard";
import { fetchUserData } from "@/services/api";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: fetchUserData,
  });

  const handleSearchClick = () => {
    if (nickname.trim().length > 1) {
      mutate(nickname);
      Mixpanel.track("Clicked on Search Button", {
        Nickname: nickname,
        Data: data?.result ?? [],
      });
    }
  };

  useEffect(() => {
    if (!isPending && data && resultsRef.current) {
      const topOffset =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  }, [isPending, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setNickname(inputValue);
  };

  return (
    <div className="min-h-screen p-4 pb-20 pt-[80px] container">
      <main className="flex flex-col items-center text-center">
        <div className="max-w-[500px] w-full text-wrap">
          <p className="font-semibold text-5xl mb-4 tracking-[-3px]">
            Око телеграмма
          </p>
          <p className="font-normal text-base mb-[50px] text-wrap">
            Быстрый поиск людей по никнейму — начните прямо сейчас!
          </p>
          <input
            ref={inputRef}
            type="text"
            value={nickname}
            onChange={handleInputChange}
            className="search-input w-full max-w-[400px] text-wrap"
            placeholder={"Ведите ник, имя, фамилию или телефон"}
          />
          
          <button
            type="button"
            className="search-button mt-3 w-full max-w-[200px]"
            onClick={handleSearchClick}
            disabled={isPending || nickname.trim() === "@"}
          >
            {isPending ? "Поиск..." : "Поиск!"}
          </button>
        </div>

        {isError && (
          <div className="text-red-500 mt-4 text-wrap max-w-[400px]">
            Ошибка при загрузке:{" "}
            {error instanceof Error ? error.message : "Неизвестная ошибка"}
          </div>
        )}

        <div
          ref={resultsRef}
          className="w-full max-w-[600px] text-wrap flex flex-col justify-center items-center"
        >
          {data?.result && data.result.length > 0
            ? data.result.map((user, index) => (
                <UserCard key={index} user={user} />
              ))
            : data !== undefined &&
              !isPending && (
                <p className="font-normal text-base mt-[50px] text-wrap max-w-[400px] text-center">
                  Ничего не найдено. Попробуйте поискать по другому имени.
                </p>
              )}
        </div>
      </main>
    </div>
  );
}
