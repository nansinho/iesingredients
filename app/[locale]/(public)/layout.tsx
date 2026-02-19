import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col">
        {/* Header will be added in Phase 2 */}
        <main className="flex-1">{children}</main>
        {/* Footer will be added in Phase 2 */}
      </div>
    </NextIntlClientProvider>
  );
}
