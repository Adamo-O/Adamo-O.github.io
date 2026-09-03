/**
 * Single source of truth for personal facts shown on the site.
 * Nothing here is invented; absent values stay hidden until they are confirmed.
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
  // Pending confirmation: the CV currently uses adamo.orsini@mail.concordia.ca.
  email: "adamo.orsini01@gmail.com",
  site: "https://adamoorsini.com",
  description:
    "Adamo Orsini - PhD student in Computer Science at Concordia University / Mila working on mobile GUI agents, human image animation and latent world models.",
  links: {
    github: "https://github.com/Adamo-O",
    linkedin: "https://www.linkedin.com/in/adamo-orsini/",
    scholar: undefined,
    source: "https://github.com/Adamo-O/Adamo-O.github.io",
  },
  now: {
    text: "",
    updated: "2026-09",
  },
  heroLines: [
    "I'm a PhD Student in Computer Science studying AI Agents.",
    "My current research projects are focused on Mobile GUI Agents, Mobile App Navigation, and Human Avatar Generation.",
  ],
  skills: {
    languages: ["Python", "TypeScript", "JavaScript", "HTML", "CSS", "Java", "C++"],
    frameworks: ["PyTorch", "NumPy", "Next.js", "React", "Astro", "Express"],
    tools: [],
    spoken: ["English (Native)", "French (Intermediate)"],
  },
  cvPdf: "/files/Adamo_Orsini_CV.pdf",
};

export default profile;
