import puppeteer from "npm:puppeteer-core";

(async () => {
  try {
    let DATA = JSON.parse(
      new TextDecoder("utf-8").decode(await Deno.readFile("_data.json")),
    );
    const CONFIG = JSON.parse(
      new TextDecoder("utf-8").decode(await Deno.readFile("CONFIG.json")),
    );
    const WEBSITE = Deno.env.get("WEBSITE_DOMAIN") ?? CONFIG.domain;
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${
        Deno.env.get("BROWSERLESS_SERVER_DOMAIN") ?? "chrome.browserless.io"
      }/?token=${Deno.env.get("BROWSERLESS_TOKEN") ?? "6R0W53R135510"}`,
    });
    const page = await browser.newPage();
    await page.goto(`https://${WEBSITE}`);

    // metrics
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing)),
    );
    const loadTime = performanceTiming.loadEventEnd -
      performanceTiming.navigationStart;
    const metrics = await page.metrics();
    const ttfb = performanceTiming.responseStart -
      performanceTiming.requestStart;
    const domContentLoadedTime = performanceTiming.domContentLoadedEventEnd -
      performanceTiming.navigationStart;
    const memoryInfo = await page.metrics();
    const memoryUsage = memoryInfo.JSHeapUsedSize / 1024 / 1024;

    const RESULT = {
      memory_usage: Math.floor(memoryUsage),
      dom_load_time: domContentLoadedTime,
      time_to_first_byte: ttfb,
      frames: metrics.Frames,
      total_nodes: metrics.Nodes,
      event_listeners: metrics.ttfb,
      load_time: loadTime,
    };
    if (!DATA.tila) {
      DATA = {};
      DATA.tila = {};
    }
    DATA.tila.domain = CONFIG.domain;
    DATA.tila.metrics = RESULT;
    DATA.tila.status = "online";
    DATA.tila.time = new Date().toUTCString();
    await Deno.writeFile(
      "_data.json",
      new TextEncoder().encode(JSON.stringify(DATA)),
    );

    await Deno.writeFile(
      `logs/${DATA.tila.time}.json`,
      new TextEncoder().encode(JSON.stringify(DATA)),
    ).catch(console.log);

    Deno.exit(0);
  } catch (e) {
    console.error(e);
    await Deno.writeFile(
      "_data.json",
      new TextEncoder().encode(JSON.stringify({ status: "error" })),
    );

    Deno.exit(0);
  }
})();
