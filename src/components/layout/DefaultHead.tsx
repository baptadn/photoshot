import Head from "next/head";
import React from "react";

const description = "Create awesome AI avatars";
const title = "Photoshot - AI Avatar generator";
const image = "https://photoshot.app/og-cover.jpg";

const DefaultHead = () => (
  <Head>
    <link rel="shortcut icon" href="/favicon.png" />
    <title>{title}</title>
    <meta name="description" content="" />
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta itemProp="image" content={image} />
    <meta property="og:logo" content={image}></meta>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@shinework" />
    <meta name="twitter:creator" content="@shinework" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Head>
);

export default DefaultHead;
