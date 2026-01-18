export { auth as middleware } from "./auth"

export const config = {
  // Only protect dashboard route to minimize middleware bundle
  matcher: ["/dashboard/:path*"],
}
