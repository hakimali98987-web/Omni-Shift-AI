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
  keyFeatures: string[];
  pros: string[];
  cons: string[];
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
  { slug: "chatgpt", name: "ChatGPT", shortDescription: "Conversational AI assistant for writing, coding, and answering questions.", fullDescription: "ChatGPT by OpenAI is a general-purpose conversational assistant capable of writing, coding, brainstorming, and answering questions across almost any domain, with plugin and custom-GPT support.", domain: "chat.openai.com", officialWebsite: "https://chat.openai.com", category: "chatbots", pricing: "Freemium", featured: true, rating: 4.8, tags: ["assistant", "gpt", "openai"], launchYear: 2022,
    keyFeatures: ["Natural conversation across text, voice, and images", "Custom GPTs for specialized workflows", "Code interpreter and data analysis", "Web browsing and real-time information", "Memory across conversations"],
    pros: ["Extremely versatile across use cases", "Large plugin and integration ecosystem", "Frequent model upgrades", "Strong free tier"],
    cons: ["Can produce confident but incorrect answers", "Usage limits on free tier", "Advanced features require paid plan"] },
  { slug: "claude", name: "Claude", shortDescription: "Anthropic's AI assistant known for careful reasoning and long context.", fullDescription: "Claude is Anthropic's AI assistant, tuned for helpful, harmless, and honest conversations with strong long-context reasoning and document analysis.", domain: "claude.ai", officialWebsite: "https://claude.ai", category: "chatbots", pricing: "Freemium", featured: true, rating: 4.8, tags: ["assistant", "anthropic", "reasoning"], launchYear: 2023,
    keyFeatures: ["Very long context window for large documents", "Artifacts for interactive content generation", "Strong coding and reasoning ability", "Careful, well-calibrated responses"],
    pros: ["Excellent at nuanced reasoning and writing", "Handles very long documents well", "Thoughtful, less prone to harmful outputs"],
    cons: ["Slower response times on complex tasks", "Fewer third-party integrations than competitors", "No native image generation"] },
  { slug: "gemini", name: "Gemini", shortDescription: "Google's multimodal AI assistant integrated across its products.", fullDescription: "Gemini is Google's multimodal AI model family, powering an assistant that can reason across text, images, and code, with deep integration into Google Workspace.", domain: "gemini.google.com", officialWebsite: "https://gemini.google.com", category: "chatbots", pricing: "Freemium", featured: false, rating: 4.6, tags: ["assistant", "google", "multimodal"], launchYear: 2023,
    keyFeatures: ["Deep integration with Gmail, Docs, and Sheets", "Multimodal understanding of text, image, and video", "Real-time Google Search grounding", "Extensions for third-party apps"],
    pros: ["Seamless Google Workspace integration", "Strong multimodal capabilities", "Generous free tier"],
    cons: ["Response quality can vary by task", "Some features limited to Google One subscribers", "Less consistent tone than competitors"] },
  { slug: "perplexity", name: "Perplexity", shortDescription: "AI answer engine that cites sources for every response.", fullDescription: "Perplexity is an AI-powered search and answer engine that provides cited, up-to-date answers by combining large language models with real-time web search.", domain: "perplexity.ai", officialWebsite: "https://www.perplexity.ai", category: "chatbots", pricing: "Freemium", featured: false, rating: 4.7, tags: ["search", "answers", "citations"], launchYear: 2022,
    keyFeatures: ["Cited sources for every answer", "Real-time web search grounding", "Focus modes for academic, coding, and more", "Follow-up question threading"],
    pros: ["Transparent, verifiable sourcing", "Fast, up-to-date answers", "Clean, distraction-free interface"],
    cons: ["Less creative writing ability than general chatbots", "Pro search limits on free tier", "Occasional source misattribution"] },
  { slug: "jasper", name: "Jasper", shortDescription: "AI writing platform for marketing teams and brand content.", fullDescription: "Jasper is an AI content platform built for marketing teams, offering brand voice controls, templates, and workflows for blogs, ads, and social copy.", domain: "jasper.ai", officialWebsite: "https://www.jasper.ai", category: "writing", pricing: "Paid", featured: true, rating: 4.5, tags: ["copywriting", "marketing"], launchYear: 2021,
    keyFeatures: ["Brand voice and style guardrails", "Templates for ads, blogs, and social posts", "Team collaboration workflows", "Built-in plagiarism checking"],
    pros: ["Purpose-built for marketing teams", "Strong brand consistency controls", "Wide template library"],
    cons: ["No free tier", "Steeper learning curve for full feature set", "Pricier than general-purpose assistants"] },
  { slug: "grammarly", name: "Grammarly", shortDescription: "AI writing assistant for grammar, tone, and clarity.", fullDescription: "Grammarly checks grammar, spelling, tone, and clarity in real time across browsers and apps, with AI-powered rewrite suggestions.", domain: "grammarly.com", officialWebsite: "https://www.grammarly.com", category: "writing", pricing: "Freemium", featured: false, rating: 4.6, tags: ["grammar", "editing"], launchYear: 2009,
    keyFeatures: ["Real-time grammar and spelling checks", "Tone detection and adjustment", "Browser extension and desktop app", "AI-powered full rewrites"],
    pros: ["Works nearly everywhere you type", "Very accurate grammar suggestions", "Easy to use for all skill levels"],
    cons: ["Advanced tone/style features need premium", "Can be overly conservative with suggestions", "Occasional false positives"] },
  { slug: "notion-ai", name: "Notion AI", shortDescription: "AI writing and knowledge assistant built into Notion.", fullDescription: "Notion AI adds writing, summarization, and Q&A capabilities directly into Notion workspaces, helping teams draft and organize knowledge faster.", domain: "notion.so", officialWebsite: "https://www.notion.so/product/ai", category: "writing", pricing: "Paid", featured: false, rating: 4.5, tags: ["notes", "knowledge"], launchYear: 2023,
    keyFeatures: ["In-line writing and editing assistance", "Workspace-wide Q&A search", "Meeting notes summarization", "Action item extraction"],
    pros: ["Works directly inside existing Notion docs", "Saves time summarizing long pages", "No app-switching required"],
    cons: ["Requires an existing Notion subscription", "Add-on pricing on top of Notion plan", "Limited outside the Notion ecosystem"] },
  { slug: "midjourney", name: "Midjourney", shortDescription: "AI image generator known for artistic, high-fidelity output.", fullDescription: "Midjourney generates highly detailed, artistic images from text prompts, widely used by designers and artists for concept art and illustration.", domain: "midjourney.com", officialWebsite: "https://www.midjourney.com", category: "image-generation", pricing: "Paid", featured: true, rating: 4.8, tags: ["art", "text-to-image"], launchYear: 2022,
    keyFeatures: ["Highly detailed, artistic image generation", "Style and aspect ratio controls", "Image upscaling and variations", "Character and style consistency tools"],
    pros: ["Best-in-class artistic image quality", "Active, creative community", "Frequent model improvements"],
    cons: ["No free tier", "Discord-based workflow can be unintuitive", "Less precise than some competitors for photorealism"] },
  { slug: "dalle", name: "DALL·E", shortDescription: "OpenAI's text-to-image generation model.", fullDescription: "DALL·E, by OpenAI, generates and edits images from natural language descriptions and is integrated into ChatGPT for conversational image creation.", domain: "openai.com", officialWebsite: "https://openai.com/dall-e-3", category: "image-generation", pricing: "Freemium", featured: true, rating: 4.6, tags: ["text-to-image", "openai"], launchYear: 2021,
    keyFeatures: ["Conversational image generation via ChatGPT", "Precise prompt-following", "In-painting and image editing", "Consistent text rendering in images"],
    pros: ["Easy conversational workflow", "Good prompt accuracy", "Integrated with ChatGPT for iteration"],
    cons: ["Less artistic flair than Midjourney", "Usage limits tied to ChatGPT plan", "Content policy can restrict some prompts"] },
  { slug: "stable-diffusion", name: "Stable Diffusion", shortDescription: "Open-source text-to-image diffusion model.", fullDescription: "Stable Diffusion is an open-source latent diffusion model for generating images from text, widely used for self-hosting and fine-tuning custom models.", domain: "stability.ai", officialWebsite: "https://stability.ai/stable-diffusion", category: "image-generation", pricing: "Free", featured: false, rating: 4.5, tags: ["open-source", "text-to-image"], launchYear: 2022,
    keyFeatures: ["Open-source and self-hostable", "Custom model fine-tuning (LoRA/Dreambooth)", "Large community model and plugin ecosystem", "Runs locally with no usage caps"],
    pros: ["Free and fully customizable", "No content restrictions when self-hosted", "Massive community tooling (ComfyUI, Automatic1111)"],
    cons: ["Requires technical setup to self-host", "Needs a capable GPU for good performance", "Steeper learning curve than hosted tools"] },
  { slug: "runway", name: "Runway", shortDescription: "AI video generation and editing suite for creators.", fullDescription: "Runway offers a suite of AI-powered video tools including text-to-video generation, green screen removal, and motion tracking for creators and studios.", domain: "runwayml.com", officialWebsite: "https://runwayml.com", category: "video", pricing: "Freemium", featured: true, rating: 4.6, tags: ["text-to-video", "editing"], launchYear: 2018,
    keyFeatures: ["Text-to-video and image-to-video generation", "AI green screen and background removal", "Motion tracking and object removal", "Collaborative in-browser video editor"],
    pros: ["Cutting-edge generative video quality", "Wide range of AI editing tools in one place", "Browser-based, no installation needed"],
    cons: ["Credits-based pricing can add up", "Generation times can be slow", "Learning curve for advanced features"] },
  { slug: "synthesia", name: "Synthesia", shortDescription: "Create AI avatar videos from text in minutes.", fullDescription: "Synthesia turns text scripts into professional videos featuring AI avatars and voiceovers in dozens of languages, popular for training content.", domain: "synthesia.io", officialWebsite: "https://www.synthesia.io", category: "video", pricing: "Paid", featured: false, rating: 4.5, tags: ["avatars", "training-video"], launchYear: 2017,
    keyFeatures: ["120+ AI avatars and voices", "Text-to-video in 140+ languages", "Custom avatar creation", "Screen recording and templates"],
    pros: ["Fast turnaround for training/explainer videos", "No cameras or actors needed", "Wide language support"],
    cons: ["No free tier", "Avatars can still look synthetic in close-ups", "Limited creative/cinematic flexibility"] },
  { slug: "elevenlabs", name: "ElevenLabs", shortDescription: "Realistic AI voice generation and cloning platform.", fullDescription: "ElevenLabs provides state-of-the-art text-to-speech and voice cloning, used for audiobooks, dubbing, and conversational voice agents.", domain: "elevenlabs.io", officialWebsite: "https://elevenlabs.io", category: "audio-music", pricing: "Freemium", featured: true, rating: 4.7, tags: ["voice-cloning", "tts"], launchYear: 2022,
    keyFeatures: ["Ultra-realistic text-to-speech", "Instant voice cloning", "Multilingual dubbing", "Conversational voice agent API"],
    pros: ["Industry-leading voice realism", "Fast cloning from short samples", "Robust developer API"],
    cons: ["Cloning raises misuse/ethical concerns", "Character limits on lower tiers", "Costs scale quickly at high volume"] },
  { slug: "suno", name: "Suno", shortDescription: "AI music generator that creates full songs from text prompts.", fullDescription: "Suno generates complete songs — including vocals, lyrics, and instrumentation — from simple text prompts, popular for quick music creation.", domain: "suno.com", officialWebsite: "https://suno.com", category: "audio-music", pricing: "Freemium", featured: false, rating: 4.5, tags: ["music", "text-to-song"], launchYear: 2023,
    keyFeatures: ["Full song generation with vocals and lyrics", "Style and genre prompting", "Song extension and remixing", "Instrumental-only mode"],
    pros: ["Extremely fast, fun song creation", "No musical training required", "Surprising quality for casual use"],
    cons: ["Commercial rights require paid plan", "Copyright and originality questions remain", "Limited fine-grained arrangement control"] },
  { slug: "github-copilot", name: "GitHub Copilot", shortDescription: "AI pair programmer that autocompletes code in your editor.", fullDescription: "GitHub Copilot suggests code completions, entire functions, and chat-based assistance directly in the editor, trained on billions of lines of code.", domain: "github.com", officialWebsite: "https://github.com/features/copilot", category: "coding", pricing: "Paid", featured: true, rating: 4.6, tags: ["autocomplete", "github"], launchYear: 2021,
    keyFeatures: ["Inline code completion in real time", "Chat-based coding assistant", "Pull request summaries", "Works across major IDEs"],
    pros: ["Deep GitHub and IDE integration", "Speeds up boilerplate and repetitive code", "Supports most popular languages"],
    cons: ["No permanent free tier for individuals", "Suggestions need review for correctness", "Can encourage over-reliance on autocomplete"] },
  { slug: "cursor", name: "Cursor", shortDescription: "AI-first code editor built for pair programming with AI.", fullDescription: "Cursor is a code editor built around AI pair programming, offering multi-file edits, chat, and codebase-aware completions.", domain: "cursor.com", officialWebsite: "https://www.cursor.com", category: "coding", pricing: "Freemium", featured: true, rating: 4.7, tags: ["editor", "ai-native"], launchYear: 2023,
    keyFeatures: ["Multi-file AI-driven edits", "Codebase-aware chat and search", "One-click apply for suggested changes", "Built on familiar VS Code experience"],
    pros: ["Feels like a natural VS Code upgrade", "Excellent for large refactors", "Fast iteration loop with AI"],
    cons: ["Heavier usage needs a paid plan", "Can be resource-intensive on large repos", "Occasional inaccurate multi-file edits"] },
  { slug: "replit-ai", name: "Replit AI", shortDescription: "AI app builder and coding assistant inside Replit.", fullDescription: "Replit's Agent and Assistant help build, debug, and deploy full-stack apps directly in the browser, from natural-language prompts to running software.", domain: "replit.com", officialWebsite: "https://replit.com", category: "coding", pricing: "Freemium", featured: false, rating: 4.6, tags: ["app-builder", "cloud-ide"], launchYear: 2023,
    keyFeatures: ["Natural-language app building end-to-end", "Built-in hosting and deployment", "Autonomous debugging and testing", "Cloud IDE with no local setup"],
    pros: ["Goes from idea to deployed app quickly", "No environment setup required", "Great for prototyping and learning"],
    cons: ["Complex apps may need manual fine-tuning", "Usage-based pricing for heavier workloads", "Less control than a local dev environment"] },
  { slug: "notion", name: "Notion", shortDescription: "All-in-one workspace with AI-powered notes and docs.", fullDescription: "Notion combines notes, docs, wikis, and project management in one workspace, now enhanced with AI writing and search features.", domain: "notion.so", officialWebsite: "https://www.notion.so", category: "productivity", pricing: "Freemium", featured: false, rating: 4.6, tags: ["notes", "workspace"], launchYear: 2016,
    keyFeatures: ["Flexible docs, wikis, and databases", "Team project and task management", "Templates for nearly any workflow", "AI-powered search and writing add-on"],
    pros: ["Extremely flexible and customizable", "Great for both personal and team use", "Large template and integration ecosystem"],
    cons: ["Can be overwhelming to set up well", "Performance lags with very large workspaces", "AI features are a paid add-on"] },
  { slug: "canva-magic-studio", name: "Canva Magic Studio", shortDescription: "Suite of AI design tools built into Canva.", fullDescription: "Canva Magic Studio bundles AI features — text-to-image, background removal, magic write, and more — into Canva's design platform.", domain: "canva.com", officialWebsite: "https://www.canva.com/magic-studio", category: "design", pricing: "Freemium", featured: true, rating: 4.6, tags: ["templates", "graphic-design"], launchYear: 2023,
    keyFeatures: ["AI text-to-image generation in-editor", "One-click background removal", "Magic Write copy generation", "Auto-resize for any platform"],
    pros: ["Beginner-friendly, no design skill needed", "Huge template library", "AI features integrated directly into workflow"],
    cons: ["Best AI features require Canva Pro", "Less control than dedicated design tools", "Generated assets can look generic"] },
  { slug: "surfer-seo", name: "Surfer SEO", shortDescription: "AI-powered SEO content optimization tool.", fullDescription: "Surfer SEO analyzes top-ranking pages and provides AI-driven content briefs and on-page optimization guidance to improve search rankings.", domain: "surferseo.com", officialWebsite: "https://surferseo.com", category: "marketing", pricing: "Paid", featured: false, rating: 4.5, tags: ["seo", "content-optimization"], launchYear: 2017,
    keyFeatures: ["Content editor with live SEO scoring", "Automated content briefs and outlines", "SERP competitor analysis", "Keyword clustering and research"],
    pros: ["Data-driven, actionable SEO guidance", "Speeds up content brief creation", "Integrates with Google Docs and WordPress"],
    cons: ["No free tier", "Can encourage keyword-stuffing if overused", "Learning curve for new SEO writers"] },
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
        keyFeatures: t.keyFeatures,
        pros: t.pros,
        cons: t.cons,
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
