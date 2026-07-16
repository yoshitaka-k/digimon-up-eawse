import { serveAsset } from "./common/assets.ts";
import { notFound } from "./common/not_found.ts";
import { handleIndex } from "./pages/index.ts";

// ハンドラー — パスを見て振り分けるだけ
export async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/assets/")) {
    return serveAsset(pathname);
  }

  if (pathname === "/") return handleIndex();

  return notFound();
}
