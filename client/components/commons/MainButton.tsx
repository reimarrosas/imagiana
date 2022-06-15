import { ReactNode } from "react";

interface Props {
  type?: "button" | "submit" | "reset";
  className?: string;
  children: ReactNode;
}

const MainButton = ({ type, className, children }: Props) => (
  <button type={type} className={`px-4 py-2 bg-emerald-400 rounded shadow ${className}`}>
    {children}
  </button>
);

export default MainButton;
