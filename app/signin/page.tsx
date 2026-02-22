"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
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
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {flow === "signIn" ? "Sign in" : "Create account"}
          </CardTitle>
          <CardDescription>
            {flow === "signIn"
              ? "Sign in to access the admin dashboard"
              : "Create an account to get started"}
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
              formData.set("flow", flow);
              void signIn("password", formData)
                .catch((error) => {
                  setError(error.message);
                  setLoading(false);
                })
                .then(() => {
                  router.push("/admin");
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                minLength={8}
                required
              />
              {flow === "signUp" && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading
                ? "Loading..."
                : flow === "signIn"
                  ? "Sign in"
                  : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {flow === "signIn"
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                type="button"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                onClick={() =>
                  setFlow(flow === "signIn" ? "signUp" : "signIn")
                }
              >
                {flow === "signIn" ? "Sign up" : "Sign in"}
              </button>
            </div>
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
