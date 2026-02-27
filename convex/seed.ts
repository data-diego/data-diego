import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already seeded
    const existingExp = await ctx.db.query("experiences").first();
    if (existingExp) throw new Error("Data already seeded");

    // Experiences
    await ctx.db.insert("experiences", {
      company: "Freelance",
      role: "Full-Stack Engineer",
      period: "2023 - Present",
      logo: "F",
      color: "bg-violet-500",
      description:
        "Building web apps and AI integrations for clients across Latin America.",
      content:
        "Working with startups and agencies to deliver full-stack web applications, from initial architecture to deployment and maintenance.\n\nKey projects include AI-powered content platforms, real-time dashboards, and e-commerce solutions. Built with React, Next.js, Python, and various cloud services.\n\nFocus on clean, maintainable code and delivering high-quality user experiences on tight timelines.",
      slug: "freelance",
      order: 1,
    });
    await ctx.db.insert("experiences", {
      company: "DataCo",
      role: "Data Engineer",
      period: "2021 - 2023",
      logo: "D",
      color: "bg-blue-500",
      description:
        "Designed ETL pipelines and real-time data systems processing millions of events daily.",
      content:
        "Led the design and implementation of data pipelines handling millions of events daily using Apache Kafka, Python, and PostgreSQL.\n\nBuilt real-time analytics dashboards and automated reporting systems that reduced manual work by 80%. Managed data infrastructure on AWS and optimized query performance across multiple databases.\n\nMentored junior engineers and established data engineering best practices across the team.",
      slug: "dataco",
      order: 2,
    });
    await ctx.db.insert("experiences", {
      company: "StartupCL",
      role: "Software Developer",
      period: "2019 - 2021",
      logo: "S",
      color: "bg-emerald-500",
      description:
        "Built core product features and internal tooling for a fast-growing fintech startup.",
      content:
        "Developed core product features for a fintech platform serving thousands of users, including payment processing, user onboarding, and reporting modules.\n\nBuilt internal tooling that improved team productivity and reduced customer support response times. Worked across the full stack with React, Node.js, and PostgreSQL.\n\nParticipated in product decisions and helped shape the technical roadmap during rapid growth.",
      slug: "startupcl",
      order: 3,
    });

    // Projects
    await ctx.db.insert("projects", {
      title: "datadiego.com",
      description:
        "Personal website and blog with AI-powered chat and blog summaries.",
      technologies: ["Next.js", "Convex", "Tailwind CSS", "OpenRouter"],
      link: "https://github.com/datadiego/datadiego.com",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&q=80",
      color: "from-violet-500/20 to-violet-500/5",
      slug: "datadiego-com",
      order: 1,
    });
    await ctx.db.insert("projects", {
      title: "Data Pipeline Toolkit",
      description:
        "Tools for building and managing ETL, streaming, and batch processing pipelines.",
      technologies: ["Python", "Kafka", "PostgreSQL", "Docker"],
      link: "https://github.com/datadiego",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&q=80",
      color: "from-blue-500/20 to-blue-500/5",
      slug: "data-pipeline-toolkit",
      order: 2,
    });
    await ctx.db.insert("projects", {
      title: "AI Code Assistant",
      description:
        "Intelligent code review and generation assistant powered by LLMs.",
      technologies: ["TypeScript", "OpenAI", "VS Code API", "Node.js"],
      link: "https://github.com/datadiego",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop&q=80",
      color: "from-emerald-500/20 to-emerald-500/5",
      slug: "ai-code-assistant",
      order: 3,
    });

    // Skills
    await ctx.db.insert("skills", {
      category: "Languages",
      items: ["TypeScript", "Python", "Go"],
      slug: "languages",
      order: 1,
    });
    await ctx.db.insert("skills", {
      category: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS"],
      slug: "frontend",
      order: 2,
    });
    await ctx.db.insert("skills", {
      category: "Backend",
      items: ["Node.js", "FastAPI", "Convex"],
      slug: "backend",
      order: 3,
    });
    await ctx.db.insert("skills", {
      category: "Data & AI",
      items: ["PostgreSQL", "Redis", "OpenAI", "LangChain"],
      slug: "data-ai",
      order: 4,
    });
    await ctx.db.insert("skills", {
      category: "DevOps",
      items: ["Docker", "Git", "Linux"],
      slug: "devops",
      order: 5,
    });

    return "Seeded successfully";
  },
});

