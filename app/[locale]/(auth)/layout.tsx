import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
    <div className="min-h-screen bg-forest-950 flex flex-col">
      {/* Minimal header */}
      <header className="p-6">
        <Link href="/" className="font-serif text-2xl text-white hover:text-gold-400 transition-colors">
          IES Ingredients
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </main>

      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-700/20 rounded-full blur-3xl" />
      </div>
    </div>
    </NextIntlClientProvider>
  );
}
