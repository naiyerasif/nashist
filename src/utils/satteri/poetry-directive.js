import { defineMdastPlugin } from "satteri";

export const poetryDirective = defineMdastPlugin({
	name: "poetry-directive",
	containerDirective(node, ctx) {
		if (node.name === "poetry") {
			const newChildren = node.children.map((child) => {
				if (child.type === "paragraph") {
					const newParagraphChildren = [];

					for (const inlineNode of child.children) {
						if (inlineNode.type === "text" && inlineNode.value.includes("\n")) {
							const lines = inlineNode.value.split("\n");

							for (let i = 0; i < lines.length; i++) {
								if (lines[i]) {
									newParagraphChildren.push({
										...inlineNode,
										value: lines[i],
									});
								}

								if (i < lines.length - 1) {
									newParagraphChildren.push({
										type: "break",
									});
								}
							}
						} else {
							// Preserve inline elements like bold or italics
							newParagraphChildren.push(inlineNode);
						}
					}

					return {
						...child,
						children: newParagraphChildren,
					};
				}

				return child;
			});

			const customClasses = node.attributes?.class ? ` ${node.attributes.class}` : "";

			ctx.replaceNode(node, {
				...node,
				children: newChildren,
				data: {
					...node.data,
					hName: "div",
					hProperties: {
						...(node.data?.hProperties || {}),
						class: `poetry${customClasses}`,
					},
				},
			});
		}
	},
});
