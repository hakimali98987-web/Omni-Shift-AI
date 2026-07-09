import { db, pool, categoriesTable, toolsTable } from "@workspace/db";

type CategorySeed = {
  slug: string;
  name: string;
  icon: string;
  description: string;
};

type ToolSeed = {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  domain: string;
  officialWebsite: string;
  category: string;
  pricing: "Free" | "Freemium" | "Paid";
  featured: boolean;
  rating: number;
  tags: string[];
  launchYear: number;
};

const categories: CategorySeed[] = [
  { slug: "chatbots", name: "Chatbots & Assistants", icon: "MessageSquare", description: "Conversational AI assistants for work and life." },
  { slug: "writing", name: "Writing & Content", icon: "PenLine", description: "AI copywriting, editing, and content generation tools." },
  { slug: "image-generation", name: "Image Generation", icon: "Image", description: "Create and edit images with generative AI." },
  { slug: "video", name: "Video", icon: "Video", description: "AI tools for generating and editing video." },
  { slug: "audio-music", name: "Audio & Music", icon: "Music", description: "Voice, music, and audio generation tools." },
  { slug: "coding", name: "Coding & Dev Tools", icon: "Code2", description: "AI pair programmers and developer productivity tools." },
  { slug: "productivity", name: "Productivity", icon: "CheckSquare", description: "AI-powered task, note, and workflow tools." },
  { slug: "design", name: "Design", icon: "Palette", description: "AI-assisted design and UI tools." },
  { slug: "marketing", name: "Marketing & SEO", icon: "Megaphone", description: "AI tools for marketing, ads, and SEO." },
  { slug: "research-data", name: "Research & Data", icon: "Search", description: "AI research assistants and data analysis tools." },
  { slug: "customer-support", name: "Customer Support", icon: "Headset", description: "AI chatbots and helpdesk automation." },
  { slug: "3d-avatars", name: "3D & Avatars", icon: "Box", description: "AI tools for 3D content and virtual avatars." },
];

