import Head from "next/head";
import React from "react";

const title = "Generate Custom AI-Generated Profile Pictures with Photoshot";
const description =
  "Custom AI-generated profile pictures that perfectly capture your unique style. Write a prompt and let our Dreambooth and Stable diffusion technology do the rest.";
const image = "https://photoshot.app/og-cover.jpg";

const DefaultHead = () => (
  <Head>
    <title>{title}</title>
    <link rel="shortcut icon" href="/favicon.png" />
    <meta name="description" content={description} />
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
