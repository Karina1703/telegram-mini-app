// components/UserCard.tsx

import Image from "next/image";
import { User } from "@/services/api";

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="px-4 py-5 bg-white rounded-3xl shadow-lg mt-8 text-black w-full max-w-[500px] text-wrap">
      <div className="p-4 py-7 flex justify-center items-center gap-6 rounded-3xl shadow-lg shadow-blue-500/50 text-left w-full">
        <div className="flex flex-col justify-center items-center text-wrap text-center">
          <Image
            src="/avatar.svg"
            alt="Profile Picture"
            className="rounded-full object-cover mb-2"
            width={100}
            height={100}
          />
          <h1 className="text-1xl font-semibold">
            {user.first_name || "Имя отсутствует"}
          </h1>
          <h1 className="text-1xl font-semibold">
            {user.last_name || "Фамилия отсутствует"}
          </h1>
        </div>
        <div className="flex flex-col gap-4 user-info">
          <div className="info-item">
            <p className="font-semibold text-base mb-1">
              {user.phone_number || "Отсутствует"}
            </p>
            <p className="font-medium text-xs">Телефон</p>
          </div>
          <div className="info-item">
            <p className="font-semibold text-base mb-1">
              {user.last_online_date
                ? new Date(user.last_online_date).toLocaleDateString("ru-RU")
                : "Отсутствует"}
            </p>
            <p className="font-medium text-xs">Последний онлайн</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex items-center gap-2">
          <Image src="/scam.svg" alt="scam" width={30} height={30} />
          <div>Является ли скамом: {user.is_scam ? "да" : "нет"}</div>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/anonymous.svg" alt="anonymous" width={30} height={30} />
          <div>Является ли фейком: {user.is_fake ? "да" : "нет"}</div>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/support.svg" alt="support" width={30} height={30} />
          <div>Является ли поддержкой: {user.is_support ? "да" : "нет"}</div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Image src="/groups.svg" alt="groups" width={30} height={30} />
            <div>Группы:</div>
          </div>
          {user.activities && user.activities.length > 0 ? (
            <ul className="mt-3 text-left pl-4 flex flex-col gap-3 max-w-full">
              {user.activities.map((activity, index) => (
                <li key={index} className="text-sm">
                  - {activity.group_title} (Обновлено:{" "}
                  {new Date(activity.last_update_time).toLocaleDateString(
                    "ru-RU"
                  )}
                  )
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Нет данных об активностях</p>
          )}
        </div>
      </div>
    </div>
  );
}
