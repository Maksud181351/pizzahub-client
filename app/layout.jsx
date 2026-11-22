import "./globals.css";
import { Providers } from "@/components/site/providers";

export const metadata = {
  title: { default: "PizzaHub | Hot & fresh pizza delivered to your door", template: "%s | PizzaHub" },
  description: "Discover local pizza shops, browse their menus and order fresh pizza for delivery.",
};

// Runs before first paint so the saved theme never flashes
const themeScript = `try{var t=localStorage.getItem("pizzahub-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
