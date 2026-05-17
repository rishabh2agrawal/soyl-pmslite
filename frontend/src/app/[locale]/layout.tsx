import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-sans",
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
    <html lang={locale} className={cn("font-sans", notoSans.variable)}>
      <body className="antialiased bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
