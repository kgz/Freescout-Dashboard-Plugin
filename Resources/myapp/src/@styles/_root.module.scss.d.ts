export type Styles = {
  danger: string;
  default: string;
  secondarybg: string;
  success: string;
  textTitle: string;
  warning: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
