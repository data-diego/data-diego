"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              A sign-in link has been sent to your email address.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              const formData = new FormData(e.target as HTMLFormElement);
              void signIn("resend", formData)
                .then(() => setSent(true))
                .catch((err) => {
                  setError(err.message);
                  setLoading(false);
                });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send sign-in link"}
            </Button>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
