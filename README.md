# readme todo

1. clone this repo or use as template
2. run deno run -A scripts/delete_data.js to clear all demo data
3. configure .github/workflows/uptimer.yml, configure schedule to run (current
   demo runs every 4 hrs) and configure your website domain under WEBSITE_DOMAIN
   field in env!
4. add your domain to check in CONFIG.json (optional if domain mentioned in
   .github/workflows/uptimer.yml)
5. run locally deno run -A scripts/get_data.js to check your settings
6. configure your github repo secrets
   BROWSERLESS_SERVER_DOMAIN=<domain for your browerless host>. also add custom
   token in .github/workflows/uptimer.yml BROWSERLESS_TOKEN field under env
7. enable github pages in your github repo
8. push code to your github repo
9. your site would be working well
10. star this repo

> tila-dashboard is a dashboard for your website metrics and uptime data whihc
> also includes feature to publish incidents for your website. create your own
> status page easily using capability of browserless. this dashboard also
> features backup and fully secured and self hostable. fully open source and
> customizable with the power of deno, tailwind css, nunjucks templates and
> lume.land web framework, also visualises data using chart.js
