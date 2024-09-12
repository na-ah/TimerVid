import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider>
      <Component {...pageProps} />
      <Analytics />
    </MantineProvider>
  );
}
