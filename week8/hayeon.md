# 스터디 8주차

### 📝 8주차 스터디 목차

## 목차

- [3.8 reduce 만들기](#38-reduce-만들기)
- [3.9 flat 분석하기](#39-flat-분석하기)
- [3.10 Promise](#310-promise)
- [3.11 bind 분석하기](#311-bind-분석하기)

# 3.8 reduce 만들기

> lib.es5.d.ts를 참고

- lib.es5.d.ts를 참고 두 번째 인수인 초깃값이 있을 때와 초깃값이 없을 때 서로 다르게 동작한다.
  - 초깃값이 없다면 첫 번째 배열의 요소가 초깃값이 된다.
  - 초깃값이 있다면 초깃값의 타입이 최종 반환값 타입이 되므로 타입 매개변수 `S`를 선언해 사용한다. (콜백 함수의 반환값,초깃값 iV, reduce의 반환값 전부 S타입으로 바꿈)

```ts
// 메서드 초깃값 :iV
// 누적값 a,
// 현재값 c
// 인덱스 i
// 원본 배열 arr
const r1 = [1, 2, 3].myReduce((a, c) => a + c); // 6
const r2 = [1, 2, 3].myReduce((a, c, i, arr) => a + c, 10); // 16
const r3 = [{ num: 1 }, { num: 2 }, { num: 3 }].myReduce(function (a, c) {
  return { ...a, [c.num]: "hi" };
}, {}); // { 1: 'hi', 2: 'hi', 3: 'hi' }
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myReduce(function (a, c) {
  return a + c.num;
}, ""); // '123'

interface Array<T> {
  //초깃값이 없는 경우
  myReduce(callback: (a: T, c: T, i: number, arr: T[]) => T, iV?: T): T;
  //초깃값이 있는 경우,최종 반환값 타입이 되므로 타입 매개변수 S
  myReduce<S>(callback: (a: S, c: T, i: number, arr: T[]) => S, iV: S): S;
  // 오버로딩  : reduce 메서드의 반환값은 요소의 타입과 다를 수도 있으므로 오버로딩을 추가해야 한다.

  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue: T
  ): T;
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ): U;
}
```

<br/>

# 3.9 flat 분석하기

> flat은 ES2019에 추가된 메서드이므로 플레이그라운드 TS Config 메뉴에서 target을 ES2019로 변경해줘야 한다.

```ts
const A = [[1, 2, 3], [4, [5]], 6]; //3차원 배열

const R = A.flat(); // [1, 2, 3, 4, [5], 6] //2차원 배열
// const R: (number | number[])[]
const RR = R.flat(); // [1, 2, 3, 4, 5, 6] //1차원 배열
// const RR: number[]
const RRR = RR.flat(); // [1, 2, 3, 4, 5, 6] //1차원 배열
// const RRR: number[]

const R2 = A.flat(2); // [1, 2, 3, 4, 5, 6] //1차원 배열
// const R2: number[]
```

- flat은 배열의 차원을 한 단계씩 낮추는 메서드이다.flat 메서드에는 인수로 낮출 차원 수를 넣어줄 수 있다.인수를 넣지 않으면 1차원만 낮추고, 인수를 제공하면 그 차원만큼 낮춘다.
  R2는 2차원을 낮춘 것이므로 바로 1차원이 된다.
  <br/>

#### 타입스크립트는 어떻게 한 차원 낮아진 타입을 추론할 수 있을까?

```ts
interface Array<T> {
  flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
}
```

- flat 메서드의 매개변수는 `A`와 `D` 타입있다. `A`는 원본 배열을 의미,`D`는 flat 메서드의 매개변수인 낮출 차원 수를 의미한다.
- `D`는 차원 수 이므로 number 이고,인수를 제공하지 않으면 기본적으로 한 차원을 낮추므로 D `extends number = 1`로 되어 있다.
- 반환값 ` FlatArray<A, D>[]`

```ts
type FlatArray<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends ReadonlyArray<infer InnerArr>
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
}[Depth extends -1 ? "done" : "recur"]; //Depth는 flat 메서드가 낮출 차원 수,기본 값 : 1
```

- FlatArray는 컨디셔널 타입을 인덱스 접근 타입으로 나타낸 것이다. [2.15절 참고](https://github.com/swJaNG12/TypeScript-Study/blob/main/week4/hayeon.md#215-%EC%A1%B0%EA%B1%B4%EB%AC%B8%EA%B3%BC-%EB%B9%84%EC%8A%B7%ED%95%9C-%EC%BB%A8%EB%94%94%EC%85%94%EB%84%90-%ED%83%80%EC%9E%85%EC%9D%B4-%EC%9E%88%EB%8B%A4)

```ts
type R = FlatArray<[[[[[[[[[[[[[[[[[[[[[[[1, 2, [3]]]]]]]]]]]]]]]]]]]]]]]], 21>;
// type R = [1, 2, [3]]
type R2 = FlatArray<
  [[[[[[[[[[[[[[[[[[[[[[[1, 2, [3]]]]]]]]]]]]]]]]]]]]]]]],
  22
>;
// type R2 = 1 | 2 | 3
```

<br/>

### R의 경우 Depth별 결괏값 정리

| Depth |                   Arr                   | Depth extends -1 |               InnerArr 또는 Arr               |
| ----- | :-------------------------------------: | :--------------: | :-------------------------------------------: |
| 1     | (number \| (number \| number[ ])[ ])[ ] |      false       | InnerArr = number \| (number \| number[ ])[ ] |
| 0     |   number \| (number \| number[ ])[ ]    |      false       |      <br>InnerArr = number \| number[ ]       |
| -1    |           number \| number[ ]           |       true       |           Arr = number \| number[ ]           |

- Depth가 1이 아닌 경우

```ts
const R2 = A.flat(2); // [1, 2, 3, 4, 5, 6]
// const R2: number[]
```

<br/>

### R2의 경우 Depth별 결괏값 정리

| Depth | Arr                                     | Depth extends -1 | InnerArr 또는 Arr                             |
| ----- | --------------------------------------- | ---------------- | --------------------------------------------- |
| 2     | (number \| (number \| number[ ])[ ])[ ] | false            | InnerArr = number \| (number \| number[ ])[ ] |
| 1     | (number \| number[ ])[ ])               | false            | InnerArr = number \| number[ ]                |
| 0     | number \| number[ ]                     | false            | InnerArr = number                             |
| -1    | number                                  | true             | Arr = number                                  |

<br/>

# 3.10 Promise , Awaited 타입 분석하기

> ES2015에 도입된 기능이므로 lib.es2015.promise.d.ts에 들어 있다.

```ts
//lib.es2015.promise.d.ts;

interface PromiseConstructor {
  // 실제 Promise 객체의 타입
  readonly prototype: Promise<any>;
  new <T>(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ): Promise<T>;

  all<T extends readonly unknown[] | []>(
    values: T
  ): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

  race<T extends readonly unknown[] | []>(
    values: T
  ): Promise<Awaited<T[number]>>;

  reject<T = never>(reason?: any): Promise<T>;

  resolve(): Promise<void>;

  resolve<T>(value: T): Promise<Awaited<T>>;

  resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
} // 많은 메서드가 있음

declare var Promise: PromiseConstructor;
```

#### Awaited 타입 분석하기

```ts
//lib.es5.d.ts
type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable
```

- 컨디셔널 타입은 T가 null이나 undefined인지 확인
  - `Awaited<null>`은 null이고, `Awaited<undefined>`는 undefined이다.
- 두 번째 컨디셔널 타입은 T가 `object & { then(onfulfilled : infer F, ...args : infer _) : any`를 extends하는지 확인
  - T가 string, boolean, number의 경우는 object가 아니므로 false임
- ` Awaited<string>`은 string, `Awaited<boolean>`은 boolean, `Awaited<number>`는 number이다.

#### 규칙 1번: Awaited<객체가 아닌 값> === 객체가 아닌 값

```ts
const str1 = Promise.resolve("promise");
// const str1: Promise<string>
const str2 = await Promise.resolve("promise");
// const str2: string
export {};
```

> 규칙 1번으로 인해 str1의 타입은 `Promise<Awaited<string>>`은 `Promise<string>`이 된다.

### Promise 인스턴스의 타입

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

- `Awaited<T>`에서 T가 Promise인 상황이므로 T를 `Promise<X>`라고 해보면, `X`는 임의의 타입을 나타내는 미지수이다. onfulfilled 콜백 함수의 타입은 `(value: X) => TResult1 | PromiseLike<TResult1>) | undefined | null`이므로, `Awaited<T>`에서의 `F`이다.. 다시 F 함수에서 첫 번째 매개변수인 value를 찾을 수 있으므로, . value의 타입은 `X` 이다. 이것이 `Awaited<T>`에서의 `V`이다.

즉, T가 Promise 객체일 때 `Awaited<T>`는 `Awaited<V>`가 되는데 T는 `Promise<X>`이고, V는 X입니다. 따라서 `Awaited<Promise<X>>`는 `Awaited<X>`가 된다.

#### 규칙 2번: Awaited<Promise<T>> === Awaited<T>

- 위의 코드에서 str2는 규칙 2번에 의해 `Awaited<string>`이 되므로 최종적으로 string이 된다.
  <br>

### Promise.all 분석하기

```ts
  /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }>;

    // see: lib.es2015.iterable.d.ts
    // all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;

```

- values의 타입인 T는 ` [string, Promise<number>, Promise<Promise<boolean>>]`이고, Promise.all의 반환값은 `Promise<{ -readonly [P in keyof T] : Awaited<T[P]> }>`인 매핑된 객체 타입이 된다.

더 쉽게 풀어서 써보면 다음과 같다.

```ts
Promise<{
  0: Awaited<string>; //규칙 1번에 따라 string이 됨
  1: Awaited<Promise<number>>; //규칙 2번에 따라 Awaited<number> -> 다시 규칙 1번에 따라 number이 됨ㄴ
  2: Awaited<Promise<Promise<boolean>>>;
  // 규칙 2번에 따라 Awaited<Promise<boolean>> ->  Awaited<boolean> -> 다시 규칙 1번에 따라 boolean이 됨
  // 나머지 배열, 속성들
}>;
```

```ts
const all = await Promise.all([
  "string",
  Promise.resolve(123),
  Promise.resolve(Promise.resolve(true)),
]);
// const all: [string, number, boolean]
export {};
```

### 메서드 체이닝한 Promise의 타입 분석

```ts
const chaining = await Promise.resolve("hi") // Promise<string> 타입
  .then(() => {
    return 123;
  })
  .then(() => {
    return true;
  })
  .catch((err) => {
    console.error(err);
  });
// const chaining: boolean | void
export {};
```

<br>

### then과 catch 메서드의 타입분석

```ts
//lib.es5.d.ts
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

<br>

# 3.11 bind 분석하기

타입스크립트에서 bind() 메서드는 함수나 메서드에서 this 키워드의 값을 고정시키는 역할을 한다.

```ts
//lib.es5.d.ts
interface Function {
  //..
  bind(this: Function, thisArg: any, ...argArray: any[]): any;

  // ..
}
```

- `this: Function` : bind가 호출될 함수의 타입
- `thisArg: any` : 새로운 함수가 호출될 때 설정할 this 값
- ` ...argArray: any[]` : 원본 함수에 전달될 추가 인수들

#### 예제로 알아보기

```ts
function add(a = 0, b = 0, c = 0, d = 0, e = 0) {
  return a + b + c + d + e;
}

const add0 = add.bind(null);
// const add0: (a?: number, b?: number, c?: number, d?: number, e?: number) => number
const add1 = add.bind(null, 1);
// const add1: (b?: number | undefined, c?: number | undefined, d?: number | undefined, e?: number | undefined) => number
const add2 = add.bind(null, 1, 2);
// const add2: (c?: number | undefined, d?: number | undefined, e?: number | undefined) => number
const add3 = add.bind(null, 1, 2, 3);
// const add3: (d?: number | undefined, e?: number | undefined, e?: number | undefined) => number
const add4 = add.bind(null, 1, 2, 3, 4);
// const add4: (e?: number | undefined) => number
const add5 = add.bind(null, 1, 2, 3, 4, 5);
// const add5: (...args: (1 | 2 | 3 | 4 | 5)[]) => number
add0(1, 2, 3, 4, 5); // 15
//add0의 bind는 인수가 한 개이므로 CallableFunction의 첫 번째 bind 선언에 해당한다.-> lib.es5.d.ts 참고
```

- add0의 경우 bind() 메서드를 사용하여 this와 모든 인수를 미리 설정하지 않았기 때문에, add0 함수는 add 함수와 동일한 시그니처를 가지게 되므로 add0(1, 2, 3, 4, 5)와 같이 를 호출하면, add0 함수는 add 함수와 동일한 결과인 15를 반환하게 된다.

#### CallableFunction

```ts
//lib.es5.d.ts

interface CallableFunction extends Function {
  //..
  bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
  //..
}
```

- add0의 bind는 인수가 한 개이므로 CallableFunction의 첫 번째 bind 선언에 해당한다.

#### ThisParameterType, OmitThisParameter

```ts
//lib.es5.d.ts

type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
  ? U
  : unknown;

type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T;
```

- `ThisParameterType<T>`는 T가 함수이면, this를 infer해서 가져오고, infer할 수 없다면 unknown이 되는 타입이다.
- `OmitThisParameter<T>` 타입은 `ThisParameterType`이 unknown이면 T가 되고, T가 `(...args: infer A) => infer R`꼴의 함수이면 `(...args: A) => R` 꼴의 함수가 된다. 기존 함수에서 this타입을 제거한 함수
