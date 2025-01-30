"use server";

export type User = {
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

export type UserData = {
  status: string;
  result?: User[];
};

export const fetchUserData = async (username: string): Promise<UserData> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("API URL is not defined in environment variables");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};
