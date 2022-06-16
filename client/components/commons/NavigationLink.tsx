import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

interface Props {
  linkRef?: string;
  clickHandler?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
}

const linkStyle =
  "cursor-pointer text-slate-100 text-md font-semibold relative after:absolute after:top-full after:left-0 after:h-0.5 after:bg-slate-100 after:w-full after:origin-center after:scale-x-0 transition-transform hover:after:scale-x-100 after:ease-in after:duration-150";

const NavigationLink = ({ linkRef, clickHandler, children }: Props) =>
  linkRef ? (
    <Link href={linkRef}>
      <a onClick={clickHandler} className={linkStyle}>
        {children}
      </a>
    </Link>
  ) : (
    <a onClick={clickHandler} className={linkStyle}>
      {children}
    </a>
  );

export default NavigationLink;
