/**
 * Imports required
 */
const express = require("express");
const puppeteer = require("puppeteer-core");
const { h } = require("preact");
const { render } = require("preact-render-to-string");

/**
 * New express server
 */
const app = express();

/**
 * GET /
 */
app.get("/", async (_, res) => {
  /**
   * Initializing pptr with browserless
   */
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "wss://fluffy-robot-wxxpjrpr4xw357rj-3000.app.github.dev/?token=6R0W53R135510",
  });
  const page = await browser.newPage();

  /**
   * Demo website to further processing
   */
  await page.goto("https://google.com");

  /**
   * Processing Logic script goes here
   */
  const DATA = await page.evaluate((_) => {
    const bannedEls = ["STYLE", "SCRIPT"];
    const properties = ["width", "height", "background-color", "font-family"];
    const clonedElements = [];
    for (const el of document.querySelector(_).children) {
      if (!bannedEls.includes(el.tagName)) {
        let elData = {
          tagName: el.tagName.toLowerCase(),
          id: el.id ?? undefined,
          classList: [],
          hasChildNodes: el.hasChildNodes(),
          attributes: [],
          children: [],
          styles: [],
        };
        if (elData.tagName == "link") {
          const attrs = Array.from(el.attributes);
          attrs.forEach((a) => {
            elData.attributes.push({
              name: a.name,
              value: a.value,
            });
          });
          clonedElements.push(elData);
        } else if (!elData.hasChildNodes) {
          properties.forEach((x) => {
            elData.styles.push({
              name: x,
              value: getComputedStyle(el).getPropertyValue(x),
            });
          });
          elData.classList = Array.from(el.classList).map((cl) => cl) ?? [];
          elData.attributes = Array.from(el.attributes).map((atr) => {
            return {
              name: atr.name,
              value: atr.value,
            };
          });
          clonedElements.push(elData);
        } else {
          const furtherChilds = (A) => {
            let data = {
              tagName: A.tagName.toLowerCase(),
              id: A.id ?? undefined,
              classList: Array.from(A.classList).map((cl) => cl) ?? [],
              hasChildNodes: A.hasChildNodes(),
              attributes: Array.from(A.attributes).map((atr) => {
                return {
                  name: atr.name,
                  value: atr.value,
                };
              }),
              children: [],
              styles: [],
            };
            properties.forEach((x) => {
              data.styles.push({
                name: x,
                value: getComputedStyle(A).getPropertyValue(x),
              });
            });
            if (!A.hasChildNodes()) return data;

            for (childEl of A.children) {
              data.children.push(furtherChilds(childEl));
            }
            return data;
          };

          clonedElements.push(furtherChilds(el));
        }
      }
    }
    return clonedElements;
  }, "body");

  /**
   *  Data Elements
   */
  let CLONED_HTML = ``;
  let CLONED_STYLES = ``;

  DATA.forEach((htmlNode) => {
    const processElement = (element) => {
      const elementChildren = ['<div class="todi">todoo</div>'];
      // element.children.forEach((e) => elementChildren.push(processElement(e)));

      let stylesOfEl = "";
      let metaOfEl = {};
      const elementUniqueID = crypto.randomUUID().replaceAll("-", "_");
      element.attributes.forEach((attr) => {
        if (attr.name.startsWith("data-") || attr.name == "class") return;
        metaOfEl[attr.name] = attr.value;
      });
      element.styles.forEach(
        (style) => (stylesOfEl += `    ${style.name}: ${style.value};\n`),
      );
      metaOfEl.class = `${elementUniqueID}`;
      if (element.id.length !== 0) metaOfEl.id = element.id;
      CLONED_STYLES += `\n.${elementUniqueID} {\n${stylesOfEl}}`;
      const clonedElement = h(
        element.tagName,
        metaOfEl,
        elementChildren.map((x) => x),
      );
      return render(clonedElement);
    };

    CLONED_HTML += processElement(htmlNode);
  });

  /**
   * Rendering logic
   */

  /**
   * Closing browser after completing logic
   */
  // console.log(DATA)
  browser.close();

  /**
   * Sends response
   */
  return res.send(CLONED_HTML);
});

/**
 * Starts express server
 */
app.listen(8080);
