import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import { Resend as ResendAPI } from "resend";

function getAllowedEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend({
      from: "DataDiego <mailer@datadiego.com>",
      async sendVerificationRequest({ identifier, url, provider }) {
        const allowed = getAllowedEmails();
        if (!allowed.includes(identifier.toLowerCase())) {
          throw new Error("Unauthorized email address");
        }
        const resend = new ResendAPI(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: provider.from as string,
          to: identifier,
          subject: "Sign in to datadiego.com",
          html: `<p>Click <a href="${url}">here</a> to sign in to your admin dashboard.</p>`,
        });
      },
    }),
  ],
});
