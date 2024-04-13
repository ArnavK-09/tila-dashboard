try {
  try {
    Array.from(Deno.readDirSync("logs")).forEach((X) => {
      Deno.removeSync(`logs/${X.name}`);
    });
  } catch {
    null;
  }
  (async () => await Deno.mkdir("logs").catch(() => null))();
  Deno.writeTextFileSync(
    "logs/.keep",
    "",
  );
  Deno.writeTextFileSync(
    "_data.json",
    `{"tila":{}}`,
  );
  console.log("Cleared Data");
} catch {
  Deno.exit(1);
}
