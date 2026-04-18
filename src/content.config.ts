import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const optionalUrl = z.preprocess(
  (v) => (v === '' || v == null ? undefined : v),
  z.string().url().optional(),
);
const optionalString = z.preprocess(
  (v) => (v === '' || v == null ? undefined : v),
  z.string().optional(),
);

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    duration: z.string(),
    description: optionalString,
    youtube_url: z.string().url(),
    spotify_url: optionalUrl,
    thumbnail: optionalString,
    tags: z.array(z.string()).default([]),
    guests: z
      .array(
        z.object({
          name: z.string(),
          role: optionalString,
          instagram_url: optionalUrl,
        }),
      )
      .default([]),
    wines_mentioned: z
      .array(
        z.object({
          name: z.string(),
          winery: optionalString,
          link: optionalUrl,
        }),
      )
      .default([]),
    featured: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.object({
    about: z
      .object({
        manifesto: z.string().optional(),
        marta_bio: z.string().optional(),
        massimiliano_bio: z.string().optional(),
      })
      .optional(),
    contact: z
      .object({
        email: optionalString,
        whatsapp: optionalString,
        instagram: optionalUrl,
        youtube: optionalUrl,
        spotify: optionalUrl,
        tiktok: optionalUrl,
      })
      .optional(),
    stats: z
      .object({
        followers_ig: z.string().optional(),
        quarterly_views: z.string().optional(),
        custom_label_1: z.string().optional(),
        custom_value_1: z.string().optional(),
      })
      .optional(),
    settings: z
      .object({
        site_title: z.string().optional(),
        site_description: z.string().optional(),
        og_image: z.string().optional(),
        homepage_hero_override: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { episodes, pages };
