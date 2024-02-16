# 스터디 5주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 5주차 스터디 목차

- [2.26 추가적인 타입검사에는 satisfies 연산자를 사용하자](#226-추가적인-타입검사에는-satisfies-연산자를-사용하자)
- [2.27 타입스크립트는 건망증이 심하다](#227-타입스크립트는-건망증이-심하다)
- [2.28 원시 자료형 브랜딩 기법](#228-원시-자료형-브랜딩-기법)
- [2.29 타입 만들어보기](#229-타입-만들어보기)

  - [2.29.1 판단하는 타입 만들기](#2291-판단하는-타입-만들기)
    - [IsNever](#1-isnever)
    - [IsAny](#2-isany)
    - [IsArray](#3-isarray)
    - [IsTuple](#4-istuple)
    - [IsUnion](#5-isunion)
  - [2.29.2 집합 관련 타입 만들기](#2292-집합-관련-타입-만들기)
    - [1. 차집합](#1-차집합)
    - [2. 대칭차집합](#2-대칭차집합)
    - [3. Exclude](#3-부분집합)
    - [4. Equal](#4-equal)
    - [5. Not Equal](#5-not-equal)

- [2.30 타입스크리브트의 에러 코드로 검색](#230-타입스크립트의-에러-코드로-검색)
- [2.31 함수에 기능을 추가하는 데코레이터 함수](#231-함수에-기능을-추가하는-데코레이터-함수)
  - [context 종류](#context-종류)
- [2.32 앰비언트 선언](#232-앰비언트-선언)

---

<br>

## 2.26 추가적인 타입검사에는 satisfies 연산자를 사용하자

---

```ts
const universe: {
  [key in "sun" | "sirius" | "earth"]:
    | { type: string; parent: string }
    | string;
} = {
  sun: "star",
  sirius: "star",
  earth: { type: "planet", parent: "sum" },
};

universe.earth.type; // error
```

타입을 저렇게 정의하면 earth의 타입이 객체라는 것을 알아차리지 못합니다.<br>
왜냐하면 속성 값의 타입을 객체와 문자열의 유니언으로 표기해놨기에 earth가 문자열일 수도 있다고 판단해서 입니다.

이때, 아래처럼 satisfies 연산자를 사용하면 됩니다.

```ts
const universe = {
  sun: "star",
  sriius: "star", // error
  earth: { type: "planet", parent: "sum" },
} satisfies {
  [key in "sun" | "sirius" | "earth"]:
    | { type: string; parent: string }
    | string;
};
```

<br>

## 2.27 타입 주장은 변수에 적용해야 유지된다.

---

```ts
try {
} catch (error) {
  if (error as Error) {
    error.message; // 'error' is of the 'unknown'
  }
}
```

분면 if 문제서 error를 Error 타입이라 갖에 주장했는데 바로 아랫줄에서는 error가 unknown 이라고 나옵니다.<br>

as로 강제 주장한 것은 일시적인 것으로, if문지 참인지 거짓인지 판단할 떄만 주장한 타입이 사용되고, 판단 후에는 원래 타입으로 돌아가버립니다.

따라서 조건문이 아니라 따로 변수에 직접 타입 주장을 해야합니다.

```ts
try {
} catch (error) {
  const err = error as Error;
  if (err) {
    err.message; // const err: Error
  }
}
```

<br>

## 2.28 원시 자료형 브랜딩 기법

---

타입스크립트에서는 브랜딩 기법을 사용해서, 원시 자료형인 string, number같은 타입도 더 세밀하게 구분할 수 있습니다.

```ts
function kmToMile(km: number) {
  return km * 0.62;
}
const mile = kmToMile(3);
```

위 코드에서 kmToMile 함수는 km를 mile로 변환한 다음 반환하는 함수입니다.<br>
지금은 파라미터 km가 number 타입으로만 되어있지만, 브랜딩 기법을 사용하면 KM 타입, MILE 타입등으로 세분화할 수 있습니다.

```ts
type Brand<T, B> = T & { __brand: B };
type KM = Brand<number, "km">;
type Mile = Brand<number, "mile">;

function kmToMile(km: KM) {
  return (km * 0.62) as Mile;
}

const km = 3 as KM;
const mile = kmToMile(km);
```

<br>

## 2.29 타입 만들어보기

---

지금까지 배운 것으로 유용한 타입을 만들 수 있습니다.

### 2.29.1 판단하는 타입 만들기

특정 타입이 무슨 타입인지 판단하는 타입을 만들어 봅시다.
<br>

#### 1. IsNever

never인지 판단하는 IsNever 타입입니다.

```ts
type IsNever<T> = T extends [never] ? true : false;
```

<br>

#### 2. IsAny

any 타입인지 판단하는 IsAny 타입입니다.

```ts
type IsAny<T> = string extends number & T ? true : false;
```

T가 any인 경우에만 true를 반환합니다<br>
number & T는 number 타입과 T 타입의 교집합입니다. string extends (number & T)는 string 타입이 이 교집합 타입을 확장할 수 있는지를 확인합니다.

any 타입의 경우 모든 타입의 값을 포함할 수 있습니다. 그래서 number & any 는 any 타입입니다. 이 경우 string extends (number & T)는 true를 반환합니다.
따라서 IsAny<T>는 T가 any 타입인지 판별하게 됩니다.

<br>

#### 3. IsArray

배열인지 판단하는 IsArray 타입입니다.

아래처럼 적으면 반례가 있습니다.

```ts
type IsArray<T> = T extends any[] ? true : false;

type one = IsArray<never>; // never
type two = IsArray<any>; // boolean
type three = IsArray<readonly any[]>; // false
```

`IsArray<never>`가 never 되는 것을 막기 위해 `IsNever<T>` 타입을 사용하고,<br>
`IsArray<any>`가 any 되는 것을 막기 위해 `IsAny<T>` 타입을 사용하고,<br>
`IsArray<reaconly []>`가 false가 되는 것을 막기 위해 raadonly unknown[] 을 사용합니다.

```ts
type IsArray<T> = IsNever<T> extends true
  ? false
  : IsAny<T> extends true
  ? false
  : T extends readonly unknown[]
  ? true
  : false;
```

<br>

#### 4. IsTuple

튜플인지를 판단하는 IsTuple 타입입니다. 튜플이 아닌 배열 타입은 false가 되어야 합니다.

튜플은 배열과 달리 길이가 고정되어 있습니다.<br>
튜플이 아닌 배열은 length가 number이고, 튜플은 길이가 3이라면 그 길이에 해당하는 구체적인 숫자 타입인 3 입니다. 즉, number extends T['length']가 false 여야 하는 것이 중요합니다.

```ts
type IsTuple<T> = IsNever<T> extends true
  ? false
  : T extends readonly unknown[]
  ? number extends T["length"]
    ? false
    : true
  : false;
```

<br>

#### 5. IsUnion

유니언인지 판단하는 IsUnion 타입입니다.

```ts
type IsUnion<T, U = T> = IsNever<T> extends true
  ? false
  : T extends T
  ? [U] extends [T]
    ? false
    : true
  : false;
```

<br>

### 2.29.2 집합 관련 타입 만들기

---

타입스크립트의 타입은 집합으로 생각해도 될 정도로 집합의 원리를 따르고 있습니다.

- 전체집합: unknown
- 공집합: never
- 합집합: |
- 교집합: &

#### 1. 차집합 <br>

차집합은 타입스크립트의 유틸리티 타입인 `Omit`타입을 사용하면 됩니다.
Omit 타입은 특정 속성만 제거한 타입을 만들 수 있습니다.

```ts
interface Todo {
  title: string;
  desc: string;
  completed: boolean;
  createdAt: number;
}

// Todo에서 desc 속성을 제거한 타입
type TodoPreview = Omit<Todo, "desc">;

const todo: TodoPreview = {
  title: "clean room",
  completed: false,
  createdAt: 123123,
};
```

A가 {name: string, age: number}
B가 {name: string, married: boolean}인 경우 둘의 차집합인<br>
A-B는 {age: number} 입니다.<br>
B-A는 {married: boolean} 입니다.

```ts
type Diff<A, B> = Omit<A & B, keyof B>;
type R1 = Diff<
  { name: string; age: number },
  { name: string; married: boolean }
>;
// type R1 = {age: number}
```

<br>

#### 2. 대칭차집합

{name: string, age: number}와 {name: string, married: boolean}의 대칭차집합은 {age: number, married: boolean}입니다.<br>
합집합에서 교집합을 뺀 겻이라고 볼 수 있습니다.

```ts
type SymDiff<A, B> = Omit<A & B, keyof (A | B)>;
type R2 = SymDiff<
  { name: string; age: number },
  { name: string; married: boolean }
>;
// type R2 = { age: number, married: boolean}
```

- 유니언에서 대칭차집합
  ```ts
  type SymDiffUnion<A, B> = Exclude<A | B, A & B>;
  type R3 = SymDiffUnion<1 | 2 | 3, 2 | 3 | 4>;
  ```

#### 3. 부분집합

A가 B타입에 대입가능하다면 A는 B의 부분집합이다.

```ts
type IsSubset<A, B> = A extends B ? true : false;
type R1 = IsSubset<string, string | number>; // true
type R2 = IsSubset<{ name: string; age: number }, { name: string }>;
```

#### 4. Equal

두 타입이 서로 동일하다는 것을 판단하는 타입

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;
```

#### 5. Not Equal

```ts
type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;
```

<br>

## 2.30 타입스크립트의 에러 코드로 검색

---

타입스크립트 에러 메시지에는 항상 숫자가 있습니다.

```ts
const arr1: string[] = ["1", "2", "3"];
const arr2: Array<number> = [1, 2, 3];
arr1.push(4);
// Argument of type 'number' is not assignable to parameter of type 'string'. (2345)
```

구글에 TS2345로 검색하면 에러에 대한 해결 방법이 나옵니다.<br>
[타입스크립트 에러 모음 사이트](https://typescript.tv/errors/)

<br>

## 2.31 함수에 기능을 추가하는 데코레이터 함수

데코레이터는 클래스의 기능을 증강하는 함수로 여러 함수에서 공통으로 수행되는 부분을 데코레이터로 만들어두면 좋습니다.

```ts
class A {
  eat() {
    console.log("start");
    console.log("Eat");
    console.log("end");
  }

  work() {
    console.log("start");
    console.log("Work");
    console.log("end");
  }

  sleep() {
    console.log("start");
    console.log("Sleep");
    console.log("end");
  }
}
```

```ts
function startAndEnd<This, Args extends any[], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  function replacementMethod(this: any, ...args: Args): Return {
    console.log("start");
    const result = originalMethod.call(this, ...args);
    console.log("end");
    return result;
  }
  return replacementMethod;
}

class A {
  @startAndEnd
  eat() {
    console.log("Eat");
  }
  @startAndEnd
  work() {
    console.log("Work");
  }
  @startAndEnd
  sleep() {
    console.log("Sleep");
  }
}
```

context는 데코레이터의 정보를 갖고 있는 매개변수입니다. 어디에 장식하냐에 따라서 context의 타입을 교체하면 됩니다.

### context 종류(유형)

- ClassDecoratorContext: 클래스 자체를 장식할 때
- ClassMethodDecoratorContext: 클래스 메서드를 장식할 때
- ClassGetterDecoratorContext: 클래스의 getter를 장식할 때
- ClassSetterDecoratorContext: 클래스의 setter를 장식할 때
- ClassMemberDecoratorContext: 클래스 멤버를 장식할 때
- ClassAccessorDecoratorContext: 클래스 accessor를 장식할 때
- ClassFieldDecoratorContext: 클래스 필드를 장식할 때

context 객체 타입

```ts
type Context = {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
    has?(vale: unknown): boolean;
  };
  private?: boolean;
  static?: boolean;
  addInitializer?(initializer: () => void): void;
};
```

- kind: 데코레이터 유형 (e.g., ClassDecoratorContext, ClassMethodDecoratorContext ...)
- name: 장식 대상의 이름
- access: has, get, set 등의 접근자를 모아둔 객체
- private: private 여부
- static: static 여부
- addInitializer: 초기화할 때 실행되는 메서드

<br>

## 2.32 앰비언트 선언

---

타입스크립트에서 남의 라이브러리를 사용할 때 그 라이브러리가 자바스크립트라면 직접 타이핑해야 하는 경우가 생깁니다.

그럴 때 `declare` 예약어를 사용해서 앰비언트 선언을 사용할 수 있습니다.

```ts
declare namespace NS {
  const v: string;
}

declare enum Enum {
  ADMIN = 1,
}

declare function func(param: number): string;

declare const variable: number;

declare class C {
  constructor(p1: string, p2: string);
}

new C(func(variable), NS.v);
```

위의 코드에서 declare 키워드는 타입스크립트 컴파일러에게 NS 네임스페이스, Enum 열거형, func 함수, variable 변수, 그리고 C 클래스가 어딘가에 존재하며, 그들의 타입이 무엇인지를 알려주는 역할을 합니다.

그래서 외부 파일에 실제 값이 존재한다고 믿기 때문에, 타입만 있어도 값으로 사용할 수 있습니다.

그런데 값이 없으면 코드를 실행할 때 런타임에러가 발생합니다. 따라서 declare로 앰비언트 선언할 때는 반드시 해당 값이 존재하는지 확인해야 합니다.

네임스페이스,타입,값

| 유형         | 네임스페이스 | 타입 | 값  |
| ------------ | ------------ | ---- | --- |
| 네임스페이스 | O            |      | O   |
| 클래스       |              | O    | O   |
| enum         |              | O    | O   |
| 인터페이스   |              | O    |     |
| 타입 별칭    |              | O    |     |
| 함수         |              |      | O   |
| 변수         |              |      | O   |
|              |              |      |     |

<br>
인터페이스, 네임스페이스, 함수는 여러 번 선언할 수 있습니다.<br>
인터페이스나 네임스페이스는 같은 이름으로 여러 개 존재할 때 병합됩니다.<br>
함수는 여러 번 선언되면 오버로딩됩니다.
