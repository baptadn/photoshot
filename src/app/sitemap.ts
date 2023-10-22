import { prompts } from "@/core/utils/prompts";
import { MetadataRoute } from "next";

const routes = [
  "https://photoshot.app",
  "https://photoshot.app/terms",
  "https://photoshot.app/faq",
  "https://photoshot.app/prompts",
  "https://photoshot.app/how-it-works",
  ...prompts.map(
    ({ slug }) => `https://photoshot.app/prompts/dreambooth/${slug}`
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: route }));
}
