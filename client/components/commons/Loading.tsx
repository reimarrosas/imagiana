import { ReactNode } from "react";

interface Props {
  isLoading: boolean;
  children: ReactNode;
}

const Loading = ({ children, isLoading }: Props) => (
  <>
    {isLoading ? (
      <img
        src="/images/tail-spin.svg"
        alt="Spinning loader for asynchronous data."
      />
    ) : (
      children
    )}
  </>
);

export default Loading;
