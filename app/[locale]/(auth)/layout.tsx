import Image from "next/image";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex">
        {/* Left - Decorative image panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <Image
            src="/images/botanicals-flat.jpg"
            alt="Natural ingredients"
            fill
            priority
            className="object-cover animate-kenburns"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-dark/50 to-dark/70" />

          {/* Brand overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
            <AnimateIn delay={0.3}>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo-ies.png"
                  alt="IES Ingredients"
                  width={160}
                  height={64}
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
            </AnimateIn>
            <AnimateIn delay={0.5} y={15}>
              <p className="text-cream-light/80 text-lg leading-relaxed max-w-md">
                Natural ingredients for cosmetics, perfumery &amp; food flavors since 1994.
              </p>
              <div className="flex gap-4 mt-6 text-[11px] text-cream-light/30 uppercase tracking-[0.15em] font-medium">
                <span>COSMOS</span>
                <span className="text-cream-light/15">&middot;</span>
                <span>ECOCERT</span>
                <span className="text-cream-light/15">&middot;</span>
                <span>BIO</span>
                <span className="text-cream-light/15">&middot;</span>
                <span>ISO 9001</span>
              </div>
            </AnimateIn>
          </div>
        </div>

        {/* Right - Form panel */}
        <div className="flex-1 bg-cream-light dark:bg-dark flex flex-col relative overflow-hidden">
          {/* Header */}
          <header className="bg-[#1A1A1A] px-6 py-4 lg:px-8 lg:py-5">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-ies.png"
                alt="IES Ingredients"
                width={140}
                height={56}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
          </header>

          {/* Centered content */}
          <main className="flex-1 flex items-center justify-center px-6 pb-16">
            <AnimateIn y={25} delay={0.1} className="w-full max-w-md">
              {children}
            </AnimateIn>
          </main>

          {/* Decorative background blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-olive/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sand/5 rounded-full blur-[120px]" />
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
