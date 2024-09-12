import { ColorSchemeScript } from "@mantine/core";
import { Html, Main, NextScript } from "next/document";
import Head from "next/document";

export default function Document() {
  return (
    <Html lang="jp">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
