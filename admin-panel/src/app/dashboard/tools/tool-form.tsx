"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TagInput } from "@/components/admin/tag-input";
import { FaqEditor } from "@/components/admin/faq-editor";
import { slugify } from "@/lib/utils";
import type { Category, Tool, ToolInput } from "@/lib/types";

const emptyForm: ToolInput = {
  name: "",
  slug: "",
  logoUrl: "",
  description: "",
  fullDescription: "",
  categoryId: "",
  pricing: "Free",
  websiteUrl: "",
  tags: [],
  features: [],
  pros: [],
  cons: [],
  faq: [],
  featured: false,
  trending: false,
};

export function ToolForm({
  categories,
  tool,
}: {
  categories: Category[];
  tool?: Tool;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ToolInput>(
    tool
      ? {
          name: tool.name,
          slug: tool.slug,
          logoUrl: tool.logoUrl,
          description: tool.description,
          fullDescription: tool.fullDescription,
          categoryId: tool.categoryId ?? "",
          pricing: tool.pricing,
          websiteUrl: tool.websiteUrl,
          tags: tool.tags,
          features: tool.features,
          pros: tool.pros,
          cons: tool.cons,
          faq: tool.faq,
          featured: tool.featured,
          trending: tool.trending,
        }
      : emptyForm,
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(tool));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ToolInput>(key: K, value: ToolInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const url = tool ? `/api/tools/${tool.id}` : "/api/tools";
      const method = tool ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save tool");
        return;
      }
      router.push("/dashboard/tools");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-semibold text-foreground">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  set("name", name);
                  if (!slugTouched) set("slug", slugify(name));
                }}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              placeholder="https://…"
              value={form.logoUrl}
              onChange={(e) => set("logoUrl", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              required
              maxLength={280}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="One sentence summary shown on cards"
            />
          </div>
          <div>
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              placeholder="Detailed description shown on the tool's detail page"
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-semibold text-foreground">Classification</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="pricing">Pricing</Label>
              <Select id="pricing" value={form.pricing} onChange={(e) => set("pricing", e.target.value as ToolInput["pricing"])}>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="websiteUrl">Official Website</Label>
            <Input
              id="websiteUrl"
              type="url"
              required
              placeholder="https://…"
              value={form.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <TagInput values={form.tags} onChange={(tags) => set("tags", tags)} placeholder="Add a tag…" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-semibold text-foreground">Details</h2>
          <div>
            <Label>Key Features</Label>
            <TagInput values={form.features} onChange={(features) => set("features", features)} placeholder="Add a feature…" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Pros</Label>
              <TagInput values={form.pros} onChange={(pros) => set("pros", pros)} placeholder="Add a pro…" />
            </div>
            <div>
              <Label>Cons</Label>
              <TagInput values={form.cons} onChange={(cons) => set("cons", cons)} placeholder="Add a con…" />
            </div>
          </div>
          <div>
            <Label>FAQ</Label>
            <FaqEditor items={form.faq} onChange={(faq) => set("faq", faq)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1">
          <h2 className="mb-2 font-semibold text-foreground">Visibility</h2>
          <Switch
            id="featured"
            checked={form.featured}
            onChange={(v) => set("featured", v)}
            label="Featured"
            description="Show in the homepage featured section"
          />
          <Switch
            id="trending"
            checked={form.trending}
            onChange={(v) => set("trending", v)}
            label="Trending"
            description="Show in the trending tools section"
          />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/tools")}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : tool ? "Save Changes" : "Add AI Tool"}
        </Button>
      </div>
    </form>
  );
}
