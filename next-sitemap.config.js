module.exports = {
	// REQUIRED: add your own domain name here (e.g. https://shipfa.st),
	siteUrl: process.env.SITE_URL || "https://twistedartistsguild.com",
	generateRobotsTxt: true,
	// use this to exclude routes from the sitemap (i.e. a user dashboard)
	exclude: ["/portal/*","/dashboard/*"],
}
