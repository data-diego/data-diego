"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { Doc, Id } from "@/convex/_generated/dataModel";

export default function AdminPage() {
  const posts = useQuery(api.posts.listAll) as Doc<"posts">[] | undefined;
  const removePost = useMutation(api.posts.remove);

  const handleDelete = async (id: Id<"posts">, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await removePost({ id });
    toast.success("Post deleted");
  };

  if (posts === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Posts</h2>
        <Button asChild>
          <Link href="/admin/posts/new">New post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet.</p>
            <Button asChild>
              <Link href="/admin/posts/new">Create your first post</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {post.title}
                      </CardTitle>
                      <Badge
                        variant={post.published ? "default" : "secondary"}
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      /{post.slug}
                      {post.publishedAt && (
                        <>
                          {" "}
                          &middot;{" "}
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts/${post._id}/edit`}>Edit</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete(post._id, post.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
