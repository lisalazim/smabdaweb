import { ArrowRight } from "lucide-react";

export default function Button({ children, variant = "solid", href = "#ppdb" }) {
  return (
    <a className={`btn ${variant}`} href={href}>
      {children}
      <ArrowRight size={17} strokeWidth={1.8} />
    </a>
  );
}