// 20 real, well-known AI tools — one row per required field: id (generated),
// name, slug, logo (derived from domain via Clearbit), short_description,
// full_description, category, pricing, official_website, featured, rating,
// tags, launch_year.
const tools: ToolSeed[] = [
  { slug: "chatgpt", name: "ChatGPT", shortDescription: "Conversational AI assistant for writing, coding, and answering questions.", fullDescription: "ChatGPT by OpenAI is a general-purpose conversational assistant capable of writing, coding, brainstorming, and answering questions across almost any domain, with plugin and custom-GPT support.", domain: "chat.openai.com", officialWebsite: "https://chat.openai.com", category: "chatbots", pricing: "Freemium", featured: true, rating: 4.8, tags: ["assistant", "gpt", "openai"], launchYear: 2022 },
  { slug: "claude", name: "Claude", shortDescription: "Anthropic's AI assistant known for careful reasoning and long context.", fullDescription: "Claude is Anthropic's AI assistant, tuned for helpful, harmless, and honest conversations with strong long-context reasoning and document analysis.", domain: "claude.ai", officialWebsite: "https://claude.ai", category: "chatbots", pricing: "Freemium", featured: true, rating: 4.8, tags: ["assistant", "anthropic", "reasoning"], launchYear: 2023 },
  { slug: "gemini", name: "Gemini", shortDescription: "Google's multimodal AI assistant integrated across its products.", fullDescription: "Gemini is Google's multimodal AI model family, powering an assistant that can reason across text, images, and code, with deep integration into Google Workspace.", domain: "gemini.google.com", officialWebsite: "https://gemini.google.com", category: "chatbots", pricing: "Freemium", featured: false, rating: 4.6, tags: ["assistant", "google", "multimodal"], launchYear: 2023 },
  { slug: "perplexity", name: "Perplexity", shortDescription: "AI answer engine that cites sources for every response.", fullDescription: "Perplexity is an AI-powered search and answer engine that provides cited, up-to-date answers by combining large language models with real-time web search.", domain: "perplexity.ai", officialWebsite: "https://www.perplexity.ai", category: "chatbots", pricing: "Freemium", featured: false, rating: 4.7, tags: ["search", "answers", "citations"], launchYear: 2022 },
  { slug: "jasper", name: "Jasper", shortDescription: "AI writing platform for marketing teams and brand content.", fullDescription: "Jasper is an AI content platform built for marketing teams, offering brand voice controls, templates, and workflows for blogs, ads, and social copy.", domain: "jasper.ai", officialWebsite: "https://www.jasper.ai", category: "writing", pricing: "Paid", featured: true, rating: 4.5, tags: ["copywriting", "marketing"], launchYear: 2021 },
  { slug: "grammarly", name: "Grammarly", shortDescription: "AI writing assistant for grammar, tone, and clarity.", fullDescription: "Grammarly checks grammar, spelling, tone, and clarity in real time across browsers and apps, with AI-powered rewrite suggestions.", domain: "grammarly.com", officialWebsite: "https://www.grammarly.com", category: "writing", pricing: "Freemium", featured: false, rating: 4.6, tags: ["grammar", "editing"], launchYear: 2009 },
  { slug: "notion-ai", name: "Notion AI", shortDescription: "AI writing and knowledge assistant built into Notion.", fullDescription: "Notion AI adds writing, summarization, and Q&A capabilities directly into Notion workspaces, helping teams draft and organize knowledge faster.", domain: "notion.so", officialWebsite: "https://www.notion.so/product/ai", category: "writing", pricing: "Paid", featured: false, rating: 4.5, tags: ["notes", "knowledge"], launchYear: 2023 },
  { slug: "midjourney", name: "Midjourney", shortDescription: "AI image generator known for artistic, high-fidelity output.", fullDescription: "Midjourney generates highly detailed, artistic images from text prompts, widely used by designers and artists for concept art and illustration.", domain: "midjourney.com", officialWebsite: "https://www.midjourney.com", category: "image-generation", pricing: "Paid", featured: true, rating: 4.8, tags: ["art", "text-to-image"], launchYear: 2022 },
  { slug: "dalle", name: "DALL·E", shortDescription: "OpenAI's text-to-image generation model.", fullDescription: "DALL·E, by OpenAI, generates and edits images from natural language descriptions and is integrated into ChatGPT for conversational image creation.", domain: "openai.com", officialWebsite: "https://openai.com/dall-e-3", category: "image-generation", pricing: "Freemium", featured: true, rating: 4.6, tags: ["text-to-image", "openai"], launchYear: 2021 },
  { slug: "stable-diffusion", name: "Stable Diffusion", shortDescription: "Open-source text-to-image diffusion model.", fullDescription: "Stable Diffusion is an open-source latent diffusion model for generating images from text, widely used for self-hosting and fine-tuning custom models.", domain: "stability.ai", officialWebsite: "https://stability.ai/stable-diffusion", category: "image-generation", pricing: "Free", featured: false, rating: 4.5, tags: ["open-source", "text-to-image"], launchYear: 2022 },
  { slug: "runway", name: "Runway", shortDescription: "AI video generation and editing suite for creators.", fullDescription: "Runway offers a suite of AI-powered video tools including text-to-video generation, green screen removal, and motion tracking for creators and studios.", domain: "runwayml.com", officialWebsite: "https://runwayml.com", category: "video", pricing: "Freemium", featured: true, rating: 4.6, tags: ["text-to-video", "editing"], launchYear: 2018 },
  { slug: "synthesia", name: "Synthesia", shortDescription: "Create AI avatar videos from text in minutes.", fullDescription: "Synthesia turns text scripts into professional videos featuring AI avatars and voiceovers in dozens of languages, popular for training content.", domain: "synthesia.io", officialWebsite: "https://www.synthesia.io", category: "video", pricing: "Paid", featured: false, rating: 4.5, tags: ["avatars", "training-video"], launchYear: 2017 },
  { slug: "elevenlabs", name: "ElevenLabs", shortDescription: "Realistic AI voice generation and cloning platform.", fullDescription: "ElevenLabs provides state-of-the-art text-to-speech and voice cloning, used for audiobooks, dubbing, and conversational voice agents.", domain: "elevenlabs.io", officialWebsite: "https://elevenlabs.io", category: "audio-music", pricing: "Freemium", featured: true, rating: 4.7, tags: ["voice-cloning", "tts"], launchYear: 2022 },
  { slug: "suno", name: "Suno", shortDescription: "AI music generator that creates full songs from text prompts.", fullDescription: "Suno generates complete songs — including vocals, lyrics, and instrumentation — from simple text prompts, popular for quick music creation.", domain: "suno.com", officialWebsite: "https://suno.com", category: "audio-music", pricing: "Freemium", featured: false, rating: 4.5, tags: ["music", "text-to-song"], launchYear: 2023 },
  { slug: "github-copilot", name: "GitHub Copilot", shortDescription: "AI pair programmer that autocompletes code in your editor.", fullDescription: "GitHub Copilot suggests code completions, entire functions, and chat-based assistance directly in the editor, trained on billions of lines of code.", domain: "github.com", officialWebsite: "https://github.com/features/copilot", category: "coding", pricing: "Paid", featured: true, rating: 4.6, tags: ["autocomplete", "github"], launchYear: 2021 },
  { slug: "cursor", name: "Cursor", shortDescription: "AI-first code editor built for pair programming with AI.", fullDescription: "Cursor is a code editor built around AI pair programming, offering multi-file edits, chat, and codebase-aware completions.", domain: "cursor.com", officialWebsite: "https://www.cursor.com", category: "coding", pricing: "Freemium", featured: true, rating: 4.7, tags: ["editor", "ai-native"], launchYear: 2023 },
  { slug: "replit-ai", name: "Replit AI", shortDescription: "AI app builder and coding assistant inside Replit.", fullDescription: "Replit's Agent and Assistant help build, debug, and deploy full-stack apps directly in the browser, from natural-language prompts to running software.", domain: "replit.com", officialWebsite: "https://replit.com", category: "coding", pricing: "Freemium", featured: false, rating: 4.6, tags: ["app-builder", "cloud-ide"], launchYear: 2023 },
  { slug: "notion", name: "Notion", shortDescription: "All-in-one workspace with AI-powered notes and docs.", fullDescription: "Notion combines notes, docs, wikis, and project management in one workspace, now enhanced with AI writing and search features.", domain: "notion.so", officialWebsite: "https://www.notion.so", category: "productivity", pricing: "Freemium", featured: false, rating: 4.6, tags: ["notes", "workspace"], launchYear: 2016 },
  { slug: "canva-magic-studio", name: "Canva Magic Studio", shortDescription: "Suite of AI design tools built into Canva.", fullDescription: "Canva Magic Studio bundles AI features — text-to-image, background removal, magic write, and more — into Canva's design platform.", domain: "canva.com", officialWebsite: "https://www.canva.com/magic-studio", category: "design", pricing: "Freemium", featured: true, rating: 4.6, tags: ["templates", "graphic-design"], launchYear: 2023 },
  { slug: "surfer-seo", name: "Surfer SEO", shortDescription: "AI-powered SEO content optimization tool.", fullDescription: "Surfer SEO analyzes top-ranking pages and provides AI-driven content briefs and on-page optimization guidance to improve search rankings.", domain: "surferseo.com", officialWebsite: "https://surferseo.com", category: "marketing", pricing: "Paid", featured: false, rating: 4.5, tags: ["seo", "content-optimization"], launchYear: 2017 },
];

