import PromptsListPage from "@/components/pages/prompts/PromptsListPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompts Inspiration",
  description:
    "Our free AI prompt covers a wide range of themes and topics to help you create a unique avatar. Use theme with our Studio or your Stable Diffusion or Dreambooth models.",
};

const PromptsList = () => <PromptsListPage />;

export default PromptsList;
