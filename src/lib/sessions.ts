import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user;
}

export async function getCurrentUserOrRedirect(): Promise<Session["user"]> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages!.signIn!);
  }

  return user;
}

export async function getCurrentSessionRedirect(): Promise<Session> {
  const session = await getSession();

  if (!session?.userId) {
    redirect(authOptions.pages!.signIn!);
  }

  return session;
}
