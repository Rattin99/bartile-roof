import "./globals.css";

// Metadata for the application
export const metadata = {
  title: "Bartile Roof Configurator",
  description: "Configure your dream roof with Bartile",
};

// Separate client component for providers that use hooks/context
import ClientProviders from "./ClientProviders";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
