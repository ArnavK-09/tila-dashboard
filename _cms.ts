import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

cms.storage("CMS", "CMS");

export const incident_history = cms.collection(
  "incident_history",
  "CMS:incident_history/*.md",
  [
    {
      name: "title",
      type: "text",
      label: "Title of the Incident",
      attributes: {
        required: true,
        maxlength: 50,
      },
    },
    {
      name: "description",
      type: "textarea",
      attributes: {
        required: true,
      },
    },
    {
      name: "status",
      type: "select",
      value: "serious",
      options: ["working", "resolved", "serious"],
    },
    {
      name: "date",
      value: Date.now(),
      type: "datetime",
      description: "Incident Time...",
      attributes: {
        required: true,
      },
    },
  ],
);

export default cms;
