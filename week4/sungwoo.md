# 스터디 4주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 4주차 스터디 목차

---

- [2.14 제네릭으로 타입을 함수처럼 사용하자](#214-제네릭으로-타입을-함수처럼-사용하자)
  - [2.14.1 제네릭에 제약 걸기](#2141-제네릭에-제약-걸기)
- [2.15 조건문과 비슷한 컨디셔널 타입이 있다](#215-조건문과-비슷한-컨디셔널-타입이-있다)
  - [2.15.1 컨디셔널 타입 분배법칙](#2151-컨디셔널-타입-분배법칙)
  - [배열로 제네릭을 감싸면 분배법칙이 일어나지 않게 막을 수 있습니다](#배열로-제네릭을-감싸면-분배법칙이-일어나지-않게-막을-수-있습니다)
- [2.16 함수와 메서드를 타이핑하자](#216-함수와-메서드를-타이핑하자)
  - [함수에서 매개변수 나머지 문법](#힘수에서-매개변수-나머지--문법)
  - [함수에서 매개변수 전개 문법](#함수에서-매개변수-전개--문법)
  - [매개변수 구조분해 할당 시 주의할 점](#매개변수-구조분해-할당-시-주의할-점)
  - [함수 this 타이핑](#함수-this-타이핑)
  - [메서드 this 타이핑](#메서드-this-타이핑)
  - [오버로딩](#오버로딩)
    - [함수 오버로딩](#함수-오버로딩)
    - [인터페이스 오버로딩](#인터페이스-오버로딩)
    - [타입 별칭 오버로딩](#타입-별칭-오버로딩)
- [2.17 같은 이름의 함수를 여러 번 선언할 수 있다](#217-같은-이름의-함수를-여러-번-선언할-수-있다)

<br>

## 2.14 제네릭으로 타입을 함수처럼 사용하자

---

이제까지 우리가 사용했던 number, string 같은 타입은 항상 고정되어 절대 변하지 않는 타입을 사용했습니다. 즉, 상수처럼 사용했습니다. 이것은 타입의 안전성을 보장하지만, 때로는 코드의 재사용성을 제한할 수 있습니다.<br>
제네릭을 사용함으로써 개발자는 타입을 파라미터처럼 전달할 수 있게 되어, 하나의 함수나 클래스가 다양한 타입으로 작업할 수 있도록 만들어줍니다.

- 인터페이스에서의 타입 중복

```ts
interface Zero {
  type: "human";
  race: "yellow";
  name: "zero";
  age: 28;
}
interface Nero {
  type: "human";
  race: "yellow";
  name: "nero";
  age: 32;
}
```

Zero, Nero 인터페이스를 보면 type과 race 속성의 타입은 동일합니다.<br>
하지만, name과 age 속성의 타입은 다릅니다.<br>
이럴 때 제네릭을 사용해서 중복을 제거할 수 있습니다.

```ts
interface Person<N, A> {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
}
interface Zero extends Person<"zero", 28> {}
interface Nero extends Person<"nero", 32> {}
```

제네릭 표기는 <>로 하며, 인터페이스 이름 바로 뒤에 위치합니다.<br>
<>안에는 타입 매개변수를 넣습니다. 타입 매개변수의 이름은 마음대로 붙일수는 있지만 관습적으로 대문자 알파벳 한글자로 처리하는 편입니다.<br>

위에서, name과 age 속성의 타입을 N, A로 만들었습니다.<br>
선언한 제네릭을 사용할 때는 Person<'zero', 28>, Person<'nero', 32>와 같이 매개변수에 대응하는 실제 타입 인수를 넣으면 됩니다.

```ts
interface Zero extends Person<"zero", 28> {}
// 최종적으로 다음과 같은 꼴이 됨
interface Zero {
  type: "human";
  race: "yellow";
  name: "zero";
  age: 28;
}
```

- 제네릭으로 배열 인터페이스 재사용

```ts
// 제네릭이 없었다면 아래처럼 요소 타입별로 선언해야 합니다.
interface StringArray {
  [key: number]: String;
  length: number;
}
interface BooleanArray {
  [key: number]: Boolean;
  length: number;
}

// 제네릭을 사용하면 아래처럼 사용할 수 있습니다.
interface Array<T> {
  [key: number]: T;
  length: number;
  // 기타 속성들
}
```

- 타입별칭 제네릭

```ts
type Person<N, A> = {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
};
type Zero = Person<"zero", 28>;
type Nero = Person<"nero", 32>;
```

- 클래스 제네릭

```ts
class Person<N, A> {
  name: N;
  age: A;
  constructor(name: N, age: A) {
    this.name = name;
    this.age = age;
  }
}
```

- 함수 제네릭, 표현식이냐, 선언문이냐에 따라, 제네릭 표기 위치가 달라집니다.

```ts
// 함수 표현식
const personFactoryE = <N, A>(name: N, age: A) => {
  return {
    type: "human",
    race: "yellow",
    name,
    age,
  };
};

// 함수 선언문
function personFactoryD<N, A>(name: N, age: A) {
  return {
    type: "human",
    race: "yellow",
    name,
    age,
  };
}
```

<br>

타입 매개변수에는 기본값(default)을 사용할 수 있습니다.

```ts
interface Person<N = string, A = number> {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
}
type Person1 = Person;
// type Person1 = Person<string, numbe>
type Person2 = Person<number>;
// type Person2 = Person<number, number>
type Person3 = Person<number, boolean>;
// type Person3 = Person<number, boolean>
```

타입 인수로 N과 A 자리에 타입을 제공하지 않으면 각각의 타입 매개변수는 기본값 타입이 됩니다.

Person3 처럼, 다른 타입을 명시적으로 넣었다면 그 타입이 됩니다.

- 제네릭 위치 정리
  - interface 이름<타입 매개변수들> {...}
  - type 이름<타입 매개변수들> = {...}
  - class 이름<타입 매개변수들> {...}
  - function 이름<타입 매개변수들>(...) {...}
  - const 이름 = <타입 매개변수들>(...) => {...}

<br>

### 2.14.1 제네릭에 제약 걸기

extend 문법으로 상속 뿐만아니라, 타입 매개변수의 제약을 표시할 수 있습니다.

```ts
interface Example<A extends number, B = string> {
  a: A;
  b: B;
}

type Usecase1 = Example<string, boolean>;
// Type 'string' does not satisfy the constraint 'number'.
type Usecase2 = Example<1, boolean>;
type Usecase3 = Example<number>;
```

- Usecase1 : A 자리에 string을 넣으니, 제약을 충족시키지 못했다는 에러가 발생한다.
- Usecase2 : A 자리에 number이기도 하면서 numbe보다 구체적인 1 리터럴 타입을 넣었습니다. 특정 타입 매개변수에 제약이 걸리면 제약에 어긋나는 타입은 입력할 수 없지만 제약보다 구체적인 타입은 입력할 수 있습니다.

<br>

하나의 타입 매개변수가 다른 타입 매개변수의 제약이 될 수도 있습니다.

```ts
interface Example<A, B extends A> {
  a: A;
  b: B;
}
type Usecase1 = Example<string, number>;
// Type 'number' does not satisfy the constraint 'string'.
type Usecase2 = Exampel<string, "hello">;
type Usecase3 = Example<number, 123>;
```

<br>

## 2.15 조건문과 비슷한 컨디셔널 타입이 있다.

---

조건에 따라 다른 타입이 되는 컨디셔널 타입이 있습니다.<br>
`extends`를 사용하고, 여기의 extends는 삼항연산자와 같이 사용됩니다.

> 특정 타입 extends 다른 타입 ? 참일 때 타입 : 거짓일 때 타입

특정 타입을 다른 타입에 대일 할 수 있을 때 참이 됩니다.<br>
즉, 특정 타입이 다른 타입의 부분집합일 때 참이 됩니다.

```ts
type A1 = string;
type B1 = A1 extends string ? number : boolean;
// type B1 = number

type A2 = number;
type B2 = A2 extends string ? number : boolean;
// type B2 = boolean
```

<br>

컨디셔널 타입은 타입 검사를 위해서도 많이 사용합니다.

```ts
type Result = "hi" extends string ? true : false;
type Result2 = [1] extends [string] ? true : false;
```

<br>

또한 컨디셔널 타입은 제네릭, never와 함께 아래 예시처럼 많이 사용합니다.<br>

```ts
type ChooseArray<A> = A extends string ? string[] : never;
type StringArray = ChooseArray<string>;
// type StringArray = string[]
type Never = ChooseArray<number>;
// type Never = never
```

참고로 never는 모든 타입에 대입할 수 있기에 모든 타입을 extends 할 수 있습니다.

```ts
type Result = never extends string ? true : false;
// type Result = true
```

<br>

매핑된 객체 타이에서 키가 nerver이면 해당 속성은 제거됩니다.<br>
이 특성을 이용해 아래처럼 컨디셔널 타입을 활용할 수 있습니다.

```ts
type OmitByType<O, T> = {
  [k in keyof O as O[k] extends T ? never : k]: O[k];
};

// O[k] extends T ? never : k 에서 속성의 타입이 T면 never가 됩니다.
// 따라서 속성의 타입이 T인 속성들은 전부 제거됩니다.

type Result = OmitByType<
  {
    nane: string;
    age: number;
    married: boolean;
    rich: boolean;
  },
  boolean
>;
/*
type Result = {
	name: string;
	age: number;
}
*/
```

또는 인덱스 접근 타입으로 컨디셔널 타입을 표현할 수도 있습니다.

```ts
type A1 = string;
type B1 = A1 extends string ? number : boolean;
type B2 = {
  t: number;
  f: boolean;
}[A1 extends string ? "t" : "f"];
```

<br>

### 2.15.1 컨디셔널 타입 분배법칙

아래 코드에서 Result의 타입은 무엇일까요?

```ts
type Start = string | number;
type Result = Start extends string ? Start[] : never;
```

결과는 `type Result = never` 입니다.<br>
Start extends string은 Start타입을 string 타입으로 확장, 할당 가능한가를 묻는것과 같습니다.<br>
Start는 string에 할당할 수 없으므로 Result의 타입은 never가 됩니다.

<br>

이때 제네릭 타입을 이용하면 타입스크립트는 다르게 해석합니다.

```ts
type Start = string | number;
type Result<key> = key extends string ? key[] : never;

let n: Result<Start> = ["hi"];
// let n: string[]
```

제네릭에 유니업 타입이 사용될 경우, 각 유니언 멤버에 대해 타입을 개별적으로 적용합니다.<br>
즉, `Result<Start>`는 `Result<string>` 또는 `Result<number>`가 됩니다.

따라서` Result<string>`은 string extends string ? string[] : never이므로 string[]를 반환하고, `Result<number>`는 number extends string ? number[] : never이므로 never를 반환합니다. 그 결과 `Result<Start>`는 string[] | never가 되는데, never는 유니언 타입에서 무시되므로 결과적으로 `Result<Start>`는 string[] 타입이 됩니다.

<br>

이떄, boolean 분배법칙에서 boolean은 true | false로 인식합니다.

```ts
type Start = string | number | boolean;
type Result<key> = key extends string | boolean ? key[] : never;
let n: Result<Start>;
// let n: string[] | true[] | false[]
```

- #### 배열로 제네릭을 감싸면 분배법칙이 일어나지 않게 막을 수 있습니다.

  ```ts
  type IsString<T> = T extends string ? true : false;
  type Result = isString<"hi" | 3>;
  // type Result = boolean
  ```

  isString<'hi'> 는 true, isString<3>은 false 이므로 true | false입니다.<br>
  최종적으로 boolean이 됩니다.

  Result의 타입을 false로 만들고 싶다면 아래처럼 분배법칙을 막으면 됩니다.

  ```ts
  type IsString<T> = [T] extends [string] ? true : false;
  type Result = IsString<"hi" | 3>;
  // type Result = false;
  ```

  분배법칙이 일어나지 않아서, ['hi' | 3]이 [string]을 extends 하는지 검사하므로 false가 됩니다.

  <br>

- 컨디셔널 타입에서 제네릭과 never가 만나면 never가 됩니다. never를 타입 인수로 사용하려면 분배법칙이 일어나는 것을 막야야 합니다.

  ```ts
  type R<T> = T extends string ? true : false;
  type RR = R<never>;
  // type RR = never

  type IsNever<T> = [T] extends [never] ? true : false;
  type T = isNever<never>;
  // type T = true;
  type F = isNever<never>;
  // type F = false;
  ```

<br>

## 2.16 함수와 메서드를 타이핑하자

---

먼저, 전에 배운 타입스크립트에서 함수의 매개변수를 타이핑하는 방법을 다시 살펴봅시다.

```ts
function example(a: string, b?: number, c = false) {}
example("hi", 123, true);
exmaple("hi", 123);
example("hi");
```

- b?: number 는 옵셔널 수식어가 붙어있어서, 넣어도 그만, 안 넣어도 그만이라는 뜻입니다.
- c = false 는 변수는 c는 기본값으로 false가 들어있다는 뜻입니다. 또한 기본값이 제공된 매개변수는 자동으로 옵셔널이 됩니다.

### 힘수에서 매개변수 나머지 ... 문법

```ts
function example1(a: string, ...b: number[]) {}
exmaple1("hi", 1123, 4, 56);
function example2(...a: string[], b: number) {}
// error :  A rest parameter must be last in a parameter list.
```

- 나머지 매개변수 문법을 사용하는 매개변수는 항상 배열이나 튜플 타입이어야 합니다.
- 나머지 매개변수 문법은 매개변수의 마지막 자리에만 위치해야 합니다.

### 함수에서 매개변수 전개 ... 문법

```ts
function example3(...args: [number, string, boolean]) {}
// function example3(args_0: number, args_1: string, args_2: boolean): void
example3(1, "2", false);

function example4(...args: [a: number, b: string, c: boolean]) {}
// function example4(a: number, b: string, c: boolean): void
```

- example3, example4 함수에서 튜플 타입을 전개했습니다.
- example3 에서는 매개변수의 이름이 임의로 정해집니다.
- example4 에서는 매개변수의 이름을 직접 정했습니다.

<br>

### 매개변수 구조분해 할당 시 주의할 점

매개변수를 타이핑할 때 주의할 점은 구조분해 할당을 적용할 때 입니다.

```ts
function destructuring({ prop: { nested: string } }) {}
// error : Binding element 'string' implicitly has an 'any' type.
```

위 코드처럼 작성하면 에러가 발생합니다.<br>
그 이유는 구조분해 할당의 별칭 기능과 혼동되기 때문입니다.<br>

자바스크립트 구조분해 할당에서는 아래코드처럼, : 뒤에 새로운 이름을 제공하여 원래의 속성 이름을 변경할 수 있습니다.

```js
const obj = {
  a: "string",
  b: 12,
};
const { a: name1, b: name2 } = obj;
```

그러나 TypeScript에 : 는 타입 주석을 나타내므로, {prop1: string} 형태는 prop1이라는 이름의 속성이 string 타입이라는 의미로 해석됩니다. 그래서 { props: { prop1: string } } 형태를 사용하면, props 객체의 prop1 속성의 별칭을 string으로 설정하려는 것으로 오해할 수 있습니다. 이는 올바르지 않은 사용법이므로 오류를 발생시킵니다.

올바르게 타이핑 하려면 아래처럼 해야합니다.

```ts
function destructuring({ prop: { nested } }: { prop: { nested: string } }) {}
```

<br>

### 함수 this 타이핑

함수 내부에서 this를 사용하는 경우에는 명시적으로 표기해야 합니다.<br>
그리고 this는 매개변수의 첫 번째 자리에 표기하면 됩니다.

```ts
function example2(this: window) {
  console.log(this);
}
```

다만 타입스크립트는 this가 될 수 없는 타입을 부여하면 에러를 표시합니다.

```ts
function example3(this: Document, a: string, b: "this") {}
example3("hello", "this");
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'Document'.
example3.call(document, "hello", "this");
```

이때는 call 메서드 등을 활용해 this의 값을 명시적으로 지정해주어야 합니다.

<br>

### 메서드 this 타이핑

일반적으로는 this가 메서드를 가지고 있는 객체 자신으로 추론되므로 명시적으로 타이핑할 필요는 없지만, this가 바뀔 수 있을 떄는 명시적으로 타이핑해야 합니다.

```ts
type Animal = {
  age: number;
  type: "dog";
};
const person = {
  name: "zero",
  age: 28,
  sayName() {
    this;
    this.name;
  },
  sayAge(this: Animal) {
    this;
    this.type;
  },
};
person.sayAge.bind({ age: 3, type: "dog" });
```

<br>

## 2.17 같은 이름의 함수를 여러 번 선언할 수 있다.

---

### 오버로딩

#### 함수 오버로딩

2개의 인수를 받아서 더한 값을 반환하는 add 함수를 만든다고 해봅시다.<br>
이 함수는 숫자로만 2개의 값을 받거나, 문자열로만 2개의 값을 받게하고 싶습니다.<br>
어떻게 작성해야 할까요?

```ts
function add(x: string | number, y: string | number): string | number {
  return x + y;
}
```

이렇게 작성하면 에러가 발생합니다.

이럴 때 필요한 기법이 `오버로딩`입니다.<br>
호출할 수 있는 함수의 타입을 미리 여러개 타이핑해두는 기법입니다.

```ts
function add(x: number, y: number): number;
function add(x: string, y: string): string;
function add(x: any, y: any) {
  return x + y;
}
add(1, 2);
add("1", "2");
add(1, "2"); // error
add("1", 2); // error
```

처음 두 선언은 구현부 없이 타입만 있습니다.<br>
마지막 선언은 구현부가 있고 매개변수 타입이 any입니다.<br>
any를 제거하면 ImplicitAny 에러가 발생하여 any를 명시적으로 사용합니다.<br>

다만 x, y가 실제로 될 수 있는 타입은 오버로딩한 타입의 조합인<br>
{x: number, y: number},<br>
{x: string, y: string} 만 가능합니다.

오버로딩의 순서는 좁은 타입부터 넓은 타입순으로 해야 문제가 없습니다.

<br>

#### 인터페이스 오버로딩

인터페이스로도 오버로딩을 표현할 수 있습니다.

```ts
interface Add {
  (x: number, y: number): number;
  (x: string, y: string): string;
}
const add: Add = (x: any, y: any) => x + y;
add(1, 2);
add("1", "2");
add(1, "2"); // error
add("1", 2); // error
```

<br>

#### 타입 별칭 오버로딩

각각의 함수 타입을 선언한 뒤 & 연산자로 하나로 묶으면 오버로딩과 같은 역할을 합니다.

```ts
type Add1 = (x: number, y: number) => number;
type Add2 = (x: string, y: string) => string;
type Add = Add1 & Add2;
const add: Add = (x: any, y: any) => x + y;
add(1, 2);
add("1", "2");
add(1, "2"); // error
add("1", 2); // error
```

<br>
