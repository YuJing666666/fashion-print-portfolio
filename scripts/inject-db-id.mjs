/**
 * 构建后自动将真实的 D1 database_id 注入到 dist/server/wrangler.json
 * 读取 .openai/hosting.json 或环境变量 D1_DATABASE_ID
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const wranglerPath = "dist/server/wrangler.json";
if (!existsSync(wranglerPath)) {
  console.error("✗ dist/server/wrangler.json not found. Run build first.");
  process.exit(1);
}

// 优先使用环境变量，其次用固定值（已创建的 portfolio-db）
const DATABASE_ID = process.env.D1_DATABASE_ID || "3ea6a43d-f87e-4a1b-9882-dd7e9f9cab52";
const DATABASE_NAME = "portfolio-db";

const config = JSON.parse(readFileSync(wranglerPath, "utf8"));
if (!config.d1_databases || !config.d1_databases[0]) {
  console.error("✗ No d1_databases in wrangler.json");
  process.exit(1);
}

config.d1_databases[0].binding = "DB";
config.d1_databases[0].database_name = DATABASE_NAME;
config.d1_databases[0].database_id = DATABASE_ID;

writeFileSync(wranglerPath, JSON.stringify(config));
console.log(`✓ Injected D1 database: ${DATABASE_NAME} (${DATABASE_ID})`);
