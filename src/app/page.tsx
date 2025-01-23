"use client";

import { useEffect, useRef, useState } from "react";
import { mockData } from "../../public/mockdata";
import ReactMarkdown from "react-markdown";
import { Mixpanel } from "@/components/Mixpanel";
import Image from "next/image";

type UserData = {
  status: string; // ok / error
  result?: {
    phone_number: string | null;
    is_scam: boolean | null;
    is_fake: boolean | null;
    is_support: boolean | null;
    first_name: string | null;
    last_name: string | null;
    last_online_date: string | null;
    activities:
      | {
          group_title: string;
          last_update_time: string;
        }[]
      | null;
  };
  message?: string;
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
        setUserData(mockData);
        Mixpanel.track("Clicked on Search Button", {
          Nickname: nickname,
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
        {userData?.result && (
          <div
            className="px-2 py-5 bg-white rounded-3xl shadow-lg mt-8 text-black"
            ref={resultsRef}
          >
            <div className="p-4 py-7 flex justify-center items-center gap-6 rounded-3xl shadow-lg shadow-blue-500/50 text-left">
              <div className="flex flex-col justify-center items-center">
                <Image
                  src="/avatar.svg"
                  alt="Profile Picture"
                  className="rounded-full object-cover mb-2"
                  width={100}
                  height={100}
                />
                <h1 className="text-1xl font-semibold">
                  {userData.result?.first_name ?? "Без имени"}
                </h1>
                <h1 className="text-1xl font-semibold">
                  {userData.result?.last_name ?? "Без фамилии"}
                </h1>
              </div>
              <div className="flex flex-col gap-4 user-info">
                <div className="info-item">
                  <p
                    className="font-semibold text-base mb-1
"
                  >
                    {userData.result?.phone_number ?? "???"}
                  </p>
                  <p className="font-medium text-xs">Телефон</p>
                </div>

                <div className="info-item">
                  <p
                    className="font-semibold text-base mb-1
"
                  >
                    {userData.result.last_online_date
                      ? new Date(
                          userData.result.last_online_date
                        ).toLocaleString()
                      : "???"}
                  </p>
                  <p className="font-medium text-xs">Последний онлайн</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-5">
              <div className="flex items-center gap-2">
                <Image
                  src="/scam.svg"
                  alt="scam"
                  className="object-cover"
                  width={30}
                  height={30}
                />
                <div>
                  Является ли скамом: {userData.result?.is_scam ? "да" : "нет"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/anonymous.svg"
                  alt="anonymous"
                  className="object-cover"
                  width={30}
                  height={30}
                />
                <div>
                  Является ли фейком: {userData.result?.is_fake ? "да" : "нет"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/support.svg"
                  alt="support"
                  className="object-cover"
                  width={30}
                  height={30}
                />
                <div>
                  Является ли поддержкой:{" "}
                  {userData.result?.is_support ? "да" : "нет"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/groups.svg"
                    alt="groups"
                    className="object-cover"
                    width={30}
                    height={30}
                  />
                  <div>Группы:</div>
                </div>
                {userData.result?.activities &&
                userData.result.activities.length > 0 ? (
                  <ul className="mt-3 text-left pl-4 flex flex-col gap-3">
                    {userData.result.activities.map((activity, index) => (
                      <li key={index} className="text-sm">
                        - {activity.group_title} (Обновлено:{" "}
                        {new Date(activity.last_update_time).toLocaleString()})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    Нет данных об активностях
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
