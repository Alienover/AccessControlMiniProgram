/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  pathPrefix: "/office-control",
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Office Control",
        short_name: "Office",
        icon: "src/medias/icon.png",
        start_url: "/",
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
      },
    },
    {
      resolve: "gatsby-plugin-offline",
      options: {
        precachePages: ["/"],
      },
    },
  ],
}
