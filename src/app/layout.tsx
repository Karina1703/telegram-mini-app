"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { retrieveLaunchParams, isTMA } from "@telegram-apps/sdk";
import { Mixpanel } from "@/components/Mixpanel";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function MixapanelSetTelegramUser() {
  const { initData } = retrieveLaunchParams();

  useEffect(() => {
    if (initData?.user) {
      const user = initData.user;
      Mixpanel.identify(String(user?.id ?? 0));
      Mixpanel.track("Page loaded", {});
      Mixpanel.people.set({
        $first_name: user?.firstName ?? "",
        $last_name: user?.lastName ?? "",
        userName: user?.username,
        isPremium: user.isPremium,
      });
    }
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isTelegram, setIsTelegram] = useState(false);

  const initMixpanel = () => {
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
    }
  };

  const checkTelegram = async () => {
    const result = await isTMA();
    setIsTelegram(result);

    if (!result) {
      Mixpanel.track("Run outside Telegramm App", {});
    }
  };

  useEffect(() => {
    initMixpanel();
    checkTelegram();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {isTelegram && <MixapanelSetTelegramUser />}
        {"NEXT_PUBLIC_MIXPANEL_TOKEN" + process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}
        {"isTelegram" + isTelegram}
        {children}
      </body>
    </html>
  );
}
