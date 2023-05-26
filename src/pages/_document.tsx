import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Script id="load-user-settings" strategy="beforeInteractive">
          {`
            const mode = (() => {
              if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
              }
              return "light";
            })();
            document.documentElement.classList.add(mode);
          `}
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
