import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import db from "@/core/db";
import { EMAIL_SUBJECTS, sendEmail } from "@/core/mailer";
import LoginEmail from "@/components/emails/LoginEmail";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest({ identifier: email, url }) {
        sendEmail({
          to: email,
          subject: EMAIL_SUBJECTS.LOGIN,
          component: <LoginEmail url={url} />,
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.userId = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verifyRequest=1",
  },
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