async function seed() {
  await db.transaction(async (tx) => {
    // Reset to exactly the 20 curated tools below (idempotent full reseed).
    await tx.delete(toolsTable);
    await tx.delete(categoriesTable);

    const categoryIdBySlug = new Map<string, number>();

    for (const c of categories) {
      const [row] = await tx
        .insert(categoriesTable)
        .values({ slug: c.slug, name: c.name, icon: c.icon, description: c.description })
        .onConflictDoUpdate({
          target: categoriesTable.slug,
          set: { name: c.name, icon: c.icon, description: c.description },
        })
        .returning();
      categoryIdBySlug.set(c.slug, row.id);
    }

    for (const t of tools) {
      const categoryId = categoryIdBySlug.get(t.category);
      if (!categoryId) {
        throw new Error(`Tool ${t.slug} references unknown category ${t.category}`);
      }
      const values = {
        slug: t.slug,
        name: t.name,
        description: t.shortDescription,
        longDescription: t.fullDescription,
        logoUrl: `https://logo.clearbit.com/${t.domain}`,
        websiteUrl: t.officialWebsite,
        categoryId,
        pricing: t.pricing,
        featured: t.featured,
        rating: t.rating,
        tags: t.tags,
        launchYear: t.launchYear,
      };
      await tx
        .insert(toolsTable)
        .values(values)
        .onConflictDoUpdate({ target: toolsTable.slug, set: values });
    }
  });

  console.log(`Seeded ${categories.length} categories and ${tools.length} tools.`);
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
