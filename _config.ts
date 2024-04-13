import lume from "lume/mod.ts";
import robots from "lume/plugins/robots.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import nunjucks from "lume/plugins/nunjucks.ts";

const site = lume({
  server: {
    port: 6969,
  },
  components: {
    variable: "components",
  },
});

site.use(robots());
site.copy("icons");
site.use(
  tailwindcss({
    options: {
      theme: {
        colors: {
          brand: {
            50: "#EBE9ED",
            100: "#D8D2DA",
            200: "#AEA3B3",
            300: "#86768E",
            400: "#5C5162",
            500: "#302A33",
            600: "#27232A",
            700: "#1D191F",
            800: "#121014",
            900: "#0B090B",
            950: "#050506",
          },
        },
      },
    },
  }),
);
site.use(postcss());
site.use(nunjucks());

export default site;
