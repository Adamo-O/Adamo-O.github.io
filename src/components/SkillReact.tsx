import { skillIcons } from "../lib/skillIcons";
import { cn } from "../lib/utils";

interface SkillProps {
  skill: string;
}

const Skill = ({ skill }: SkillProps) => (
  <span
    className={cn(
      "py-0.5 px-1.5 text-xs rounded-full bg-primaryBlueDark/60 border border-white/10",
      skillIcons[skill] ? "inline-flex items-center gap-x-1" : "inline"
    )}
  >
    {skillIcons[skill] && <i className={cn(skillIcons[skill], "text-[0.7rem]")} aria-hidden="true"></i>}
    {skill}
  </span>
);

export default Skill;
