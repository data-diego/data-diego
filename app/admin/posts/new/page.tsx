"use client";

import { PostEditor } from "@/components/admin/post-editor";

export default function NewPostPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">New post</h2>
      <PostEditor />
    </div>
  );
}
