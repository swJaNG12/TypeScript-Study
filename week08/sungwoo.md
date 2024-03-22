# 스터디 8주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 8주차 스터디 목차

- [3.8 reduce 만들기](#38-reduce-만들기)
- [3.9 flat 분석하기](#39-flat-분석하기)
- [3.10 Promise, Awaited 타입 분석하기](#310-promise-awaited-타입-분석하기)
- [3.11 bind 분석하기](#311-bind-분석하기)

    <br>

## 3.8 reduce 만들기

reduce 메서드를 타이핑 하겠습니다.

reudce 매서드는 2개의 인수가 있습니다. <br>

- 콜백함수
- 초기값

reduce 메서드 콜백함수의 매개변수는 4개 입니다.

- acc: 누적값
- cur: 현재값
- i: 인덱스
- arr: 원본 배열

그리고 reduce 메서드의 2번째 인수인 초기값이 있을 때와 없을 때 다르게 동작합니다.<br>

- 초기값이 있을 경우:acc가 초기값으로 된다.
- 초기값이 없을 경우: 배열의 첫번째 요소가 초기값

```ts
interface Array<T> {
  myReduce(callback: (a: T, c: T, i: number, arr: T[]) => T, iV?: T): T;
}
const r1 = [1, 2, 3].myReduce((a, c) => a + c);
const r2 = [1, 2, 3].myReduce((a, c, i, arr) => a + c, 10);
const r3 = [{ num: 1 }, { num: 2 }, { num: 3 }].myReduce(
  // error
  function (a, c) {
    return { ...a, [c.num]: "hi" };
  },
  {}
);
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myReduce(
  // error
  function (a, c) {
    return a + c.num;
  },
  ""
);
```

r3과 r4에서 에러가 발생합니다.

- r3 <br>
  myReduce 메서드에 대한 인터페이스에서는, callback 함수의 반환 타입이 입력 배열의 요소 타입과 동일합니다. 현재 myReduce에서 callback 함수는 배열의 각 요소(T)를 받아서 같은 타입(T) 값을 반환해야 합니다.

  r3에서 myReduce에서, 입력 배열의 요소 타입은 {num: number} 이고, callback 함수는 {[c.num]: 'hi'} 타입의 객체를 반환하고 있습니다. 따라서 에러가 발생하며, 입력 배열의 요소 타입과 callback 함수의 반환 타입이 일치하지 않기 때문에 에러가 발생합니다.

- r4 <br>
  r4도 r4와 같은 이유로 에러가 발생합니다. myReduce의 입력 배열의 요소 타입은 {num:number}이지만, 콜백함수의 반환 타입은 string 이기 떄문에 일치하지 않아 에러가 발생합니다.

이렇게 반환값은 입력 배열의 요소 타입과 다를 수도 있으므로 오버로딩을 추가해야 합니다.

```ts
interface Array<T> {
  myReduce(callback: (a: T, c: T, i: number, arr: T[]) => T, iV?: T): T;
  myReduce<S>(callback: (a: S, c: T, i: number, arr: T[]) => S, iv: S): S;
}
```

초기값이 있는 경우 초기값 타입이 최종 반환값의 타입이 되므로 타입 매개변수 S를 새로 설정하고 초기값이 있으면 첫 순회에서 a가 초기값이 되기 때문에 a의 타입도 S로 설정합니다. 그리고 myReudce의 최종 반환값도 S가 됩니다.

lib.es5.d.ts 코드

```ts
interface Array<T> {
	(...)
	reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[])=> T): T;
	reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
	reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
}
```

## 3.9 flat 분석하기

배열 flat 메서드는 직접 타이핑하지 않고 만들어진 코드를 보면서 분석하겠습니다.

```ts
const A = [[1, 2, 3], [4, [5]], 6];
// const A: (number | (number | number[])[])[]

const R = A.flat();
console.log(R); // [1, 2, 3, 4, [5], 6]
// const R: (number | number[])[]

const RR = R.flat();
console.log(RR); // [1, 2, 3, 4, 5, 6]
// const RR: number[]

const RRR = RR.flat();
console.log(RRR); // [1, 2, 3, 4, 5, 6]
// const RRR: number[]

const R2 = A.flat(2);
console.log(R2); //  [1, 2, 3, 4, 5, 6]
// const R2: number[]
```

- flat()은 배열의 차원을 낮추는 메서드입니다.
- flat()애서 인수는 낮출 차원 수를 의미합니다. 인수를 전달하지 않으면 1차원 낮아지고, 인수를 전달하면 전달한 만큼의 차원 수가 낮아집니다.

flast은 es2019에 추가된 메서드라 lib.es2019.d.ts에 들어 있습니다.

lib.es2019.d.ts

```ts
type FlatArray<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends readonlyArray<infer innerArr>
    ? FlatArray<
        InnerArr,
        [
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20
        ][Depth]
      >
    : Arr;
}[Depth extends -1 ? "done" : "recur"];

interface Array<T> {
  flatMap<U, This = undefined>(
    callback: (
      this: This,
      value: T,
      index: number,
      array: T[]
    ) => U | ReadonlyArray<U>,
    thisArg?: This
  ): U[];

  flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
}
```

ex2019에 flatMap, flat 메서드가 추가되었는데 이 둘을 Array 인터페이스를 선언해서 기존 인터페이스를 병합하고 있습니다.<br>

<br>

flat<br>
lib.es2019.array.d.ts

```ts
interface Array<T> {
  flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
}
```

- flat의 매개변수는 A와 D타입
- A는 원본배열, D는 flat이 몇 차원 낮출지 결정하는 매개변수이고 number타입이고 기본값은 1
- 반환값 타입은 FlatArray<A, D>[]

<br>

flatArray<br>
lib.es2019.array.d.ts

```ts
type FlatArray<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends ReadonlyArray<infer innerArr>
    ? FlatArray<
        InnerArr,
        [
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20
        ][Depth]
      >
    : Arr;
}[Depth extends -1 ? "done" : "recur"];
```

FlatArray는 `Depth extends -1 ? 'done' : 'recur'` 부분에서 Depth의 값에 따라서 done또는 recur에 접근하는 인덱스 접근 타입입니다.

```ts
// Depth가 -1인 경우
type FlatArray<Arr, -1> = Arr;

// Depth가 -1이 아닌 경우
type FlatArray<Arr, Depth extends number> = Array extends ReadonlyAray<infer InnerArray>
	? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
	: Arr;
```

<br>
Depth가 -1이 아닌 경우<br>
(number | (number | number[])[])[] 타입인 3차원 배열에 flat() 메서드를 호출한 경우를 알아보겠습니다.
flat()으로 호출하면 Depth의 기본값은 1입니다. 따라서 아래처럼 작성할 수 있습니다.

```ts
FlatArray<(number | (number | number[])[])[], 1>[]
```

Depth가 1이 아니므로 recur로 이동합니다.<br>

1. recur에서 `Arr extends ReadonlyArray<infer innerArr>` 부분을 먼저 보면, 모든 배열은 ReadonlyArray의 서브타입 이므로 Arr이 배열이라면 항상 참입니다.
2. `ReadonlyArray<infer InnerArr>` 이 부분을 통해 Arr이 배열이라면 Arr의 요소 타입을 추론할 수 있습니다. 아래는 그 예시 코드입니다.
   ```ts
   type ElementType<T> = T extends Array<infer U> ? U : never;
   type R = ElementType<string[]>;
   // type R = string;
   ```
   현재 Arr은 (number | (number | number[])[])[] 타입인 3차원 배열입니다. 따라서 `ReadonlyArray<infer InnerArr>`이 부분에서 추론되는 배열의 요소 타입은 `number | (number | number[])[]` 가 됩니다. <br>
   아래 코드에서 확인할 수 있습니다.
   ```ts
   type GetInner<Arr> = Arr extends ReadonlyArray<infer InnerArr>
     ? InnerArr
     : never;
   type Inner = GetInner<(number | (number | number[])[])[]>;
   // type Inner = number | (number | number[])[]
   ```
3. 2번에서 추론한 InnerArr 타입을 다시 FlatArray의 첫 번째 타입 인수로 제공합니다.
4. FlatArray에 두 번째 타입 인수로 제공한 [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]를 보겠습니다.<br>

   ```ts
   FlatArray<
     InnerArr,
     [
       -1,
       0,
       1,
       2,
       3,
       4,
       5,
       6,
       7,
       8,
       9,
       10,
       11,
       12,
       13,
       14,
       15,
       16,
       17,
       18,
       19,
       20
     ][Depth]
   >;
   ```

   역시 인덱스 접근 타입입니다. Depth가 0이면 -1이 되고, Depth가 1이라면 0이됩니다.

   따라서

   ```ts
   FlatArray<number | (number | number[])[], 0>;
   ```

   이 됩니다.

5. 아직 Depth가 -1이 아니기 떄문에 한 번더 같은 과정을 거칩니다.

   ```ts
   number | (number | number[])[] extends ReadonlyArray<infer InnerArr>
   ```

   부분에서는 유니온 타입이 조건부 타입에 들어갔기 때문에 분산 조건부 타입이 됩니다.

   ```ts
   number extends ReadonlyArray<infer InnerArr> | (number | number[])[] extends ReadonlyArray<infer InnerArr>
   ```

   이때 `number extends ReadonlyArray<infer InnerArr>` 는 false라 number <br>
   `(number | number[])[] extends ReadonlyArray<infer InnerArr>` 는 true라 최종적으로 number | number[]가 됩니다.<br>

   `number | number | number[]` 는 `number | number[]` 가 되서, FlatArray에서 Arr가 number | (number | number[])[], Depth가 0일 때 InnerArr는 `number | number[]`가 되고 Depth는 -1이 됩니다.

6. `FlatArray<number | number[], -1>`이 되었습니다.

   ```ts
   type FlatArray<Arr, Depth extends number> = {
     done: Arr;
     recur: Arr extends ReadonlyArray<infer innerArr>
       ? FlatArray<
           InnerArr,
           [
             -1,
             0,
             1,
             2,
             3,
             4,
             5,
             6,
             7,
             8,
             9,
             10,
             11,
             12,
             13,
             14,
             15,
             16,
             17,
             18,
             19,
             20
           ][Depth]
         >
       : Arr;
   }[Depth extends -1 ? "done" : "recur"];
   ```

   Depth가 -1이기 때문에 Arr 즉, `number | number[]`가 봔환됩니다.

7. flat 메서드의 반환값 타입을 보겠습니다.

   ```ts
   interface Array<T> {
     flatMap<U, This = undefined>(
       callback: (
         this: This,
         value: T,
         index: number,
         array: T[]
       ) => U | ReadonlyArray<U>,
       thisArg?: This
     ): U[];

     flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
   }
   ```

   `FlatArray<A, D>[]`입니다.<br>
   따라서 최종 결과물은 `(number | number[])[]`가 됩니다.

## 3.10 Promise, Awaited 타입 분석하기

이번에는 Promise와 Awaited 타입을 분석하면서 타입 추론이 어떻게 이루어지는지 확인해보겠습니다.

lib.es2015.promise.d.ts

```ts
interface PromiseConstructor {
  readonly prototype: Promise<any>;
  new <T>(
    executor: (
      resolve: (value: T | PromiseList<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ): Promise<T>;

  all<T extends readonly unknown[] | []>(
    value: T
  ): Promise<{ -readonly [P in keyof T]: Awaited<T[p]> }>;

  race<T extends readonly unknown[] | []>(
    value: T
  ): Promise<Awaited<T[number]>>;

  refect<T = never>(reason?: any): Promise<T>;

  resolve(): Promise<void>;

  resolve<T>(value: T): Promise<Awaited<T>>;

  resolve<T>(value: T | PromiseList<T>): Promise<Awaited<T>>;
}

declare var Promise: PromiseConstructor;
```

PromiseConstructor 인터페이스가 실제 Promise 객체의 타입입니다.<br>
new를 붙여 호출할 수도 있고, all. race, reject, resolve 등의 메서드가 있다고 알려주고 있습니다.

아래 코드를 분석해보겠습니다.

```ts
const str1 = Promise.resolve("promise");
// const str1: Promise<string>

const str2 = await Promise.resolve("promise");
// const str2: string

export {};
```

타입스크립트에서 await이 붙으면 타입이 Awaited 제네릭 타입으로 감싸집니다.

- str1은 resolve의 반환값이 `Promise<Awaited<string>>` 입니다.
- str2는 await이 붙어있기 때문에 Awaited 제네릭 타입에 감싸져서 resolve의 반환값이 `Awaited<Promise<Awaited<string>>>` 입니다.
- `Promise<Awaited<string>>` 는 `Promise<string>`, `Awaited<Promise<Awaited<string>>>`는 `string`입니다.

왜 이렇게 되는지 알아보기 위해 Awaited 타입을 보겠습니다.

lib.es5.d.ts

```ts
type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfulled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? Awaited<V>
    : never
  : T;
```

3개의 컨디셔널 타입이 있습니다.

- 첫 번째 컨디셔널 타입: `T extends null | undefined` <br>
  T가 null이나 undefined인지 확인합니다.

- 두 번째 컨디셔널 타입: `T extends object & { then(onfulfilled: infer F, ...args: infer _): any }`<br>
  T가 object & { then(onfulfilled: infer F, ...args: infer \_): any }를 extends 하는지 확인합니다.

  이 값이 false 라면 T가 반환되므로 object 타입이 아닌 string, boolean, number의 경우<br>
  `Awaited<string>`은 string<br>
  `Awaited<number>`은 number<br>
  `Awaited<boolean>`은 boolean<br>

  즉 객체가 Awaited 제네릭 타입에 T가 객체가 아니라면 그 타입이 그대로 반환됩니다.<br>
  이를 규칙 1번이라고 하겠습니다.
  `Awaited<객체가 아닌 값> === 객체가 아닌 값`

  규칙 1번에 의해서 `Promise<Awaited<string>>`의 값은 `Promise<string>`이 됩니다.

  T가 객체인 경우에도 추가로 `{ then(onfulfulled: infer F, ...args: infer _): any }`를 만족하는지 확인합니다. then이라는 메서드를 가지고 있어야 하는데 Promise 인스턴스가 then 메서드를 갖고 있습니다.

  Promise.resolve에서의 Promise는 Promise 객체입니다.<br>
  new Promise()나 Promise.resolve()의 반환값이 Promise 인스턴스입니다.

  Promise 인스턴스의 타입을 확인해보겠습니다.<br>
  lib.es5.d.ts

  ```ts
  interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): Promise<TResult1 | TResult2>;

    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): Promise<T | TResult>;
  }
  ```

  then과 catch 메서드를 가지고 있는것이 보입니다. 따라서 Promise 객체는 두 번째 컨디셔널 타입에서 true가 나옵니다.

- 세 번째 컨디셔널 타입: `F extends (value: infer V, ...args: infer _) => any`

  두 번째 컨디셔널 타입에서 infer로 추론한 F로 ((value: infer V, ...args: infer \_) => any)를 extends 하는지 확인하고, extedns 한다면 첫 번째 매개변수 V를 infer로 추론합니다.

  Awaited<T>에서 T가 Promise일 때 T를 Promise<X>라고 할 수 있습니다.

## 3.11 bind 분석하기

함수의 메서드인 bind를 분석해보겠습니다.

아래는 this 바인딩과 bind 메서드에서 대한 예제입니다.

```ts
function a(this: Window | document) {
  return this;
}
const b = a.bind(document);
const c = b();
```

bind 메서드를 이용하여 a함수의 this 값을 document로 바인딩하고, 바인딩된 함수 b를 호출합니다.

lib.es5.d.ts

```ts
interface Function {
  bind(this: Function, thisArg: any, ...argArray: any[]): any;
}

interface CallableFunction extends Function {
  bind<T, A extends any[], B extends any[], R>(
    this: (this: T, ...args: [...A, ...B]) => R,
    thisArg: T,
    ...args: A
  ): (...args: B) => R;
	(...)
}
```

bind 함수의 오버로딩은 13개 가 됩니다.

```ts
function add(a = 0, b = 0, c = 0, d = 0, e = 0) {
  return a + b + c + d + e;
}

const add0 = add.bind(null);
add0(1, 2, 3, 4, 5);

const add1 = add.bind(null, 1);

const add2 = add.bind(null, 1, 2);

const add3 = add.bind(null, 1, 2, 3);

const add4 = add.bind(null, 1, 2, 3, 4);

const add5 = add.bind(null, 1, 2, 3, 4, 5);
```

add0의 bind는 인수가 1개 이므로 CallableFunction 의 첫 번째 bind 선언에 해당합니다.

lib.es5.d.ts

```ts
interface CallableFunction extends Function {
	(...)
	bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
	(...)
}
```

add0에서 T에 해당하는 값은 (a?: number, b?: number, c?: number, d?: number, e?: number) => number 함수입니다.

ThisParameterType과 OmitThisParameter 타입이 무엇지도 알아야 합니다.

lib.es5.d.ts

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
  ? U
  : unknown;

type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T;
```

ThisParameterType<T> 타입은 T가 함수이면, this를 infer해서 가져오고, infer 할 수 없다면 unknown이 되는 타입입니다.

OmitTHisParameter<T> 타입은 ThisParameterType이 unknown이면 T가 되고, T가 (..args: infer A ) => infer R 꼴의 함수면 (...args: A) => R 꼴의 함수가 됩니다.

이번에는 add1 함수를 보겠습니다.

```ts
function add(a = 0, b = 0, c = 0, d = 0, e = 0) {
  return a + b + c + d + e;
}

const add1 = add.bind(null, 1);
add1(2, 3, 4, 5);
add1(2, 3, 4, 5, 6);
// Exprected 0-4 arguments, but got 5.
```

add1 함수는 this가 null이고 첫 번째 매개변수가 1로 bind되어 있습니다. 인수는 4개까지만 받으면됩니다.
어떻게 인수를 4개까지만 넣어야 하는지 알 수 있을까요? add1 함수의 bind는 다음과 같은 타입입니다.

lib.es5.d.ts

```ts
interface CAllableFunction extends Function {
  bind<T, A0, A extends any[], R>(
    this: (this: T, arg0: A0, ...args: A) => R,
    thisArg: T,
    arg0: A0
  ): (...args: A) => R;
}
```

bind의 thisArg인 T는 null이거, arg0인 A0은 1입니다. A0으로 this를 제외한 첫 번쨰 매개변수를 표현하고 그 첫 번째 매개변수를 제외한 나머지 매개변수는 A입니다.

`this: (this: T, arg0: A0, ...args: A) => R`는 bind가 호출되는 대상 함수의 타입을 나타냅니다. 이 함수는 this 매개변수의 타입 T, 첫 번째 일반 매개변수의 타입 A0, 나머지 매개변수의 타입 A, 반환 타입 R을 가집니다.

`thisArg: T, agr0: A0`은 bind 메서드의 첫 번째와 두 번째 인자의 타입을 나타냅니다. 첫 번째 인자 thisArg는 바인딩할 this 값의 타입 T이며, 두 번째 인자 arg0는 첫번째 일반 매개변수의 값의 타입 A0입니다.

`(..args: A) => R`은 bind 메서드가 반환하는 함수의 타입을 나타냅니다. 이 함수는 첫 번째 일반 매개변수는 제거하고, 나머지 매개변수의 타입 A, 반환 타입 R을 가집니다.
<br>
