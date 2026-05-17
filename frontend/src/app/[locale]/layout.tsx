import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/** Devanagari + Kannada fallbacks */
const notoIndic = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-indic",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={cn(
        dmSans.variable,
        GeistMono.variable,
        notoIndic.variable,
        "font-sans",
      )}
    >
      <body className="antialiased">
        {/* Apply persisted theme before paint to avoid flash (Zustand persist key must match store). */}
        <Script id="soyl-theme-init" strategy="beforeInteractive">
          {`(function(){try{
var d=document.documentElement;
function resolve(t){
  if(t==='system')return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  return t==='dark'?'dark':'light';
}
var raw=localStorage.getItem('soyl-pms-store');
if(!raw){d.setAttribute('data-theme','light');return;}
var p=JSON.parse(raw);
var t=(p.state&&p.state.theme)||'light';
d.setAttribute('data-theme',resolve(t));
}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
