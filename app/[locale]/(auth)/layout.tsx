import Image from "next/image";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { AuthImageCarousel } from "@/components/auth/AuthImageCarousel";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex bg-cream-light">
        {/* Left - Decorative image panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden">
          <AuthImageCarousel />
        </div>

        {/* Right - Form panel */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-brand-primary">
          {/* Header with brand accent */}
          <header className="px-6 py-5 lg:px-10 lg:py-6 flex items-center justify-between">
            <Link href="/" className="inline-block lg:hidden">
              <Image
                src="/images/logo-ies.png"
                alt="IES Ingredients"
                width={140}
                height={56}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <div className="hidden lg:block" />
            <Link
              href="/"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              &larr; Retour au site
            </Link>
          </header>

          {/* Centered content */}
          <main className="flex-1 flex items-center justify-center px-6 pb-16">
            <AnimateIn y={25} delay={0.1} className="w-full max-w-md">
              {children}
            </AnimateIn>
          </main>

          {/* Decorative background blobs — brand colors */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px]" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[120px]" />
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
