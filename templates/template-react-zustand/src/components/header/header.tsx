import { CSSProperties, FC } from "react";

const headerStyle: CSSProperties = {
  fontSize: "40px",
};

export interface IHeaderProps {
  children: React.ReactNode;
}

export const Header: FC<IHeaderProps> = (props: IHeaderProps) => {
  const { children } = props;

  return <p style={headerStyle}>{children}</p>;
};
