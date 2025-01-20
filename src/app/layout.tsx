"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { Mixpanel } from "@/components/Mixpanel";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initData } = retrieveLaunchParams();

  useEffect(() => {
    if (initData?.user && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      const user = initData.user;
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
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

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
