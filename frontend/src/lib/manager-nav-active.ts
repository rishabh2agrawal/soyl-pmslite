/** Sidebar + bottom nav: disambiguate manager "Bookings" vs "New booking" routes. */
export function isManagerTabActive(pathname: string, href: string): boolean {
  if (href === "/app/manager/bookings/new") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === "/app/manager/bookings") {
    if (pathname.startsWith("/app/manager/bookings/new")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (pathname === href) return true;
  if (href === "/app/manager" || href === "/app/owner") return false;
  return pathname.startsWith(`${href}/`);
}
