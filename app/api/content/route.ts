import { readPortfolioContent } from "../../content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await readPortfolioContent(false);
    return Response.json(content, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Content unavailable" }, { status: 500 });
  }
}
