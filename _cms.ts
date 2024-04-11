import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

cms.storage("CMS", "CMS");

cms.collection("incident_history", "src:data/incident_history/*.md", [
    "title: text",
    "content: markdown",
  ]);
  

export default cms;
