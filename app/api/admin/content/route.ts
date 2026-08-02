import { readPortfolioContent, requirePortfolioAdmin, savePortfolioContent } from "../../../content-store";
import type { PortfolioContent } from "../../../projects";

export const dynamic = "force-dynamic";

function authError(error: unknown) {
  if (!(error instanceof Error)) return null;
  if (error.message === "AUTH_REQUIRED") return Response.json({ error: "Sign in required" }, { status: 401 });
  if (error.message === "FORBIDDEN") return Response.json({ error: "Admin access required" }, { status: 403 });
  return null;
}

export async function GET(request: Request) {
  try {
    const actor = await requirePortfolioAdmin(request);
    const content = await readPortfolioContent(true);
    return Response.json({ ...content, actor }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return authError(error) ?? Response.json({ error: error instanceof Error ? error.message : "Content unavailable" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requirePortfolioAdmin(request);
    const payload = await request.json() as PortfolioContent;
    await savePortfolioContent(payload);
    return Response.json({ ok: true });
  } catch (error) {
    return authError(error) ?? Response.json({ error: error instanceof Error ? error.message : "Save failed" }, { status: 500 });
  }
}
