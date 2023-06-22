import Document, { Html, Head, Main, NextScript } from "next/document";
import * as snippet from "@segment/snippet";

class AppDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  renderSnipet = () => {
    return snippet.min({ apiKey: "OY8Dyz0RGkRhBBFlBzQClkoALFusCQLc", page: true });
  };

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" type="image/png" href="/meta/favicon.ico" />
          <link rel="apple-touch-icon" href="/meta/apple-icon.png" />

          <meta name="application-name" content="BazaarNXT" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="BazaarNXT" />
          <meta name="description" content="Smart Procurement for Retailers" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/meta/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#E64431" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#E64431" />

          <link rel="apple-touch-icon" href="/meta/apple-icon.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/meta/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/meta/apple-icon-180x180.png" />
          <link rel="apple-touch-icon" sizes="192x192" href="/meta/apple-icon-192x192.png" />

          <link rel="icon" type="image/png" sizes="32x32" href="/meta/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/meta/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/meta/favicon-96x96.png" />
          <link rel="manifest" href="/manifest.json" />
          {/* <link rel="mask-icon" href="/meta/safari-pinned-tab.svg" color="#E64431" /> */}
          <link rel="shortcut icon" href="/meta/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,800" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://wholesalenxt.com" />
          <meta name="twitter:title" content="BazaarNXT" />
          <meta name="twitter:description" content="Smart Procurement for Retailers" />
          <meta name="twitter:image" content="https://wholesalenxt.com/icons/android-chrome-192x192.png" />
          <meta name="twitter:creator" content="@BazaarNXTOfficial" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="BazaarNXT" />
          <meta property="og:description" content="Smart Procurement for Retailers" />
          <meta property="og:site_name" content="BazaarNXT" />
          <meta property="og:url" content="https://wholesalenxt.com" />
          <meta property="og:image" content="https://wholesalenxt.com/icons/apple-touch-icon.png" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />

          {/* apple splash screen images  */}
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_2048.png" sizes="2048x2732" />
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_1668.png" sizes="1668x2224" />
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_1536.png" sizes="1536x2048" />
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_1125.png" sizes="1125x2436" />
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_1242.png" sizes="1242x2208" />
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_750.png" sizes="750x1334" />
          <link rel="apple-touch-startup-image" href="/meta/apple_splash_640.png" sizes="640x1136" />
          <script async defer src="https://tools.luckyorange.com/core/lo.js?site-id=32667ffb"></script>
          <script dangerouslySetInnerHTML={{ __html: this.renderSnipet() }} />
        </Head>
        <body className="dark:text-white font-gilroy selection:bg-brand-300 selection:bg-opacity-40 dark:bg-black">
          <Main />
          <NextScript />

          {/* <noscript
						dangerouslySetInnerHTML={{
						__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJJBXD5"
						height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
						}}
					/> */}
        </body>
      </Html>
    );
  }
}

export default AppDocument;