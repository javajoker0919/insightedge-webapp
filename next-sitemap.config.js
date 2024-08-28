/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://prospectedge.co", // Replace with your domain
  generateRobotsTxt: true, // Generate the robots.txt file
  sitemapSize: 7000, // Optional: limit the size of the sitemap
  changefreq: "daily", // Optional: change frequency of your pages
  priority: 0.7 // Optional: priority of your pages
};

module.exports = config;