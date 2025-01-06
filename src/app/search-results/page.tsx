"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockData } from "../../../public/mockdata";
import Loader from "@/components/Loader";

type UserData = {
  nickname: string; // Никнейм пользователя
  fullName: string; // Полное имя
  age: number; // Возраст
  location: string; // Локация
  bio: string; // Биография
  lastSeen: string; // Последний визит
  socials: {
    telegram: string; // Telegram-ссылка
    instagram: string; // Instagram-ссылка
  };
  interests: string[]; // Список интересов
  error?: any; // Возможная ошибка, необязательное поле
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname") ?? "";
  const [userData, setUserData] = useState<UserData | null>(null); // null для начального значения
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    if (nickname) {
      setTimeout(() => {
        setUserData({ ...mockData, nickname });
        setLoading(false);
      }, 2000);
    }
  }, [nickname]);

  const handleSearchClick = () => {
    push(`/`);
  };

  if (!nickname || userData?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pb-20 pt-[80px]">
        <div>
          <p className="font-semibold text-3xl mb-4 tracking-[-2px] text-center">
            Не удалось найти данные для указанного ника.
          </p>
          <button
            type="button"
            className="search-button mt-[40px]"
            onClick={handleSearchClick}
          >
            Новый поиск!
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20 pt-[80px]">
      <main className="flex flex-col row-start-2 items-center text-center">
        <div className="max-w-full">
          <h1
            className="font-semibold text-3xl mb-4 tracking-[-2px] max-w-full"
            style={{
              whiteSpace: "initial",
              wordWrap: "break-word",
            }}
          >
            Результаты для {nickname}
          </h1>
          <div className="bg-gray-100 p-4 rounded text-left w-full text-black">
            <p>
              <strong>Полное имя:</strong> {userData?.fullName}
            </p>
            <p>
              <strong>Возраст:</strong> {userData?.age}
            </p>
            <p>
              <strong>Локация:</strong> {userData?.location}
            </p>
            <p>
              <strong>Биография:</strong> {userData?.bio}
            </p>
            <p>
              <strong>Последний визит:</strong> {userData?.lastSeen}
            </p>
            <div>
              <strong>Социальные сети:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>
                  <strong>Telegram:</strong> {userData?.socials.telegram}
                </li>
                <li>
                  <strong>Instagram:</strong> {userData?.socials.instagram}
                </li>
              </ul>
            </div>
            <div>
              <strong>Интересы:</strong>
              <ul className="list-disc list-inside ml-4">
                {userData?.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            className="search-button mt-[40px]"
            onClick={handleSearchClick}
          >
            Новый поиск!
          </button>
        </div>
      </main>
    </div>
  );
}
