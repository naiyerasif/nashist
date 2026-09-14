import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(`${import.meta.dirname}/dictionary.db`);
const query = db.prepare("SELECT roman FROM dictionary WHERE urdu = ?");

function fetchRoman(text) {
  return query.get(text)?.roman;
}

const consonantMap = {
	"ب": "b", "پ": "p", "ت": "t", "ٹ": "t", "ث": "th", "ج": "j", "چ": "ch",
	"ح": "h", "خ": "kh", "د": "d", "ڈ": "d", "ذ": "z", "ر": "r", "ڑ": "r",
	"ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s", "ض": "z", "ط": "t",
	"ظ": "z", "ع": "", "غ": "gh", "ف": "f", "ق": "q", "ک": "k", "گ": "g",
	"ل": "l", "م": "m", "ن": "n", "ة": "t",
};

const aspiratedMap = {
	"ب": "bh", "پ": "ph", "ت": "th", "ٹ": "th", "ج": "jh", "چ": "chh",
	"د": "dh", "ڈ": "dh", "ر": "rh", "ڑ": "rh", "ک": "kh", "گ": "gh",
	"ل": "lh", "م": "mh", "ن": "nh",
};

const vowelLetters = new Set(["ا", "و", "ی", "ے"]);
const noVowelEndings = new Set(["st", "kht", "sht", "ft", "pt", "xt"]);

function ruleBasedTransliterate(word) {
	const chars = [...word];
	const n = chars.length;
	const out = [];
	let i = 0;

	while (i < n) {
		const c = chars[i];
		const next = chars[i + 1];

		if (c in consonantMap) {
			let sound;
			if (next === "ھ") {
				sound = aspiratedMap[c] ?? consonantMap[c] + "h";
				i += 2;
			} else {
				sound = consonantMap[c];
				i += 1;
			}
			out.push(sound);

			const after = chars[i];
			if (after === undefined || vowelLetters.has(after) || after === "ھ") {
				// long vowel or word end follows — no inserted vowel
			} else if (after in consonantMap && i + 1 >= n) {
				const pair = sound + consonantMap[after];
				if (!noVowelEndings.has(pair)) {
					out.push("a");
				}
			} else {
				out.push("a");
			}
			continue;
		}

		if (c === "ا") {
			if (i === 0) {
				out.push("a");
			} else if (next === "ں") {
				out.push("aa");
			}
			i += 1;
			continue;
		}

		if (c === "و") {
			out.push(i === 0 ? "w" : "o");
			i += 1;
			continue;
		}

		if (c === "ی") {
			out.push(i === 0 ? "y" : "i");
			i += 1;
			continue;
		}

		if (c === "ے") {
			out.push("e");
			i += 1;
			continue;
		}

		if (c === "ں") {
			out.push("n");
			i += 1;
			continue;
		}

		if (c === "ہ" || c === "ھ") {
			out.push("h");
			i += 1;
			continue;
		}

		if (c === "ء") {
			i += 1;
			continue;
		}

		out.push(c);
		i += 1;
	}

	return out.join("");
}

function transliterateWord(word) {
	const dictHit = fetchRoman(word);
	if (dictHit !== undefined) {
		return dictHit;
	}
	return ruleBasedTransliterate(word);
}

export default function slugify(text) {
	return text.normalize()
		.trim()
		.split(/\s+/).filter(Boolean)
		.map(transliterateWord)
		.join("-")
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}
