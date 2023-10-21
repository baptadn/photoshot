import { getCurrentUserOrRedirect } from "@/lib/sessions";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  await getCurrentUserOrRedirect();

  return <>{children}</>;
}
