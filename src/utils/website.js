const siteInfo = {
	title: "نشست",
	description: "نشست یہ جمی رہے",
	siteBase: "https://nashist.naiyerasif.com",
	repository: "https://github.com/naiyerasif/nashist",
	cover: "/images/opengraph/default.png",
	limits: { page: 20 },
	get issueBase() {
		return `${this.repository}/issues/new`;
	}
};

function absoluteUrl(path, base = siteInfo.siteBase) {
	return new URL(path, base).href;
}

function paginationPathname(base, pageNumber) {
	return pageNumber > 1 ? `/${base}/${pageNumber}/` : `/${base}/`;
}

export {
	siteInfo as default,
	absoluteUrl,
	paginationPathname
};
