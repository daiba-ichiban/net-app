import { dir } from "i18next";
import "./globals.css";
import { languages } from "./i18n/settings";
import { BIZ_UDPGothic, M_PLUS_1_Code } from "next/font/google";
import { cn } from "@/lib/utils";
import LanguageCombo from "@/components/LanguageCombo";

export const fontBizUdpGothic = BIZ_UDPGothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-bizudp",
});

export const fontCode = M_PLUS_1_Code({
  subsets: ["latin"],
  variable: "--font-code",
});

// 静的なパラメータを生成する関数を定義する
export const generateStaticParams = async (): Promise<{ lng: string }[]> => {
  return languages.map((lng) => ({ lng }));
};

// ルートレイアウトのコンポーネントを定義する
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={params.lng} dir={dir(params.lng)}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-bizudp antialiased prose",
          fontBizUdpGothic.variable,
          fontCode.variable
        )}
      >
        <nav>
          <LanguageCombo
            params={{
              lng: params.lng,
            }}
          />
        </nav>
        {children}
      </body>
    </html>
  );
}
