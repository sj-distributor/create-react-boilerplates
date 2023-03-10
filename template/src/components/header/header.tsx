import { CSSProperties, FC } from "react";

const headerStyle: CSSProperties = {
  fontSize: "40px",
};

export interface HeaderProps {
  children: React.ReactNode;
}

export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const { children } = props;

  return <p style={headerStyle}>{children}</p>;
};
