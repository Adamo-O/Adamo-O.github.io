import { skillIcons } from "../lib/skillIcons";
import { cn } from "../lib/utils";

interface SkillProps {
  skill: string;
}

const Skill = ({ skill }: SkillProps) => (
  <p
    className={cn(
      "py-0.5 px-2 rounded-full bg-primaryBlueDark",
      skillIcons[skill] ? "flex items-center gap-x-1.5" : "inline"
    )}
  >
    {skillIcons[skill] && <i className={skillIcons[skill]}></i>}
    {skill}
  </p>
);

export default Skill;
