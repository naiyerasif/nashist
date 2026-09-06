import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { poetryDirective } from "#utils/satteri/poetry-directive.js";

export default defineConfig({
	markdown: {
		processor: satteri({
			mdastPlugins: [poetryDirective],
			features: {
				directive: true,
				smartPunctuation: true
			},
		})
	}
});
