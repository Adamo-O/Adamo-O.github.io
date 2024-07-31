import { cn } from "@/lib/utils";
import { Button as ShadcnButton, type ButtonProps } from "./ui/button";

interface Props extends ButtonProps {
  href: string;
  title?: string;
  newTab?: boolean;
  className?: string;
  display?: "block" | "inline-block" | "flex" | "inline" | "inline-flex";
  staticSize?: boolean;
}

const Button = ({
  href,
  title,
  newTab = false,
  className,
  display = "inline",
  variant = "default",
  staticSize,
  ...props
}: Props) => (
  <a
    href={href}
    target={newTab ? "_blank" : "_self"}
    className={cn("w-fit h-fit", !staticSize && "max-md:w-full")}
    style={{ display }}
    title={title}
    aria-label={title}
  >
    <ShadcnButton variant={variant} {...props} className={className}>
      <slot />
    </ShadcnButton>
  </a>
);

export default Button;