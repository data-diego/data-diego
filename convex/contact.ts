"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { Resend } from "resend";

export const send = action({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (_, { name, email, message }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "info@datadiego.com",
      replyTo: email,
      subject: `Contact from ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });
  },
});
