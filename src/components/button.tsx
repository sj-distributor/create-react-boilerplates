export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  const { children, ...rest } = props;

  return <button {...rest}>{children}</button>;
};
