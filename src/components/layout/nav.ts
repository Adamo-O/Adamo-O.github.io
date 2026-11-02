import { profile } from "@/data/profile";

/** Navigation items shared by Sidebar, MobileHeader and MobileNav. */
export type NavIcon =
  | "user"
  | "flask"
  | "pencil-ruler"
  | "briefcase"
  | "graduation-cap"
  | "award"
  | "send"
  | "file-text"
  | "github"
  | "linkedin"
  | "mail";

export interface NavItem {
  href: string;
  label: string;
  icon?: NavIcon;
  /** Starts the "external links" group: gets the divider rule above it. */
  outline?: boolean;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "#about", label: "About", icon: "user" },
  { href: "#research", label: "Research", icon: "flask" },
  { href: "#experience", label: "Experience", icon: "briefcase" },
  { href: "#projects", label: "Projects", icon: "pencil-ruler" },
  { href: "#education", label: "Education", icon: "graduation-cap" },
  { href: "#awards", label: "Awards", icon: "award" },
  { href: "#contact", label: "Contact", icon: "send" },
];

/** External group, rendered under a divider in the sidebar. CV points at the
 *  PDF everywhere; /cv stays published and crawlable but is not a destination
 *  we send people to. */
export const EXTERNAL_ITEMS: NavItem[] = [
  { href: profile.cvPdf, label: "CV", icon: "file-text", outline: true, external: true },
  { href: profile.links.github, label: "GitHub", icon: "github", external: true },
  { href: profile.links.linkedin, label: "LinkedIn", icon: "linkedin", external: true },
  ...(profile.links.scholar
    ? [{ href: profile.links.scholar, label: "Scholar", icon: "graduation-cap", external: true } satisfies NavItem]
    : []),
  { href: `mailto:${profile.academicEmail}`, label: "Email", icon: "mail" },
];

/** Kept for the md+ header pill row, which has no room for the external group. */
export const CV_ITEM: NavItem = EXTERNAL_ITEMS[0];

/** Bottom tab bar below md: five slots. */
export const MOBILE_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  CV_ITEM,
];
