import { Image } from "astro:assets";
import Button from "./Button";
import { ExternalLink, Github } from "lucide-astro";
import Skill from "./SkillReact.tsx";
import { motion } from "framer-motion";
import type { ProjectProps } from "./Project.astro";

const Project = ({
  frontmatter: { title, dates, skills, img, link, github, secondLink, href },
}: ProjectProps) => (
  <motion.div
    id={href}
    className="grid grid-cols-12 col-span-12 md:col-span-10 lg:col-span-11 gap-3 p-6 bg-primaryBlueDark/10 rounded-xl mb-10"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="flex flex-col justify-between gap-4 col-span-12 lg:col-span-6">
      <div>
        <h2 className="text-3xl lg:text-4xl mb-0.5">{title}</h2>
        <h3 className="text-xl">{dates}</h3>
      </div>
      <div>
        <h3 className="text-2xl lg:text-3xl mb-2">Summary</h3>
        <div className="text-base">
          <slot />
        </div>
      </div>
      <div>
        <h3 className="text-2xl lg:text-3xl mb-2">Skills</h3>
        <div className="flex gap-1.5 flex-wrap text-md">
          {skills.map((skill, i) => (
            <Skill skill={skill} key={i} />
          ))}
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        {link && (
          <Button className="max-md:w-full" href={link} newTab>
            <ExternalLink size="20" className="mr-2" /> Visit Website
          </Button>
        )}
        {github && (
          <Button className="max-md:w-full" href={github} newTab>
            <Github size="20" className="mr-2" /> View on GitHub
          </Button>
        )}
        {secondLink && (
          <Button
            className="max-md:w-full"
            href={secondLink.link}
            newTab
            variant={"outline"}
          >
            {secondLink.text}
          </Button>
        )}
      </div>
    </div>
    <div className="col-span-12 lg:col-span-6 order-1 md:order-0 flex flex-col place-content-center text-center items-center">
      <Image
        className="max-w-[750px] w-full object-contain aspect-video rounded-md"
        src={img}
        alt={`${title} Adamo Orsini`}
        width={750}
        height={300}
      />
    </div>
  </motion.div>
);

export default Project;
