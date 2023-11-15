import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "./app/[lng]/i18n/settings";

// accept-languageモジュールにサポート言語を登録する
acceptLanguage.languages(languages);

// ミドルウェアの設定を定義する
export const config = {
  // マッチャーを指定する。api, _next, assets, favicon, swなどのパスを除外する
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

// ミドルウェアの関数を定義する
export function middleware(req: NextRequest) {
  // 言語を格納する変数を宣言する
  let lng;
  // クッキーに言語が設定されていれば、それを取得する
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  // クッキーに言語が設定されていなければ、ヘッダーのAccept-Languageから取得する
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  // ヘッダーにも言語が設定されていなければ、フォールバック言語を使用する
  if (!lng) lng = fallbackLng;

  // パスに含まれる言語がサポート言語でなければ、リダイレクトする
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  // ヘッダーにrefererがあれば、それから言語を取得する
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") || "");
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    // refererから言語が取得できれば、クッキーに設定する
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  // それ以外の場合は、通常のレスポンスを返す
  return NextResponse.next();
}
