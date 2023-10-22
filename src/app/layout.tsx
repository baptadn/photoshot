import Providers from "@/components/Providers";
import { getSession } from "@/lib/sessions";
import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
};

const description =
  "Generate AI avatars that perfectly capture your unique style. Write a prompt and let our Dreambooth and Stable diffusion technology do the rest.";
const image = "https://photoshot.app/og-cover.jpg";

export const metadata: Metadata = {
  title: {
    template: "%s | Photoshot",
    default: "Generate Custom AI avatar",
  },
  description,
  twitter: {
    card: "summary_large_image",
    site: "@shinework",
    creator: "@shinework",
    title: { template: "%s | Photoshot", default: "Generate Custom AI avatar" },
    description,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Photoshot",
      },
    ],
  },
  openGraph: {
    title: { template: "%s | Photoshot", default: "Generate Custom AI avatar" },
    images: [
      description,
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Photoshot",
      },
    ],
  },
};

export default async function RootLayout({ children }: Props) {
  const session = await getSession();

  return (
    <html lang="en">
      <link rel="shortcut icon" href="/favicon.png" />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
