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
  personalEmail: string;
  academicEmail: string;
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
  personalEmail: "adamo.orsini01@gmail.com",
  academicEmail: "adamo.orsini@mila.quebec",
  site: "https://adamoorsini.com",
  description:
    "Adamo Orsini - PhD student in Computer Science at Concordia University / Mila working on mobile GUI agents and world models.",
  links: {
    github: "https://github.com/Adamo-O",
    linkedin: "https://www.linkedin.com/in/adamo-orsini/",
    scholar: "https://scholar.google.ca/citations?hl=en&user=Aei55m0AAAAJ",
    source: "https://github.com/Adamo-O/Adamo-O.github.io",
  },
  now: {
    text: "Deep diving on world models & grinding SoftGolf's mobile app",
    updated: "2026-09",
  },
  heroLines: [
    "I'm a PhD Student in Computer Science studying AI Agents.",
    "My current research focuses on Mobile GUI Agents and World Models.",
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
