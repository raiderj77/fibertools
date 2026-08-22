export function isEmbedPath(pathname) {
  return pathname === "/embed" || pathname.startsWith("/embed/");
}
