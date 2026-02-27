"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

const sections = [
  {
    title: "Posts",
    description: "Manage blog posts",
    href: "/admin/posts",
  },
  {
    title: "Projects",
    description: "Manage portfolio projects",
    href: "/admin/experience",
  },
  {
    title: "Skills",
    description: "Manage skill categories",
    href: "/admin/skills",
  },
];

export default function AdminDashboard() {
  const posts = useQuery(api.posts.listAll);
  const experiences = useQuery(api.experiences.list);
  const skills = useQuery(api.skills.list);
  const seed = useMutation(api.seed.run);
  const seedPosts = useMutation(api.seed.seedPosts);

  const counts: Record<string, number | undefined> = {
    Posts: posts?.length,
    Projects: experiences?.length,
    Skills: skills?.length,
  };

  const isEmpty =
    (experiences?.length ?? 0) === 0 &&
    (skills?.length ?? 0) === 0;

  const noPosts = (posts?.length ?? 0) === 0;

  const handleSeed = async () => {
    try {
      await seed();
      toast.success("Dummy data seeded!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to seed");
    }
  };

  const handleSeedPosts = async () => {
    try {
      const result = await seedPosts();
      toast.success(result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to seed posts");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex gap-2">
          {isEmpty && (
            <Button variant="outline" size="sm" onClick={() => void handleSeed()}>
              Seed dummy data
            </Button>
          )}
          {noPosts && (
            <Button variant="outline" size="sm" onClick={() => void handleSeedPosts()}>
              Seed blog posts
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  {counts[s.title] !== undefined && (
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {counts[s.title]} items
                    </span>
                  )}
                </div>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
