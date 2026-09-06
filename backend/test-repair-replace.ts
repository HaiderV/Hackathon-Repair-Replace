import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();
const localEnvPath = path.resolve(process.cwd(), ".env");
const backendEnvPath = path.resolve(process.cwd(), "backend/.env");
const rootEnvPath = path.resolve(process.cwd(), "../.env");

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
}
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

import { analyzeRepairReplace } from "./src/services/repair-replace-analysis.service.js";

const main = async () => {
  try {
    const result = await analyzeRepairReplace(
      "The zipper slider on my backpack is broken and the zipper no longer closes.",
      "The backpack itself is usable. The zipper slider appears to be damaged."
    );

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Stage 2 test failed:", error);
  }
};

main();