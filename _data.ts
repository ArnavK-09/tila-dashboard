export const layout = "layout.njk";

export const uptimeChartData = (() => {
  try {
    const LOGS: Array<{ time: string; status: string }> = [];
    const ChartData: { labels: string[]; data: number[] } = {
      labels: [],
      data: [],
    };
    const logs_dir = Deno.readDirSync("logs");
    Array.from(logs_dir).forEach(
      (log) => {
        if (log.isFile && log.name.endsWith(".json")) {
          const DATA = JSON.parse(
            new TextDecoder("utf-8").decode(
              Deno.readFileSync(`logs/${log.name}`),
            ),
          );
          LOGS.push(DATA.tila);
        }
      },
    );

    LOGS.sort(function (a, b) {
      return a.time.localeCompare(b.time);
    });

    LOGS.forEach((X) => {
      ChartData.labels.push(new Date(X.time).toUTCString());
      ChartData.data.push(X.status == "online" ? 1 : 0);
    });

    if (ChartData.labels.length == 1 && ChartData.data.length == 1) {
      ChartData.labels = [...ChartData.labels, ...ChartData.labels];
      ChartData.data = [...ChartData.data, ...ChartData.data];
    }

    return ChartData;
  } catch {
    return [];
  }
})();
