export type Styles = {
  add: string;
  addContainer: string;
  content: string;
  dashboard: string;
  main: string;
  module: string;
  rotate: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
