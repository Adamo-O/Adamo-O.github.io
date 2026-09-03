/**
 * Single source of truth for personal facts shown on the site.
 * Nothing here is invented; TODO(adamo) marks what still needs confirmation.
 */
export interface Profile {
  name: string;
  initials: string;
  role: string;
  affiliations: string[];
  location: string;
  email: string;
  site: string;
  description: string;
  links: {
    github: string;
    linkedin: string;
    scholar?: string;
    twitter?: string;
    source: string;
  };
  now: { text: string; updated: string };
  heroLines: string[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    spoken: string[];
  };
  cvPdf: string;
}

export const profile: Profile = {
  name: "Adamo Orsini",
  initials: "AO",
  role: "PhD student, Computer Science",
  affiliations: ["Concordia University", "Mila"],
  location: "Montreal, Canada",
  // TODO(adamo): confirm canonical email (site uses the gmail address, CV uses adamo.orsini@mail.concordia.ca)
  email: "adamo.orsini01@gmail.com",
  site: "https://adamoorsini.com",
  description:
    "Adamo Orsini - PhD student in Computer Science at Concordia University / Mila working on mobile GUI agents, human image animation and latent world models.",
  links: {
    github: "https://github.com/Adamo-O",
    linkedin: "https://www.linkedin.com/in/adamo-orsini/",
    scholar: undefined, // TODO(adamo): Google Scholar profile URL
    source: "https://github.com/Adamo-O/Adamo-O.github.io",
  },
  now: {
    text: "TODO(adamo): one line on what you are working on",
    updated: "2026-09",
  },
  heroLines: [
    "I'm a PhD Student in Computer Science studying AI Agents.",
    "My current research projects are focused on Mobile GUI Agents, Mobile App Navigation, and Human Avatar Generation.",
  ],
  skills: {
    languages: ["Python", "TypeScript", "JavaScript", "HTML", "CSS", "Java", "C++"],
    frameworks: ["PyTorch", "NumPy", "Next.js", "React", "Astro", "Express"],
    tools: [], // TODO(adamo): tools block from the CV, if any
    spoken: ["English (Native)", "French (Intermediate)"],
  },
  cvPdf: "/files/Adamo_Orsini_CV.pdf",
};

export default profile;
