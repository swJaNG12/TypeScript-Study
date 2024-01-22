type A1 = string;
type B1 = A1 extends string ? number : boolean;
type B2 = {
  t: number;
  f: number;
}[A1 extends string ? "t" : "f"];