export const seedPosts = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingPosts = await ctx.db.query("posts").first();
    if (existingPosts) throw new Error("Posts already seeded");

    const posts = [
      {
        title: "AI agent: GO",
        slug: "go-agent",
        excerpt:
          "An AI agent for personalized health system insights, built with RAG, MongoDB, and speech-to-text.",
        content: `The **GO assistant** stands as a groundbreaking solution in healthcare tech, tailored for the Chilean health system. You can try it on [https://labs.gokeigo.com/](https://labs.gokeigo.com/)

You can ask it to search information about health services' pricing and it will return you the best options based on your health coverage (if you provide it to it).

It leverages the uses of retrieval augmented generation (RAG) with a custom mongo AI database and different tools to make database searches and calculations after the return of the data.

It also has chat history, stored in mongo and synced with supabase. And a speech to text (STT) functionality, that was integrated with a runpod endpoint of \`faster-whisper\`.

Almost all of the assistant I did it myself while my working partner was acquiring data from the health system to feed the agent. I learned a lot about AI agents, prompt engineering, stream responses, state management, and data visualization while building the GO assistant.

This project showcases my skills in developing custom solutions for specific industries, as well as my ability to integrate various technologies to create a seamless user experience.`,
        tags: ["AI", "RAG", "Python", "MongoDB", "LangChain", "Next.js"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "Amibot",
        slug: "amibot",
        excerpt:
          "An LLM assistant for car credit advice, with custom retrieval augmented generation (RAG) and vector similarity search as a recommendation system.",
        content: `An LLM wrapper for car credit advice, with a custom retrieval augmented generation (RAG) with mongo and vector similarity search as a recommendation system for related blog posts.

Built for Amicar, Amibot is a bot of **artificial intelligence** designed to assist clients with queries about automotive credits. This bot reflects the advancement in the democratization of AI, utilizing Deep Learning Language Models (LLM) that have been widely facilitated by developments from OpenAI, especially ChatGPT.

## Key Concepts

- **Embeddings**: Vector representations of words or phrases that allow machines to understand the meaning and semantics of human language.
- **Similarity Search**: A method that finds the most relevant content similar to a given query, based on embedding comparison.
- **Short and Long-term Memory Management**: Amibot's ability to remember past interactions and use that information to offer more contextual and personalized responses.

## LangChain Integration

LangChain is the secret weapon that connects the immense power of LLMs with the specific functionality needed for Amibot. It integrates OpenAI models with information retrieval systems and chained reasoning capabilities.

## Considerations

| Pro | Con |
| --- | --- |
| Document load and retrieve is almost automatic via OpenAI APIs | Only works with the OpenAI Assistants API |
| Conversation thread is also accessed via API (no need for a DB like mongo) | Can't change buffer memory strategies, data lives in OpenAI |
| GPT knows when to search for information | Development limited to OpenAI ecosystem |`,
        tags: ["AI", "LangChain", "RAG", "Python", "OpenAI"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "Totem Amicar-BravoAuto",
        slug: "totem",
        excerpt:
          "A physical totem integrating car offers with Amicar's financial system, optimized for 42-inch touch screens.",
        content: `One of my latest projects at Amicar was the totem for a new partner, BravoAuto. They were going to open a new store in Chile and wanted to have a physical totem to search for financial credit while at the place.

The interaction had to be 100% touch and very simple. I implemented the designs I received considering user experience and quality of the product.

Overall I was very proud of how it turned out and I hope this product will prove useful for the people at that place.

> If the site doesn't look good it's because it's optimized for a 42" touch screen, although it should look good if you make the website fullscreen by pressing F11.

For the crawler, I needed to scrape (with permission) the offers of Amicar's car dealer partners daily. I did a FastAPI backend and deployed it on GCP's Cloud Run with Cloud Scheduler CRON jobs.`,
        tags: ["Vue.js", "FastAPI", "GCP", "Python", "Web Scraping"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "Glunote",
        slug: "glunote",
        excerpt:
          "An app for glucose tracking and insulin calculations for people with diabetes type I, published on the Play Store.",
        content: `At university (Engineering faculty) I belonged to a technology group, and people from other faculties sometimes came asking for help.

One guy about to graduate as a designer wanted to make his designs about an app for his diabetes a reality and came asking for help.

I was just learning how to develop apps and decided to develop it as a way of practice.

After some redesigns the app turned out very well — we even deployed it to the [Play Store](https://play.google.com/store/apps/details?id=com.recuper.glunote). Although it never had a backend so it just did basic calculations.

The most valuable lesson was the practice I got with implementing professional designs for a realistic use case.`,
        tags: ["Flutter", "Dart", "Mobile", "UI/UX"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "Gokei",
        slug: "gokei",
        excerpt:
          "A health startup funded by Platanus, pivoting from digital health insurance to an AI-powered health information assistant.",
        content: `Gokei is a startup that aims to revolutionize the way people approach their health and wellness. Funded by [Platanus](https://platan.us/), **Gokei** started offering a new way to subscribe to health insurance — a 100% digital way on their [website](https://gokeigo.com).

After I joined, the company decided to pivot to innovate on health information access. So we started to develop the [GO assistant](https://labs.gokeigo.com/asistente). An AI agent that can tell you personalized information about prices on the Chilean health system according to your health coverages.

After the web app didn't get much traction it was time for another pivot, this time about reducing the hassle on health management, now using a more simplistic approach with a [Bubble](https://bubble.io/) app and a **backoffice** I built using the Bubble Data API.

Since they didn't need more development in this new stage it was time for me to leave.`,
        tags: ["Startup", "AI", "Next.js"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "iPower",
        slug: "ipower",
        excerpt:
          "Website for a SAP consultant agency featuring AI-powered CV form filling.",
        content: `[https://ipower.cl/](https://ipower.cl/)

Upload a CV and see a form being filled by AI.

Built a website for a SAP consultant agency. The main feature allows users to upload their CV and have the application form automatically filled using AI, streamlining the recruitment process.`,
        tags: ["Next.js", "AI", "Vue.js"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "BudaDigital",
        slug: "budadigital",
        excerpt:
          "Freelance work developing the brand and website for a marketing agency using PocketBase and Nuxt 3.",
        content: `I developed the website for a colleague that wanted to create his own marketing agency. We developed together the brand, including logo, typography, colors, etc. I used PocketBase for the backend, and Nuxt 3 for the front.

You can find it at [https://budadigital.cl/](https://budadigital.cl/)

I learned about working with clients, **taking their vision and turning it into a reality**. It was a great opportunity to **hone my skills in branding and web development**. I **collaborated closely with the client to create a website that truly represented their business**. The use of **PocketBase and Nuxt 3** allowed for a **smooth and efficient development process**. I'm proud of the result and grateful for the experience.`,
        tags: ["Nuxt.js", "Vue.js", "PocketBase"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "Amicar",
        slug: "amicar",
        excerpt:
          "Freelance full-stack development for Chile's leading automotive financing company.",
        content: `Amicar is a Chilean company that offers more options to finance vehicles. It evaluates credit with many financial institutions to provide more options to their clients.

I developed several projects as a freelance fullstack developer for many months, including the [Amibot](./amibot) AI assistant and the [BravoAuto Totem](./totem).`,
        tags: ["Vue.js", "Python", "FastAPI"],
        published: true,
        publishedAt: new Date("2024-06-16").getTime(),
      },
      {
        title: "Powerfinder",
        slug: "powerfinder",
        excerpt:
          "Semantic search for your data — a RAG pipeline with contextual retrieval and vectorized knowledge bases.",
        content: `Developed Powerfinder: Semantic search for your data.

The project featured a RAG pipeline that allowed businesses to upload thousands of files in knowledge bases that are enhanced using [contextual retrieval](https://www.anthropic.com/engineering/contextual-retrieval) through workers and then vectorized to later be retrieved in the searches and cited accordingly using highlights in the text. Businesses can also subscribe to public knowledge bases built by Powerfinder.

It also featured an admin panel that allowed to see analytics and usage and to set granular permissions for company or public knowledge bases.

Live at [https://app.powerlens.ai/powerfinder](https://app.powerlens.ai/powerfinder)`,
        tags: ["AI", "RAG", "Next.js", "TypeScript"],
        published: true,
        publishedAt: new Date("2024-12-17").getTime(),
      },
      {
        title: "Grupalia",
        slug: "grupalia",
        excerpt:
          "Developing the neobank for the SMEs of Latin America — group credit, fast, reliable, and easy.",
        content: `Developing the neobank for the SMEs of Latam.

Crédito grupal. Rápido, confiable, y fácil.

[https://www.grupalia.com/](https://www.grupalia.com/)`,
        tags: ["Fintech", "Next.js"],
        published: true,
        publishedAt: new Date("2026-01-20").getTime(),
      },
    ];

    for (const post of posts) {
      await ctx.db.insert("posts", {
        ...post,
        authorId: userId,
      });
    }

    return `Seeded ${posts.length} posts`;
  },
});
