import { mkdirSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { PropertyListSchema } from "../src/schemas/property";

const schema = z.toJSONSchema(PropertyListSchema);

mkdirSync("schemas", { recursive: true });

writeFileSync(
  "schemas/property.schema.json",
  JSON.stringify(schema, null, 2) + "\n",
);

console.log("Exported schema to schemas/property.schema.json");