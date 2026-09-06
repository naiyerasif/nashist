import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { Collections, People, Lit, Page } from "#utils/schema.js";

export const collections = {
	[Collections.people.id]: defineCollection({
		loader: glob({ pattern: "**/*.yml", base: "./content/people" }),
		schema: People
	}),
	[Collections.lit.id]: defineCollection({
		loader: glob({ pattern: "**/*.md", base: "./content/lit" }),
		schema: Lit
	}),
	[Collections.page.id]: defineCollection({
		loader: glob({ pattern: "**/*.md", base: "./content/page" }),
		schema: Page
	}),
};
