import PromptDetailPage, {
  TPrompt,
} from "@/components/pages/prompts/PromptDetailPage";
import { prompts } from "@/core/utils/prompts";

export function generateStaticParams() {
  return prompts.map((prompt) => ({
    slug: prompt.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug as string;
  const prompt = prompts.find((prompt) => prompt.slug === slug)!;

  return {
    title: `Free prompt ${prompt.label} - Photoshot`,
    description:
      "Our free AI prompt covers a wide range of themes and topics to help you create a unique avatar. Use theme with our Studio or your Stable Diffusion or Dreambooth models.",
  };
}

const PromptDetail = async ({ params }: { params: { slug: string } }) => {
  const slug = params?.slug as string;
  const promptIndex = prompts.findIndex((prompt) => prompt.slug === slug)!;
  const prompt = prompts[promptIndex];

  const morePrompts: TPrompt[] = [];

  for (let i = promptIndex + 1; i < promptIndex + 6; i++) {
    if (i > prompts.length - 1) {
      morePrompts.push(prompts[Math.abs(i - prompts.length)]);
    } else {
      morePrompts.push(prompts[i]);
    }
  }

  return <PromptDetailPage morePrompts={morePrompts} prompt={prompt} />;
};

export default PromptDetail;
