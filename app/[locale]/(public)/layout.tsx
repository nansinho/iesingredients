import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeSelector } from "@/components/layout/ThemeSelector";
import { AudioBar } from "@/components/audio/AudioBar";
import { SocialSidebar } from "@/components/layout/SocialSidebar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex flex-col">
          <Header />
          <SocialSidebar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AudioBar />
        </div>
        <ThemeSelector />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
