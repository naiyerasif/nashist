import postcssPresetEnv from "postcss-preset-env";

export default {
	plugins: [
		postcssPresetEnv({
			stage: 2,
			preserve: true,
			features: {
				"logical-properties-and-values": {
					blockDirection: "top-to-bottom",
					inlineDirection: "right-to-left"
				}
			}
		}),
	]
};
