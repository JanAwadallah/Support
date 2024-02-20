export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/", "/dashboard", "/ticket/:path*", "/ticket/new"],
};
