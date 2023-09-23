export type Styles = {
  card: string;
  cardBody: string;
  cardTitle: string;
  main: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
