/** Navigation items shared by Sidebar, MobileHeader and MobileNav. */
export type NavIcon =
  | "user"
  | "flask"
  | "pencil-ruler"
  | "briefcase"
  | "graduation-cap"
  | "award"
  | "send"
  | "file-text";

export interface NavItem {
  href: string;
  label: string;
  icon?: NavIcon;
  /** Render as an outlined pill (used for real page links like /cv). */
  outline?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "#about", label: "About", icon: "user" },
  { href: "#research", label: "Research", icon: "flask" },
  { href: "#projects", label: "Projects", icon: "pencil-ruler" },
  { href: "#experience", label: "Experience", icon: "briefcase" },
  { href: "#education", label: "Education", icon: "graduation-cap" },
  { href: "#awards", label: "Awards", icon: "award" },
  { href: "#contact", label: "Contact", icon: "send" },
];

export const CV_ITEM: NavItem = {
  href: "/cv",
  label: "CV",
  icon: "file-text",
  outline: true,
};

/** Bottom tab bar below md: five slots. */
export const MOBILE_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  CV_ITEM,
];
