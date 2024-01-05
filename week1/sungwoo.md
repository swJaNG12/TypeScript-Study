# 스터디 1주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<!-- TOC -->

- 1주차 스터디 목차

  - [2.1 변수, 매개변수, 반환값에 타입을 붙이면 된다](#21변수-매개변수-반환값에-타입을-붙이면-된다)

  - [2.2 타입 추론을 적극 활용하자](#22-타입-추론을-적극-활용하자)
  - [2.2.1 타입 추론](#221-타입-추론)
  - [2.2.2 리터럴 타입, 타입 넓히기](#222-리터럴-타입-타입-넓히기)
  - [2.2.3 타입스크립트 에러 무시](#223-타입스크립트-에러-무시)
  - [2.3 값 자체가 타입인 리터럴 타입이 있다](#23-값-자체가-타입인-리터럴-타입이-있다)
  - [2.3.1 객체 리터럴 타입 as const](#231-객체-리터럴-타입-as-const)
  - [2.3.2 배열 리터럴 타입](#232-배열-리터럴-타입)
  - [2.3.3 함수 리터럴 타입](#233-함수-리터럴-타입)
  - [2.4 배열 말고 튜플도 있다](#24-배열-말고-튜플도-있다)
  - [2.4.1 배열에 자료형 타입 부여하기](#241-배열에-자료형-타입-부여하기)
  - [2.4.2 배열의 타입 추론](#242-배열의-타입-추론)
  - [2.4.3 튜플](#243-튜플)
  - [2.4.4 튜플의 길이](#244-튜플의-길이)
  - [2.5 타입으로 쓸 수 있는 것을 구분하자](#25-타입으로-쓸-수-있는-것을-구분하자)
  - [2.5.1 타입으로 쓸 수 있는 것, 없는 것 구분](#251-타입으로-쓸-수-있는-것-없는-것-구분)
  - [2.5.2 함수를 타입으로](#252-함수를-타입으로)
  - [2.5.3 클래스를 타입으로](#253-클래스를-타입으로)
  - [2.6 유니언 타입으로 OR 관계를 표현하자](#26-유니온-타입으로-or-관계를-표현하자)
  - [2.6.1 유니온 타입](#261-유니온-타입)
  - [2.6.2 함수에서의 유니온 타입](#262-함수에서의-유니온-타입)
  - [2.6.3 유니온 타입을 이용한 타입 좁히기 기법](#263-유니온-타입을-이용한-타입-좁히기-기법)
  - [2.6.4 타입 별칭](#264-타입-별칭)

<br />
<!-- TOC -->

---

## 2.1변수 매개변수, 반환값에 타입을 붙이면 된다.

어떤 값에 타입을 부여할지 알아야 한다. <br />
기본적으로 변수, 함수의 매개변수, 반환값에 타입을 부여한다. <br />

- 타입을 부여하는 행위 : 타이핑(typing) <br />

### 기본 타입 종류, 표기법

- string(문자열)
  ```ts
  const str: string = "hello";
  ```
- number(숫자)
  ```ts
  const num: number = 123;
  ```
- boolean(불리언)
  ```ts
  const bool: boolean = false;
  ```
- null
  ```ts
  const n: null = null;
  ```
- undefined
  ```ts
  const u: undefined = undefined;
  ```
- object(객체, 함수와 배열도 포함)
  ```ts
  const obj: object = { hello: "world" };
  ```
- symbol(심볼)
  ```ts
  const sym: symbol = Symbol("sym");
  ```
  Target이 ES2015 이상이어야만 동작한다
- bigint
  ```ts
  const big: bigint = 100000000n;
  ```
  bigint 타입은 ES2020 이상의 자바스크립트에서만 동작한다.

<br />

### 함수에서의 타입 표기법

```ts
// Function
function plus(x: number, y: number): number {
  return x + y;
}

// Arrow Function
const minus = (x: number, y: number): number => x - y;
```

---

## 2.2 타입 추론을 적극 활용하자.

### 2.2.1 타입 추론

> <span style="font-size: 16px;">**타입 추론이란?**</span> <br />
> 타입스크립트는 함수의 매개변수에 타입을 부여하면 반환값의 타입을 추론합니다. 또한 함수의 반환값을 받는 변수의 타입도 추론할 수 있습니다.<br />
> 하지만, 매개변수에는 타입을 부여해야 합니다. 왜냐하면 어떤 값이 들어올지 알 수 없기 떄문에, 타입을 부여하지 않으면 타입스크립트는 암묵적으로 any 타입으로 추론합니다. 이때 암묵적 any 때문에 `implicitAny` 에러가 발생합니다.

<br />

```ts
// 1. 변수 타입 추론
function plus(x: number, y: number): number {
  return x + y;
}

const result1 = plus(1, 2); // const reuslt1: number

// 2. 반환값 타입 추론
function minus(x: number, y: number) {
  return x + y;
}
const result2 = minus(2, 3); // const result2: number

// 3. any 타입 추론
function plusAny(x, y) {
  return x * y;
}
// function plusAny(x: any, y: any): any
// Parameter 'x' implicitly has an 'any' type.
// Parameter 'y' implicitly has an 'any' type.
```

### 2.2.2 리터럴 타입, 타입 넓히기

> <span style="font-size: 16px;">**리터럴 타입, 타입 넓히기란?**</span> <br />
> 타입스크립트는 const로 변수를 선언했을 떄와 let으로 변수를 선언했을 때 서로 다르게 추론합니다. const를 사용하면 리터럴 타입으로 추론하고, let을 사용하면 넓게 추론합니다.

<br />

```ts
// const 타입 추론
const str = "hello"; //const str: 'hello'
const num = 123; // const num: 123
const bool = false; // const bool: false
const n = null; // const n: null
const u = undefined; // const u: undefined
const sym = Symbol("sym"); // const sym: typeof sym
const big = 10000000n; // const big: 10000000n
const obj = { hello: "world" }; // const obj: { hello: string}
```

직접 타입을 부여했을 떄와는 다르게 추론되는 걸 볼 수 있습니다.<br /> 여기서 볼 수 있듯이 실제로 타입스크립트에서는 타입을 정확한 값으로도 부여할 수 있습니다.<br /> 이를 `리터럴 타입`이라고 합니다. 이게 더 정확한 추론입니다. const로 선언했기 때문에 다른 값이 될 수 없기 때문입니다.

<br />

```ts
let str = "hello"; // let str: string
let num = 123; // let num: number
let bool = false; // let bool: boolean
let n = null; // let n: any
let u = undefined; // let u: any
let sym = Symbol("sym"); // let sym: symbol
let big = 10000000n; // let big: bigint
let obj = { hello: "world" }; // let obj: { hello: string }
```

let으로 선언한 변수는 다른 값을 대입할 수 있기 때문에, 타입을 넓혀 추론하는 `타입 넓히기` 현상이 생깁니다.<br /> const가 있기 때문에 많이 사용하지는 않지만 let을 사용해도 `리터릴 타입`을 사용할 수 있습니다. 그리고 null과 undefined는 any로 추론합니다.

<br />

### 2.2.3 타입스크립트 에러 무시

자바스크립트에서는 문제 없던 코드가 타입스크립트에서는 에러로 표시될 수 있다. 수정할 방법을 모르겠다면 `//@ts-ignore` 주석을 작성해서 에러를 무시하면 된다.

```ts
// @ts-ignore
// 에러 코드..
```

하지만 이 방법은 임시방편이므로 올바른 방법으로 코드를 작성하자.

또 다른 방법으로는 `@ts-expect-error` 주석을 사용하는 방법도 있다. 이 주석은 다음 줄의 코드가 반드시 에러가 나는 코드라는 것을 알리고, 그 에러를 무시한다는 뜻이다.

```ts
// @ts-expect-error
// 에러 코드..
```

<br />

---

## 2.3 값 자체가 타입인 리터럴 타입이 있다.

값 자체가 타입이 되는 것을 리터럴 타입이라고 한다. const를 사용할 떄 타입을 부여하지 않으면 값 자체가 타입이 되고, let을 사용할 때는 타입 넓히기 현상으로 값의 타입을 타입스크립트가 추론해서 정해진다.

const가 있기 때문에 let의 경우 원시 자료형에 대한 리터럴 타입을 표기하는 경우는 거의 없다. 주로 리터럴 타입이 아닌 자료형 타입은 let과 함께 자주 사용됩니다.

```ts
// let 리터럴 타입
let str: "hello" = "hello";
str = "world";
// Type 'world' is not assignable to type 'hello'

// let 자료형 타입
let str: string = "hello";
str = "world";
str = 123;
// Type 'number' is not  aasignable to type 'string'

// const 리터럴타입, let보다 간단하다.
const str: "hello"; // const str: 'hello'
```

---

<br />

### 2.3.1 객체 리터럴 타입, as const

객체를 표시하는 리터럴 타입도 있습니다. 리터럴 타입이 아니면 타입스크립트는, 자바스크립트의 객체가 const 변수라도 수정될 수 있기 때문에, 수정 가능성을 염두에 두고 타입을 넓게 추론합니다.

```ts
const obj1: { name: "zero" } = { name: "zero" };
// const obj1: {name: 'zero'}

const ocj2 = { name: "zero" };
// const ocj2: {name: string}
```

객체의 값이 변하지 않는 것이 확실하다면 as const라는 특별한 접미사를 붙여도 됩니다. 객체에 리터럴 타입을 부여한 것과 as const 접미사, 두 방법모두 객체를 변경할 수 없게 제한합니다. 차이점은 리터럴 타입은 객체의 구조와 그 프로퍼티의 값까지 모두 명시적으로 지정함으로써 객체가 가질 수 있는 형태와 값을 엄격하게 제한하는 걸 중점으로 두고 반면, as const 접미사는 객체 자체의 불변성을 보장하는데 중점을 둡니다.

```ts
const obj = { name: "zero" } as const;
// const obj: { readonly name: 'zero' }
```

<br />

### 2.3.2 배열 리터럴 타입

```ts
// 배열 리터럴 타입
const arr: [1, 3, "five"] = [1, 3, "five"];
// const arr: [1,3,'five']

// 배열 리터럴 타입 추론
const arr = [1, 3, "five", null, undefined];
// const arr: (string | number | null | undefined)[]
```

2.4에서 좀 더 자세히 다룹니다.

<br />

### 2.3.3 함수 리터럴 타입

```ts
const func: (amount: number, unit: string) => string = (amount, unit) => {
  return amount + unit;
};
```

함수 리터럴 타입에서는 반환값의 표기법이 다릅니다. 콜론 대신 `=>` 를 사용합니다.

---

<br />

## 2.4 배열 말고 튜플도 있다.

### 2.4.1 배열에 자료형 타입 부여하기 <br />

배열에 타입을 부여한다는 것은 요소의 타입을 의미합니다. 2가지 방볍으로 요소의 자료형 타입을 부여할 수 있습니다.

```ts
// 1. 타입[]
const arr1: string[] = ["1", "2", "3"]; // const arr1: string[]

// 2. Array<타입>(제네릭)
const arr2: Array<number> = [1, 2, 3]; // const arr2: number[]
```

이렇게 하면 다른 자료형의 값은 넣을 수 없습니다.

<br />

### 2.4.2 배열의 타입 추론

```ts
const arr3 = [1, 2, 3]; // const arr3: number[]
const arr4 = [1, "3", 5]; // const arr4: (string | number)[]
const arr5 = []; // const arr5: any[];
```

arr3의 요소는 전부 number 타입이라 arr3은 number[]로 추론된다. <br />
arr4는 '3' 문자열이 들어 있어서 string 또는 number, (string | number)[] 로 추론된다.
빈 배열 arr5는 any[]로 추론된다.

<br />

### 2.4.3 튜플

각 자리 요소에 타입이 고정되어 있는 배열을 `튜플`이라고 부른다.

```ts
const tuple: [number, string, boolean] = [1, "2", false];

tuple[2] = 5; // Type 'number' is not assignable to type 'boolean'
tuple[3] = "no"; // Type 'no' is not assignable to type 'undefined'
```

0번째 인덱스는 숫자만, 1번째 인덱스는 문자열만, 2번째 인덱스는 불 값만 가능합니다. 표기하지 않은 3번째 자리부터는 undefined 타입이 된다.

그리고 고정된 타입과 일치하는 값이라면 push, unshift, 메서드를 통해 요소를 추가할 수 있다.

```ts
const tuple: [number, string, boolean] = [1, "2", false];

tuple.push(1);
tuple.unshift("3");
console.log(tuple); // ["3", 1, "2", false, 1]
```

pop, shift로 삭제도 가능하다.

```ts
const tuple: [number, string, boolean] = [1, "2", false];

tuple.pop();
tuple.shift();
console.log(tuple); // ["2"]
```

<br />

만약 push를 사용하는 것까지 막으려면 `readonly` 수식어를 붙여야 한다.

```ts
const tuple: readonly [number, boolean, string] = [1, false, "hi"];
tuple.push("no");
// Property 'push' does not exist on type 'readonly [number, boolean, string]'
// pop, shift, unshift 또한 사용 못하게 된다.
```

배열에서도 readonly 수식어를 붙일 수 있습니다.

```ts
const arr: readonly number[] = [1, 3, 5];
arr.push(1);
// Property 'push' does not exist on type 'readonly number[]'
```

<br />

### 2.4.4 튜플의 길이

이 책에서는 튜플을 길이가 고정된 배열이라고 설명하지 않고, 각 요소 자리에 타입이 고정되어 있는 배열이라고 설명했습니다. 그 이유는 아래와 같습니다.

```ts
const strNumBools: [string, number, ...boolean[]] = [
  "hi",
  1,
  false,
  true,
  false,
];
const strNumsBool: [string, ...number[], boolean] = ["hi", 123, 12, 1, true];
const strsNumBool: [...string[], number, boolean] = ["hi", "hello", 1, false];
```

`...타입[]` 표기를 통해 특정 타입이 연달아 나올 수 있음을 알릴 수 있기 때문이다. 이처럼 `...`은 전개 문법으로 특정 자리에 특정 타입이 연달아 나옴을 표시할 수 있습니다.

<br />

- 전개 문법으로 타입 추론
  <br />
  값에 전개 문법을 사용해도 타입스크립트는 타입 추론을 해냅니다.

```ts
const arr1 = ["hi", false];
const arr2 = [1, ...arr1];
// const arr2: (number | string | boolean)[]
```

<br />

- 구조분해 할당과 나머지 문법
  <br />
  구조분해 할당에서는 나머지 속성 문법을 사용할 수 있고 타입을 알아서 추론합니다.

```ts
const [a, ...rest1] = ["hi", 1, 2, 3];
// const a: string
// const rest1: [number, number, number]

const [a, ...rest2]: [string, ...number[]] = ["hi", 1, 2, 3];
// const a: string
// const rest2: [number, number, number]
```

<br />

- 옵셔널 수식어 ( ? )
  <br />
  옵셔널 수식어는 타입 뒤에 붙어 있는 ?를 말한다. 해당 자리에 값이 있어도 그만, 없어도 그만이라는 의미이다.

```ts
let tuple: [number, boolean?, string?] = [1, false, "hi"];
tuple = [10];
tuple = [10, true];

tuple = [10, "hello"];
// Type 'string' is not assignable to type 'boolean | undefined'
```

[number, boolean?, string?] 은 [number] 또는 [number, boolean] 또는 [number, boolean, string]을 의미한다.

---

## 2.5 타입으로 쓸 수 있는 것을 구분하자.

타입스크립트에서 값은 일반적으로 자바스크립트에서 사용하는 값을 가리키고, 타입은 타입을 위한 구문에서 사용하는 타입을 가리킨다.

### 2.5.1 타입으로 쓸 수 있는 것, 없는 것 구분

1. 타입을 값으로 사용할 수 없다.
2. 대부분의 리터럴 값은 타입으로 사용할 수 있다.
3. 변수의 이름은 타입으로 사용할 수 없다.
4. Date, Math, Error, String, Object, Number, Boolean 등과 같은 내장 객체는 타입으로 사용할 수 있다.

```ts
const date: Date = new Date();
const math: Math = Math;
const str: String = "hello";
```

이때 String, Object, Number, Boolean, Symbol을 타입으로 사용하는 것은 권장하지 않는다. <br /> 그 대신
string, object, number, boolean, symbol을 사용하자.

<br />

타입으로 쓸 수 있는 값, 쓸 수 없는 값을 외우기 어렵다면 일단 타입으로 표기해보면 된다<br />
실수로 타입으로 쓸 수 없는 값을 타입으로 사용하면 타입스크립트가 알려준다.

<br />

### 2.5.2 함수를 타입으로

```ts
function add(x: number, y: number) {
  return x + y;
}
const add2: add = (x: number, y: number) => x + y;
// 'add' refers to a value, but is being used as a type here. Did you mean 'typeof add'?
```

add는 값이지만 타입으로 사용했다는 뜻이다.<br />
변수에는 `typeof`를 앞에 붙여 타입으로 사용할 수 있다.

```ts
function add(x: number, y: number) {
  return x + y;
}
const add2: typeof add = (x, t) => x + y;
// const add2: (x: number, y: number) => number
```

그리고 함수의 반환값은 타입으로 사용할 수 없다. `typeof`를 써도 에러가 발생한다.

```ts
function add(x: number, y: number) {
	return x + y;
}
const result1: add(1,2) = add(1,2);
// 'add' refers to a value, but is being used as a type here, Did you mena 'typeof add'?
// the left-hand side of assignment expression must be a variable or a property access.
const result2: typeof add(1,2) = add(1,2);
// The left-hand side of an assignment expression must ne a variable or a property access
```

<br />

### 2.5.3 클래스를 타입으로

```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person("zero");
```

<br />

---

## 2.6 유니온 타입으로 OR 관계를 표현하자

타입스크립트에는 유니언 타입과 유니온 타입을 표기하기 위한 새로운 연산자인 <br />파이프 연산자(|) 가 있다. 자바스크립트의 비트 연산자와는 다른 역할을 한다.

<br />

### 2.6.1 유니온 타입

`유니온 타입`은 하나의 변수가 여러 타입을 가질 수 있는 가능성을 표시하는 것이다.

```ts
let strOrNum: string | number = "hello"; // let strOrNum: string | number
strOrNum = 123;
```

strOrNum 변수는 string일 수도 있고 number일 수도 있다.

배열의 타입을 추론할 때도 볼 수 있다. <br />

```ts
const arr = [1, "a", 5];
// const arr: (string | number)[]
```

이때 꼭 소괄호가 필요하다. <br />
소괄호를 쓰지 않아 string | number[]가 되면 `문자열의 배열`또는 `숫자의 배열`이 되기 때문이다.

<br />

### 2.6.2 함수에서의 유니온 타입

함수의 매개변수나 반환값에서도 유니온 타입이 쓰인다.

```ts
function returnNumber(value: string | number): number {
  return parseInt(value);
  // Argument of type 'string | number' is not assignable to parameter of 'stinrg'
  // 'number' is not assignable to type 'string'
}
returnNumber(1);
returnNumber("1");
```

위 코드에서 에러가 발생하는 부분은 `parseInt(value)` 부분이다. <br />
string | number 타입인 인수는 string 타입 매개변수로 넣을 수 없다는 메세지가 나온다. <br />
이는 타입스크립트에서 `parseInt()의 인수로 문자열만 넣을 수 있게 제한`했기 때문이다.

<br />

### 2.6.3 유니온 타입을 이용한 타입 좁히기 기법

유니온 타입을 사용해서 타입을 부여하면 하나의 변수가 여러 타입을 가질 수 있게 된다. <br />
이때 if문을 통해서 변수의 정확한 타입을 찾아내는 기법을 `타입 좁히기`라고 부른다.

```ts
let strOrNum: string | number = "hello";
strOrNum = 123;

if (typeof strOrNum === "number") {
  strOrNum.tofixed();
}
```

<br />

### 2.6.4 타입 별칭

타입 별칭은 `type 키워드`를 사용해서 타입에 이름을 설정하는 방법이다. <br />
이때, `유니온 타입`으로 여러개의 타입을 설정할 수 있다.

```ts
type Union1 = string | boolean | number | null;
type Union2 = string | boolean | number | null;

let val: union1 = "hello";
val = 1;
val = false;
val = null;
```
