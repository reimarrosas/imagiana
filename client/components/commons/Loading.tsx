import Image from "next/image";
import { ReactNode } from "react";

import spinner from "../../public/images/tail-spin.svg";

interface Props {
  isLoading: boolean;
  children: ReactNode;
}

const Loading = ({ children, isLoading }: Props) => (
  <>
    {isLoading ? (
      <Image src={spinner} alt="Spinning loader for asynchronous data." />
    ) : (
      children
    )}
  </>
);

export default Loading;
