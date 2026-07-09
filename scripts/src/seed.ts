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
  description: string;
  longDescription: string;
  domain: string;
  websiteUrl: string;
  category: string;
  pricing: "Free" | "Freemium" | "Paid";
  featured?: boolean;
  rating: number;
  tags: string[];
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

const tools: ToolSeed[] = [
  // Chatbots & Assistants
  { slug: "chatgpt", name: "ChatGPT", description: "Conversational AI assistant for writing, coding, and answering questions.", longDescription: "ChatGPT by OpenAI is a general-purpose conversational assistant capable of writing, coding, brainstorming, and answering questions across almost any domain, with plugin and custom-GPT support.", domain: "chat.openai.com", websiteUrl: "https://chat.openai.com", category: "chatbots", pricing: "Freemium", featured: true, rating: 4.8, tags: ["assistant", "gpt", "openai"] },
  { slug: "claude", name: "Claude", description: "Anthropic's AI assistant known for careful reasoning and long context.", longDescription: "Claude is Anthropic's AI assistant, tuned for helpful, harmless, and honest conversations with strong long-context reasoning and document analysis.", domain: "claude.ai", websiteUrl: "https://claude.ai", category: "chatbots", pricing: "Freemium", featured: true, rating: 4.8, tags: ["assistant", "anthropic", "reasoning"] },
  { slug: "gemini", name: "Gemini", description: "Google's multimodal AI assistant integrated across its products.", longDescription: "Gemini is Google's multimodal AI model family, powering an assistant that can reason across text, images, and code, with deep integration into Google Workspace.", domain: "gemini.google.com", websiteUrl: "https://gemini.google.com", category: "chatbots", pricing: "Freemium", rating: 4.6, tags: ["assistant", "google", "multimodal"] },
  { slug: "perplexity", name: "Perplexity", description: "AI answer engine that cites sources for every response.", longDescription: "Perplexity is an AI-powered search and answer engine that provides cited, up-to-date answers by combining large language models with real-time web search.", domain: "perplexity.ai", websiteUrl: "https://www.perplexity.ai", category: "chatbots", pricing: "Freemium", rating: 4.7, tags: ["search", "answers", "citations"] },
  { slug: "poe", name: "Poe", description: "Platform to chat with many different AI models in one place.", longDescription: "Poe by Quora lets users access and chat with a wide variety of AI models — including GPT, Claude, and Gemini — from a single unified interface.", domain: "poe.com", websiteUrl: "https://poe.com", category: "chatbots", pricing: "Freemium", rating: 4.4, tags: ["multi-model", "chat"] },
  // Writing & Content
  { slug: "jasper", name: "Jasper", description: "AI writing platform for marketing teams and brand content.", longDescription: "Jasper is an AI content platform built for marketing teams, offering brand voice controls, templates, and workflows for blogs, ads, and social copy.", domain: "jasper.ai", websiteUrl: "https://www.jasper.ai", category: "writing", pricing: "Paid", featured: true, rating: 4.5, tags: ["copywriting", "marketing"] },
  { slug: "copy-ai", name: "Copy.ai", description: "AI copywriter for ads, emails, and website content.", longDescription: "Copy.ai generates marketing copy, emails, and content briefs using AI, with workflow automations for go-to-market teams.", domain: "copy.ai", websiteUrl: "https://www.copy.ai", category: "writing", pricing: "Freemium", rating: 4.4, tags: ["copywriting", "automation"] },
  { slug: "grammarly", name: "Grammarly", description: "AI writing assistant for grammar, tone, and clarity.", longDescription: "Grammarly checks grammar, spelling, tone, and clarity in real time across browsers and apps, with AI-powered rewrite suggestions.", domain: "grammarly.com", websiteUrl: "https://www.grammarly.com", category: "writing", pricing: "Freemium", rating: 4.6, tags: ["grammar", "editing"] },
  { slug: "notion-ai", name: "Notion AI", description: "AI writing and knowledge assistant built into Notion.", longDescription: "Notion AI adds writing, summarization, and Q&A capabilities directly into Notion workspaces, helping teams draft and organize knowledge faster.", domain: "notion.so", websiteUrl: "https://www.notion.so/product/ai", category: "writing", pricing: "Paid", rating: 4.5, tags: ["notes", "knowledge"] },
  { slug: "quillbot", name: "QuillBot", description: "AI paraphrasing, grammar, and summarization tool.", longDescription: "QuillBot offers AI-powered paraphrasing, grammar checking, summarizing, and citation tools for students and professionals.", domain: "quillbot.com", websiteUrl: "https://quillbot.com", category: "writing", pricing: "Freemium", rating: 4.3, tags: ["paraphrasing", "summarizing"] },
  { slug: "sudowrite", name: "Sudowrite", description: "AI writing partner built for fiction and storytelling.", longDescription: "Sudowrite is an AI writing tool designed for novelists and creative writers, offering brainstorming, description, and rewriting features tuned for fiction.", domain: "sudowrite.com", websiteUrl: "https://www.sudowrite.com", category: "writing", pricing: "Paid", rating: 4.4, tags: ["fiction", "creative"] },
  // Image Generation
  { slug: "midjourney", name: "Midjourney", description: "AI image generator known for artistic, high-fidelity output.", longDescription: "Midjourney generates highly detailed, artistic images from text prompts, widely used by designers and artists for concept art and illustration.", domain: "midjourney.com", websiteUrl: "https://www.midjourney.com", category: "image-generation", pricing: "Paid", featured: true, rating: 4.8, tags: ["art", "text-to-image"] },
  { slug: "dalle", name: "DALL·E", description: "OpenAI's text-to-image generation model.", longDescription: "DALL·E, by OpenAI, generates and edits images from natural language descriptions and is integrated into ChatGPT for conversational image creation.", domain: "openai.com", websiteUrl: "https://openai.com/dall-e-3", category: "image-generation", pricing: "Freemium", featured: true, rating: 4.6, tags: ["text-to-image", "openai"] },
  { slug: "stable-diffusion", name: "Stable Diffusion", description: "Open-source text-to-image diffusion model.", longDescription: "Stable Diffusion is an open-source latent diffusion model for generating images from text, widely used for self-hosting and fine-tuning custom models.", domain: "stability.ai", websiteUrl: "https://stability.ai/stable-diffusion", category: "image-generation", pricing: "Free", rating: 4.5, tags: ["open-source", "text-to-image"] },
  { slug: "leonardo-ai", name: "Leonardo.Ai", description: "AI image generator with fine-tuned models for game and product art.", longDescription: "Leonardo.Ai provides text-to-image generation with custom fine-tuned models, aimed at game artists, product designers, and creators.", domain: "leonardo.ai", websiteUrl: "https://leonardo.ai", category: "image-generation", pricing: "Freemium", rating: 4.5, tags: ["game-art", "text-to-image"] },
  { slug: "ideogram", name: "Ideogram", description: "AI image generator with strong text rendering in images.", longDescription: "Ideogram specializes in generating images with accurate, legible text rendering, useful for logos, posters, and typographic designs.", domain: "ideogram.ai", websiteUrl: "https://ideogram.ai", category: "image-generation", pricing: "Freemium", rating: 4.4, tags: ["typography", "text-to-image"] },
  { slug: "adobe-firefly", name: "Adobe Firefly", description: "Adobe's generative AI for images integrated into Creative Cloud.", longDescription: "Adobe Firefly brings generative AI image creation and editing into Photoshop, Illustrator, and Creative Cloud, trained on licensed content.", domain: "adobe.com", websiteUrl: "https://www.adobe.com/products/firefly.html", category: "image-generation", pricing: "Freemium", rating: 4.4, tags: ["adobe", "creative-cloud"] },
  // Video
  { slug: "runway", name: "Runway", description: "AI video generation and editing suite for creators.", longDescription: "Runway offers a suite of AI-powered video tools including text-to-video generation, green screen removal, and motion tracking for creators and studios.", domain: "runwayml.com", websiteUrl: "https://runwayml.com", category: "video", pricing: "Freemium", featured: true, rating: 4.6, tags: ["text-to-video", "editing"] },
  { slug: "synthesia", name: "Synthesia", description: "Create AI avatar videos from text in minutes.", longDescription: "Synthesia turns text scripts into professional videos featuring AI avatars and voiceovers in dozens of languages, popular for training content.", domain: "synthesia.io", websiteUrl: "https://www.synthesia.io", category: "video", pricing: "Paid", rating: 4.5, tags: ["avatars", "training-video"] },
  { slug: "pika", name: "Pika", description: "AI video generator that turns text and images into short clips.", longDescription: "Pika is a text- and image-to-video generation tool that produces short, stylized video clips for creative and social content.", domain: "pika.art", websiteUrl: "https://pika.art", category: "video", pricing: "Freemium", rating: 4.3, tags: ["text-to-video", "social"] },
  { slug: "heygen", name: "HeyGen", description: "AI video generation platform with realistic talking avatars.", longDescription: "HeyGen generates realistic AI avatar videos with lip-synced speech in multiple languages, aimed at marketing and localization teams.", domain: "heygen.com", websiteUrl: "https://www.heygen.com", category: "video", pricing: "Freemium", rating: 4.5, tags: ["avatars", "localization"] },
  // Audio & Music
  { slug: "elevenlabs", name: "ElevenLabs", description: "Realistic AI voice generation and cloning platform.", longDescription: "ElevenLabs provides state-of-the-art text-to-speech and voice cloning, used for audiobooks, dubbing, and conversational voice agents.", domain: "elevenlabs.io", websiteUrl: "https://elevenlabs.io", category: "audio-music", pricing: "Freemium", featured: true, rating: 4.7, tags: ["voice-cloning", "tts"] },
  { slug: "suno", name: "Suno", description: "AI music generator that creates full songs from text prompts.", longDescription: "Suno generates complete songs — including vocals, lyrics, and instrumentation — from simple text prompts, popular for quick music creation.", domain: "suno.com", websiteUrl: "https://suno.com", category: "audio-music", pricing: "Freemium", rating: 4.5, tags: ["music", "text-to-song"] },
  { slug: "udio", name: "Udio", description: "AI music creation tool for generating original songs.", longDescription: "Udio lets users generate original songs across genres from text prompts, with tools for extending and remixing generated tracks.", domain: "udio.com", websiteUrl: "https://www.udio.com", category: "audio-music", pricing: "Freemium", rating: 4.4, tags: ["music", "generation"] },
  { slug: "descript", name: "Descript", description: "AI-powered audio and video editor with text-based editing.", longDescription: "Descript lets you edit audio and video by editing a text transcript, with AI features like overdub voice cloning and filler-word removal.", domain: "descript.com", websiteUrl: "https://www.descript.com", category: "audio-music", pricing: "Freemium", rating: 4.5, tags: ["podcast", "editing"] },
  // Coding & Dev Tools
  { slug: "github-copilot", name: "GitHub Copilot", description: "AI pair programmer that autocompletes code in your editor.", longDescription: "GitHub Copilot suggests code completions, entire functions, and chat-based assistance directly in the editor, trained on billions of lines of code.", domain: "github.com", websiteUrl: "https://github.com/features/copilot", category: "coding", pricing: "Paid", featured: true, rating: 4.6, tags: ["autocomplete", "github"] },
  { slug: "cursor", name: "Cursor", description: "AI-first code editor built for pair programming with AI.", longDescription: "Cursor is a code editor built around AI pair programming, offering multi-file edits, chat, and codebase-aware completions.", domain: "cursor.com", websiteUrl: "https://www.cursor.com", category: "coding", pricing: "Freemium", featured: true, rating: 4.7, tags: ["editor", "ai-native"] },
  { slug: "replit-ai", name: "Replit AI", description: "AI app builder and coding assistant inside Replit.", longDescription: "Replit's Agent and Assistant help build, debug, and deploy full-stack apps directly in the browser, from natural-language prompts to running software.", domain: "replit.com", websiteUrl: "https://replit.com", category: "coding", pricing: "Freemium", rating: 4.6, tags: ["app-builder", "cloud-ide"] },
  { slug: "codeium", name: "Codeium", description: "Free AI code completion and chat for developers.", longDescription: "Codeium provides AI-powered code completion, search, and chat across dozens of languages and IDEs with a generous free tier.", domain: "codeium.com", websiteUrl: "https://codeium.com", category: "coding", pricing: "Freemium", rating: 4.5, tags: ["autocomplete", "free"] },
  { slug: "tabnine", name: "Tabnine", description: "AI code completion tool focused on privacy and enterprise use.", longDescription: "Tabnine offers AI code completions with a strong emphasis on privacy, letting enterprises self-host or fine-tune models on private codebases.", domain: "tabnine.com", websiteUrl: "https://www.tabnine.com", category: "coding", pricing: "Freemium", rating: 4.3, tags: ["enterprise", "privacy"] },
  // Productivity
  { slug: "notion", name: "Notion", description: "All-in-one workspace with AI-powered notes and docs.", longDescription: "Notion combines notes, docs, wikis, and project management in one workspace, now enhanced with AI writing and search features.", domain: "notion.so", websiteUrl: "https://www.notion.so", category: "productivity", pricing: "Freemium", rating: 4.6, tags: ["notes", "workspace"] },
  { slug: "otter-ai", name: "Otter.ai", description: "AI meeting assistant that transcribes and summarizes calls.", longDescription: "Otter.ai automatically transcribes meetings in real time and generates AI summaries, action items, and searchable notes.", domain: "otter.ai", websiteUrl: "https://otter.ai", category: "productivity", pricing: "Freemium", rating: 4.4, tags: ["transcription", "meetings"] },
  { slug: "reclaim-ai", name: "Reclaim.ai", description: "AI calendar assistant that automatically schedules your work.", longDescription: "Reclaim.ai analyzes your calendar and tasks to automatically schedule focus time, habits, and meetings, adapting as priorities shift.", domain: "reclaim.ai", websiteUrl: "https://reclaim.ai", category: "productivity", pricing: "Freemium", rating: 4.5, tags: ["calendar", "scheduling"] },
  { slug: "motion", name: "Motion", description: "AI task and calendar manager that auto-plans your day.", longDescription: "Motion uses AI to automatically prioritize and schedule tasks, meetings, and projects on your calendar, replanning as things change.", domain: "usemotion.com", websiteUrl: "https://www.usemotion.com", category: "productivity", pricing: "Paid", rating: 4.3, tags: ["planning", "tasks"] },
  // Design
  { slug: "figma-ai", name: "Figma AI", description: "AI features built into Figma for design and prototyping.", longDescription: "Figma AI adds generative design, content-aware fill, and automated organization features directly into the Figma design workflow.", domain: "figma.com", websiteUrl: "https://www.figma.com", category: "design", pricing: "Freemium", rating: 4.6, tags: ["ui-design", "prototyping"] },
  { slug: "canva-magic-studio", name: "Canva Magic Studio", description: "Suite of AI design tools built into Canva.", longDescription: "Canva Magic Studio bundles AI features — text-to-image, background removal, magic write, and more — into Canva's design platform.", domain: "canva.com", websiteUrl: "https://www.canva.com/magic-studio", category: "design", pricing: "Freemium", featured: true, rating: 4.6, tags: ["templates", "graphic-design"] },
  { slug: "framer-ai", name: "Framer AI", description: "AI website builder that generates full sites from a prompt.", longDescription: "Framer AI generates complete, editable website designs from a text prompt, combining a no-code site builder with generative layout tools.", domain: "framer.com", websiteUrl: "https://www.framer.com", category: "design", pricing: "Freemium", rating: 4.5, tags: ["website-builder", "no-code"] },
  { slug: "uizard", name: "Uizard", description: "AI tool that turns sketches and prompts into UI mockups.", longDescription: "Uizard converts hand-drawn sketches, screenshots, or text prompts into editable UI design mockups and prototypes.", domain: "uizard.io", websiteUrl: "https://uizard.io", category: "design", pricing: "Freemium", rating: 4.2, tags: ["mockups", "sketches"] },
  // Marketing & SEO
  { slug: "surfer-seo", name: "Surfer SEO", description: "AI-powered SEO content optimization tool.", longDescription: "Surfer SEO analyzes top-ranking pages and provides AI-driven content briefs and on-page optimization guidance to improve search rankings.", domain: "surferseo.com", websiteUrl: "https://surferseo.com", category: "marketing", pricing: "Paid", rating: 4.5, tags: ["seo", "content-optimization"] },
  { slug: "adcreative-ai", name: "AdCreative.ai", description: "AI tool that generates high-converting ad creatives.", longDescription: "AdCreative.ai automatically generates ad banners, social creatives, and copy variations optimized for conversion, backed by performance data.", domain: "adcreative.ai", websiteUrl: "https://www.adcreative.ai", category: "marketing", pricing: "Paid", rating: 4.3, tags: ["ads", "creative"] },
  { slug: "hubspot-ai", name: "HubSpot AI", description: "AI tools built into HubSpot's marketing and CRM suite.", longDescription: "HubSpot's AI features assist with content generation, lead scoring, and campaign insights across its CRM and marketing hub.", domain: "hubspot.com", websiteUrl: "https://www.hubspot.com/artificial-intelligence", category: "marketing", pricing: "Freemium", rating: 4.4, tags: ["crm", "campaigns"] },
  { slug: "mutiny", name: "Mutiny", description: "AI website personalization for B2B marketing teams.", longDescription: "Mutiny uses AI to personalize website content for different visitor segments, helping B2B marketing teams increase conversion rates.", domain: "mutinyhq.com", websiteUrl: "https://www.mutinyhq.com", category: "marketing", pricing: "Paid", rating: 4.2, tags: ["personalization", "b2b"] },
  // Research & Data
  { slug: "elicit", name: "Elicit", description: "AI research assistant for finding and summarizing papers.", longDescription: "Elicit uses language models to help researchers search, summarize, and extract data from academic papers, speeding up literature reviews.", domain: "elicit.com", websiteUrl: "https://elicit.com", category: "research-data", pricing: "Freemium", rating: 4.5, tags: ["research", "academic"] },
  { slug: "consensus", name: "Consensus", description: "AI search engine for evidence-based answers from research papers.", longDescription: "Consensus is an AI-powered search engine that extracts findings directly from peer-reviewed research to answer questions with cited evidence.", domain: "consensus.app", websiteUrl: "https://consensus.app", category: "research-data", pricing: "Freemium", rating: 4.4, tags: ["research", "citations"] },
  { slug: "julius-ai", name: "Julius AI", description: "AI data analyst that answers questions from your spreadsheets.", longDescription: "Julius AI lets you upload spreadsheets or datasets and ask questions in plain English, generating charts and analysis automatically.", domain: "julius.ai", websiteUrl: "https://julius.ai", category: "research-data", pricing: "Freemium", rating: 4.4, tags: ["data-analysis", "spreadsheets"] },
  // Customer Support
  { slug: "intercom-fin", name: "Intercom Fin", description: "AI customer support agent built on Intercom's platform.", longDescription: "Fin, by Intercom, is an AI agent that resolves customer support tickets automatically using a company's help center content and workflows.", domain: "intercom.com", websiteUrl: "https://www.intercom.com/fin", category: "customer-support", pricing: "Paid", rating: 4.4, tags: ["helpdesk", "automation"] },
  { slug: "zendesk-ai", name: "Zendesk AI", description: "AI features for automated ticket resolution and agent assistance.", longDescription: "Zendesk AI adds automated ticket triage, suggested replies, and self-service bots to the Zendesk customer service platform.", domain: "zendesk.com", websiteUrl: "https://www.zendesk.com/service/ai", category: "customer-support", pricing: "Paid", rating: 4.3, tags: ["tickets", "self-service"] },
  { slug: "ada", name: "Ada", description: "No-code AI chatbot platform for customer service automation.", longDescription: "Ada is a no-code AI customer service platform that automates resolutions across chat, email, and voice for enterprise support teams.", domain: "ada.cx", websiteUrl: "https://www.ada.cx", category: "customer-support", pricing: "Paid", rating: 4.3, tags: ["no-code", "enterprise"] },
  // 3D & Avatars
  { slug: "ready-player-me", name: "Ready Player Me", description: "Cross-app avatar platform for games and virtual worlds.", longDescription: "Ready Player Me lets users create a customizable 3D avatar that can be used across games, apps, and virtual worlds via a developer SDK.", domain: "readyplayer.me", websiteUrl: "https://readyplayer.me", category: "3d-avatars", pricing: "Freemium", rating: 4.4, tags: ["avatars", "metaverse"] },
  { slug: "luma-ai", name: "Luma AI", description: "AI tool for turning photos into 3D scenes and models.", longDescription: "Luma AI captures and generates realistic 3D scenes and objects from photos or video, using neural radiance field technology.", domain: "lumalabs.ai", websiteUrl: "https://lumalabs.ai", category: "3d-avatars", pricing: "Freemium", rating: 4.4, tags: ["3d-capture", "nerf"] },
  { slug: "kaedim", name: "Kaedim", description: "AI tool that converts 2D images into 3D models.", longDescription: "Kaedim automatically converts 2D concept art and reference images into game-ready 3D models, speeding up asset production pipelines.", domain: "kaedim3d.com", websiteUrl: "https://www.kaedim3d.com", category: "3d-avatars", pricing: "Paid", rating: 4.1, tags: ["3d-models", "game-assets"] },
  { slug: "meshy", name: "Meshy", description: "AI 3D model generator from text prompts or images.", longDescription: "Meshy generates textured 3D models from text descriptions or 2D images, aimed at game developers and 3D artists.", domain: "meshy.ai", websiteUrl: "https://www.meshy.ai", category: "3d-avatars", pricing: "Freemium", rating: 4.3, tags: ["text-to-3d", "game-dev"] },
  // A few extra across categories to reach ~51
  { slug: "you-com", name: "You.com", description: "AI search engine with built-in chat and productivity apps.", longDescription: "You.com combines web search with an AI chat assistant and a suite of built-in productivity apps for writing, coding, and research.", domain: "you.com", websiteUrl: "https://you.com", category: "chatbots", pricing: "Freemium", rating: 4.3, tags: ["search", "assistant"] },
  { slug: "writesonic", name: "Writesonic", description: "AI writing platform for SEO content and marketing copy.", longDescription: "Writesonic generates SEO-optimized articles, ad copy, and marketing content using AI, with built-in fact-checking features.", domain: "writesonic.com", websiteUrl: "https://writesonic.com", category: "writing", pricing: "Freemium", rating: 4.3, tags: ["seo", "content"] },
  { slug: "playground-ai", name: "Playground AI", description: "AI image generator and editor for creators and designers.", longDescription: "Playground AI offers text-to-image generation alongside a canvas editor for compositing, inpainting, and refining AI-generated art.", domain: "playground.com", websiteUrl: "https://playground.com", category: "image-generation", pricing: "Freemium", rating: 4.3, tags: ["editor", "text-to-image"] },
  { slug: "invideo-ai", name: "InVideo AI", description: "AI video generator that creates full videos from a text prompt.", longDescription: "InVideo AI turns a text prompt into a complete edited video, including script, voiceover, stock footage, and captions.", domain: "invideo.io", websiteUrl: "https://invideo.io", category: "video", pricing: "Freemium", rating: 4.2, tags: ["text-to-video", "editing"] },
  { slug: "mubert", name: "Mubert", description: "AI generative music platform for royalty-free soundtracks.", longDescription: "Mubert generates royalty-free background music and soundtracks on demand using generative AI, for creators, apps, and brands.", domain: "mubert.com", websiteUrl: "https://mubert.com", category: "audio-music", pricing: "Freemium", rating: 4.1, tags: ["royalty-free", "generative-music"] },
  { slug: "amazon-codewhisperer", name: "Amazon Q Developer", description: "AI coding assistant integrated with AWS services.", longDescription: "Amazon Q Developer (formerly CodeWhisperer) provides AI code suggestions with strong awareness of AWS APIs and services.", domain: "aws.amazon.com", websiteUrl: "https://aws.amazon.com/q/developer", category: "coding", pricing: "Freemium", rating: 4.2, tags: ["aws", "autocomplete"] },
  { slug: "taskade", name: "Taskade", description: "AI-powered workspace for tasks, notes, and team chat.", longDescription: "Taskade combines task management, notes, and team chat with built-in AI agents that can generate plans, docs, and workflows.", domain: "taskade.com", websiteUrl: "https://www.taskade.com", category: "productivity", pricing: "Freemium", rating: 4.2, tags: ["tasks", "ai-agents"] },
  { slug: "galileo-ai", name: "Galileo AI", description: "AI tool that generates editable UI designs from text prompts.", longDescription: "Galileo AI generates high-fidelity, editable user interface designs directly in Figma from simple text descriptions.", domain: "usegalileo.ai", websiteUrl: "https://www.usegalileo.ai", category: "design", pricing: "Paid", rating: 4.3, tags: ["ui-design", "figma"] },
  { slug: "semrush-copilot", name: "Semrush Copilot", description: "AI assistant for SEO and marketing insights inside Semrush.", longDescription: "Semrush Copilot surfaces AI-driven recommendations for SEO, content, and marketing performance directly inside the Semrush platform.", domain: "semrush.com", websiteUrl: "https://www.semrush.com", category: "marketing", pricing: "Paid", rating: 4.3, tags: ["seo", "insights"] },
  { slug: "scite", name: "scite", description: "AI research tool that shows how papers are cited by others.", longDescription: "scite analyzes citation context across millions of papers to show whether a study has been supported or contradicted by later research.", domain: "scite.ai", websiteUrl: "https://scite.ai", category: "research-data", pricing: "Freemium", rating: 4.3, tags: ["citations", "academic"] },
  { slug: "forethought", name: "Forethought", description: "AI customer support automation platform for enterprises.", longDescription: "Forethought provides AI agents that automate ticket triage, resolution, and routing for enterprise customer support teams.", domain: "forethought.ai", websiteUrl: "https://forethought.ai", category: "customer-support", pricing: "Paid", rating: 4.1, tags: ["automation", "enterprise"] },
  { slug: "spline-ai", name: "Spline AI", description: "AI-assisted 3D design tool for the web.", longDescription: "Spline AI adds generative texture, material, and object creation to Spline's browser-based 3D design and animation tool.", domain: "spline.design", websiteUrl: "https://spline.design", category: "3d-avatars", pricing: "Freemium", rating: 4.2, tags: ["3d-design", "web"] },
  { slug: "character-ai", name: "Character.AI", description: "Platform for chatting with AI-generated character personas.", longDescription: "Character.AI lets users create and chat with customizable AI personas for roleplay, companionship, and creative writing.", domain: "character.ai", websiteUrl: "https://character.ai", category: "chatbots", pricing: "Freemium", rating: 4.2, tags: ["roleplay", "personas"] },
  { slug: "wordtune", name: "Wordtune", description: "AI writing companion that rewrites sentences for clarity and tone.", longDescription: "Wordtune suggests rewrites for sentences to improve clarity, tone, and length, acting as an AI editing companion across the web.", domain: "wordtune.com", websiteUrl: "https://www.wordtune.com", category: "writing", pricing: "Freemium", rating: 4.3, tags: ["rewriting", "clarity"] },
  { slug: "clipdrop", name: "Clipdrop", description: "AI image editing toolkit for background removal and upscaling.", longDescription: "Clipdrop, by Stability AI, offers a suite of AI image tools including background removal, relighting, and upscaling for creators.", domain: "clipdrop.co", websiteUrl: "https://clipdrop.co", category: "image-generation", pricing: "Freemium", rating: 4.3, tags: ["background-removal", "upscaling"] },
];

async function seed() {
  const categoryIdBySlug = new Map<string, number>();

  for (const c of categories) {
    const [row] = await db
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
      description: t.description,
      longDescription: t.longDescription,
      logoUrl: `https://logo.clearbit.com/${t.domain}`,
      websiteUrl: t.websiteUrl,
      categoryId,
      pricing: t.pricing,
      featured: t.featured ?? false,
      rating: t.rating,
      tags: t.tags,
    };
    await db
      .insert(toolsTable)
      .values(values)
      .onConflictDoUpdate({ target: toolsTable.slug, set: values });
  }

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
