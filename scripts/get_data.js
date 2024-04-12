import puppeteer from "npm:puppeteer-core";

(async () => {

  const DATA = JSON.parse(new TextDecoder("utf-8").decode(await Deno.readFile("_data.json")));
  const BROWSERLESS_ENPOINT = Deno.env.get('BROWSERLESS_SERVER');
  const WEBSITE = DATA.tila.domain;
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://${BROWSERLESS_ENPOINT}/?token=6R0W53R135510`,
  });
  const page = await browser.newPage();
  await page.goto(`https://${WEBSITE}`).catch(async ()=> {
    DATA.tila.status = "error";
  
    await Deno.writeFile('_data.json', new TextEncoder().encode(JSON.stringify(DATA)))
  
    Deno.exit(0)
  });


  // metrics
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing)),
  );
  const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
  const metrics = await page.metrics();
  const ttfb = performanceTiming.responseStart - performanceTiming.requestStart;
  const domContentLoadedTime = performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart;
  const memoryInfo = await page.metrics();
  const memoryUsage = memoryInfo.JSHeapUsedSize / 1024 / 1024; 

  const RESULT =  {
    memory_usage: Math.floor(memoryUsage),
    dom_load_time: domContentLoadedTime,
    time_to_first_byte: ttfb,
    frames: metrics.Frames,
    total_nodes: metrics.Nodes,
    event_listeners: metrics.ttfb,
    load_time: loadTime
  }
  DATA.tila.metrics = RESULT;
  DATA.tila.status = "online"
  DATA.tila.time = new Date().toUTCString();
  await Deno.writeFile('_data.json', new TextEncoder().encode(JSON.stringify(DATA)))

  Deno.exit(0)
})();
