# 스터디 3주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 3주차 스터디 목차

---

- [2.9 인터페이스로 객체를 타이핑하자](#29-인터페이스로-객체를-타이핑하자)
  - [2.9.1 인터페이스 선언 병합](#291-인터페이스-선언-병합)
  - [2.9.2 네임스페이스](#292-네임스페이스)
- [2.10 객체의 속성과 메서드에 적용되는 특징을 알자](#210-객체의-속성과-메서드에-적용되는-특징을-알자)
  - [2.10.1 인덱스 접근 타입](#2101-인덱스-접근-타입)
  - [2.10.2 매핑된 객체 타입](#2102-매핑된-객체-타입)
- [2.11 타입을 집합으로 생각하자(유니언, 인터섹션](#211-타입을-집합으로-생각하자유니언-인터섹션)
- [2.12 타입도 상속이 가능하다](#212-타입도-상속이-가능하다)
- [2.13 객체 간에 대입할 수 있는지 확인하는 법을 배우자](#213-객체-간에-대입할-수-있는지-확인하는-법을-배우자)
  - [2.13.1 구조적 타이핑](#2131-구조적-타이핑)

<br>

## 2.9 인터페이스로 객체를 타이핑하자

---

[week2 2.8 타입 별칭으로 타입에 이름을 붙이자](../week2/sungwoo.md#28-타입-별칭으로-타입에-이름을-붙이자)

객체 타입에 이름을 붙이기 위해 위에서 알아본 타입 별칭말고도, <br>
인터페이스(interface) 선언을 사용하는 방법이 있습니다.

```ts
interface Person {
  name: string;
  age: number;
  married: boolean;
}

const person1: Person = {
  name: "sun",
  age: 22,
  married: false,
};

const person2: Person = {
  name: "monn",
  age: 21,
  married: true,
};
```

타입별칭과 마찬가지로 대문자로 시작하는 단어로 만드는 것이 관습입니다.<br>
<br>
특이한 점이 있다면 인터페이스의 속성을 구분하기 위해 `콤마(,)` ,`세미콜론(;)` ,`줄바꿈`을 모두 사용할 수 있습니다.<br>
다만, 한 줄로 입력할 때는 콤마나 세미콜론으로 속성을 구분해야 합니다.

```ts
interface PersonLB {
  name: string;
  age: number;
  married: boolean;
}

interface PersonSC {
  name: string;
  age: number;
  married: boolean;
}

interface PersonOL {
  name: string;
  age: number;
  married: boolean;
}
```

다만, 실제로는 한 가지 방식으로만 일관성있게 사용하는 것을 권장합니다.

- 함수 인터페이스 타이핑

```ts
// 인터페이스 없이 함수 작성한 경우
function add(x: number, y: number): number {
  return x + y;
}

// 함수 interface
interface Func {
  (x: number, y: number): number;
}

const arr2: Func = (x, y) => {
  return x + y;
};
```

<br>

### 2.9.1 인터페이스 선언 병합

타입 별칭과 다르게 인터페이스는 같은 이름으로 여러 개의 인터페이스를 선언할 수 있는데, <br> 이러면 모든 같은 이름을 가진 인터페이스가 하나로 합쳐집니다. 이를 `선언 병합` 이라고 부릅니다.

```ts
interface Merge {
  one: string;
}
interface Merge {
  two: number;
}

const example1: Merge = {
  one: "1",
};
// 에러발생: Property 'two' is missing in type '{ one: string; }' but required in type

const example2: Merge = {
  one: "1",
  two: 2,
};
```

이런 기능이 있는 이유는 나중에 다른 사람이 인터페이스를 확장할 수 있도록 하기 위함입니다.

자바스크립트는 다른 언어에 비해 객체를 수정하는 것이 자유롭습니다. <br>
따라서 다른 라이브러리의 객체를 수정하는 경우가 많은데 이렇게 객체를 수정하게 되면 타입스크립트에서 정의한 객체 타입과 달라져 에러가 발생하는 경우가 생겼습니다. 그래서 이렇게 인터페이스를 확장하는 기능이 필요하게 되었습니다.

다만, 인터페이스 간에 속성이 겹치는데 타입이 다를 경우에는 에러가 발생합니다. 속성이 같은 경우에는 타입도 같아야 합니다.

```ts
interface Merge {
  one: string;
}
interface Merge {
  one: number;
}
// Subsequent property declarations must have the same type.  Property 'one' must be of type 'string', but here has type 'number'.
```

### 2.9.2 네임스페이스

인터페이스 병합에는 큰 단점이 있습니다. <br>
남이 만든 인터페이스와 의도치 않게 병합될 수 있다는 점입니다.<br>

예를 들어, 다른 사람이 만든 인터페이스와 내 인터페이스의 이름이 우연히 겹칠 수 있습니다.<br>

이럴 때를 대비해, `네임스페이스`기능을 사용할 수 있습니다.

```ts
namespace Example {
	export interface Inner {
		test: string;
	}
	export type: test2 = number;
}

const ex1: Example.Inner = {
	test: 'hello'
}
const ex2: Example.test2 = 1
```

이때 주의할 점은, 네임스페이스 인에 선언된 타입을 사용하려면 export 키워드를 작성해야 한다는 점입니다. export 하지 않으면 에러가 발생합니다.

하지만 네임스페이스도 이름이 겹치는 경우 병합됩니다.<br>
내부에 같은 이름의 인터페이스가 있다면 합쳐지고, 내부에 같은 이름의 타입 별칭이 있다면 에러가 발생합니다.

이를 방지할 수 있는 방법은 5.3절에서 알아보겠습니다.

<br>

## 2.10 객체의 속성과 메서드에 적용되는 특징을 알자

---

객체의 속성에도 옵셔녈이나 readonly 수식어가 가능합니다.

```ts
interface Example {
  hello: string;
  world?: number;
  readonly wow: boolean;
  readonly multiple?: symbol;
}

const example: Example = {
  hello: "hi",
  wow: false,
};
example.wow = true;
// Cannot assign to 'wow' because it is a read-only property.
```

`readonly` 수식어가 붙은 속성은 값을 변경할 수 없고, 값을 읽는 것만 가능합니다.<br>
`옵셔널`이 붙은 속성은 있어도 되고, 없어도 됩니다. 그리고 undefined도 혀용됩니다.

```ts
const example: Example = {
  hello: "hi",
  world: undefined,
  wow: false,
};
```

<br>
객체의 속성과 관련한 특이한 점이 있습니다.

변수에 객체 리터럴을 대입했냐, 변수를 대입했냐에 따라 타입 검사 방식이 달라집니다.

```ts
interface Example {
	hello: string;
}

// - 객체 리터럴 대입 -
const example: Example = {
	hello: 'hi';
	why: '나는 에러야';
}
// 에러발생 : Object literal may only specify known properties, and 'why' does not exist in type 'Example'


// - 변수를 대입 -
const obj = {
	hello: 'hi',
	why: '나는 에러가 아니야',
}
const example2: Example = obj;
```

함수에서도 같은 현상이 발생합니다.<br>
인수 자리에 변수로 값을 대입하면 에러가 발생하지 않고, 객체 리터럴을 대입하면 에러가 발생합니다.

```ts
interface Money {
  amount: number;
  unit: string;
}

const money = { amount: 1000, unit: "won", error: "에러 아님" };

function addMoney(money1: Money, money2: Money): Money {
  return {
    amount: money1.amount + money2.amount,
    unit: "won",
  };
}

addMoney(money, { amount: 3000, unit: "won", error: "에러" });
// Object literal may only specify known properties, and 'error' does not exist in type 'Money'.
```

<br>
이러한 현상이 발생하는 이유는 객체 리터럴을 대입할 떄와 변수를 대입할 때, 타입스크립트가 타입 검사 방식을 다르게 처리하기 때문입니다.

- 객체 리터럴 대입<br>
  객체 리터럴을 대입하면 `잉여 속성 검사`가 실행됩니다.<br>
  잉여 속성 검사는 타입 선언에서 선언하지 않은 속성을 사용할 때 에러를 표시하는 것을 의미합니다.

- 변수 대입<br>
  변수를 대입할 때는 `객체 간 대입 가능성`을 비교하게 됩니다.

이 내용과 관련해서는, 2.13 절에서 자세히 알아보겠습니다.

<br />

### 전개 분법, 나머지 속성

?? 뭔 소리지, 넘김

<br>

### 2.10.1 인덱스 접근 타입

특정한 속성에 타입을 연동시키고 싶다면 어떻게 해야 할까요?<br>
타입스크립트는 객체 속성의 타입에 접근할 수 있는 방식인 `인덱스 접근 타입`을 제공합니다.<br>
아래 처럼 작성하면 됩니다.

```ts
type Animal = {
  name: string;
};

type N1 = Animal["name"];
// type N1 = string
type N2 = Animal["name"];
// type N2 = string

type N3 = Animal.name;
// Cannot access 'Animal.name' because 'Animal' is a type, but not a namespace. Did you mean to retrieve the type of the property 'name' in 'Animal' with 'Animal["name"]'?
```

자바스크립트에서 객체의 속성에 접근하듯 접근합니다.<br>
작은따옴표, 큰따옴표 다 상관없습니다.<br>
하지만, '객체.속성' 방식은 사용할 수 없습니다.

속성의 키와 값의 타입을 구할 수도 있습니다.

```ts
const obj = {
  hello: "world",
  name: "zero",
  age: 28,
};
```

위 객체의 키의 타입은, hello | name | age 이고,
값의 타입은 string | number 입니다.

키의 타입만 따로 구하고, 값의 타입만 따로 구할 수 있습니다.

```ts
const obj = {
	hello: 'world'.
	name: 'zero',
	age: 28,
}

type ObjectType = typeof obj;
// type ObjectType = {
//   hello: string;
//   name: string;
//   age: number;
// }


// 키의 타입, keyof
type Keys = keyof typeof obj; // type Keys = "hello" | "name" | "age"

// 값의 타입, '객체_타입[키의 타입]'
type Values = typeof obj[Keys]; // type Values = string | number
```

인덱스 접근 타입을 활용해서 특정 키들의 값 타입만 추릴 수 있습니다.

```ts
const obj = {
  hello: "world",
  name: "zero",
  age: 28,
};

type Values = (typeof obj)["hello" | "name"];
// type Values = string
```

- keyof any

```ts
type Keys = keyof any;
// type Keys = string | number | symbol
```

- keyof 배열

```ts
type ArrayKeys = keyof [1, 2, 3];
let a: ArrayKeys = "lastIndexOf";
a = "length";
a = "2";
a = 3;
a = "3";
// Type '"3"' is not assignable to type 'keyof [1, 2, 3]'.
```

배열에 keyof를 적용하면, 타입은 <br>
`number | 배열_속성_이름_유니언 | 배열_인덱스_문자열_유니언`이 됩니다.<br>

- 배열*속성*이름 : 배열에 공통적으로 존재하는 length, forEach, lastIndexOf 등을 의미합니다.
- 배열*인덱스*문자열 : 배열의 인덱스, 위 예제에서는 0,1,2를 문자열로 하는, '0' | '1' | '2'를 의미힙니다.

<br>

튜플과 배열에도 인덱스 접근 타입을 사용할 수 있습니다.

```ts
type Arr = [1, 3, 5];
type First = Arr[0];
// type First = 1
type Length = Arr["length"];
// type Length = 3

type Arr2 = (string | boolean)[];
type El = Arr2[number];
```

### 2.10.2 매핑된 객체 타입

인덱스 시그니처를 사용하면 객체의 속성 값을 전부 특정 타입으로 만들 수 있습니다.

```ts
// 객체의 키는 문자열, 속성 값은 어떤 타입이든 가능
interface AnySignature {
	[key : string]: any;
}
const AnyObj: AnySignature = {
	name: 'Jang',
	age: 33
}


// 객체의 키는 문자열, 속성 값은 문자열 타입만 가능
interface StringSignature {
	[key: string] : string;
}

const stringKeyObj: StringSignature  = {
	name: 'Jang',
	gender: 'male'
}


// 객체의 키는 숫자, 속성 값은 문자열 타입만 가능
interface NumberSignature {
	[index: number]: string;
}
cosnt numberKey: NumberSignature = {
	1 : 'one',
	2 : 'two',
}
```

위 코드처럼, 속성 전부에 타입을 지정하는 대신, 일부 속성에만 타입을 부여할 수도 있습니다.

인덱스 시그니처를 사용해서 hello와 hi라는 속성 이름을 가진 객체를 타이핑 해봅시다.

```ts
type HelloAndHi = {
  [key: "hello" | "hi"]: string;
};
// An index signature parameter type cannot be a literal type or generic type. Consider using a mapped object type instead.
```

에러 메세지에 `매핑된 객체 타입`을 대신 쓰라고 알려줍니다.<br>
인터페이스에서는 쓰지 못하고 타입 별칭에서만 쓸 수 있습니다.<br>
코드를 살펴봅시다.

```ts
type Greetings = "hello" | "hi";

type HelloAndHi = {
  [k in Greetinhs]: string;
};

// 이제 HelloAndHi 타입은, hello와 hi라는 두 문자열 속성을 가진 객체 타입입니다.
const greetings: HelloAndHi = {
  hello: "world",
  hi: "there",
};
```

`in 연산자`를 사용해서 타입을 표현합니다. in 연산자 오른쪽에는 유니언 타입이 와야 합니다.<br>
유니언 타입에 속한 타입이 하나씩 순서대로 평가되어 객체의 속성이 됩니다.<br>
{ hello : string }, { hi : string } 이 합쳐져, <br>
최종적으로 { hello: string, hi: string } 객체가 됩니다.

<br>

매핑된 객체 타입은 좀 더 복잡한 상황에 주로 쓰입니다.<br>
기존 객체 타입을 복사하는 코드입니다.

```ts
interface Original {
  name: string;
  age: number;
  married: boolean;
}

type Copy = {
  [key in keyof Original]: Original[key];
};
```

key의 타입은, keyof 연산자로 속성 이름만 순서대로 가져옵니다.(name | age | married)<br>
속성 값의 타입은, in연산자 오른쪽에, 유니언 타입에 속한 타입들이 하나씩 평가됩니다.

따라서 Copy의 최종타입은 아래와 같습니다.

```
type Copy = {
    name: string;
    age: number;
    married: boolean;
}
```

<br>

- 수식어 추가, 제거

다른 타입으로부터 값을 가져오면서 수식어를 붙일 수도 있습니다.<br>
읽기 전용으로 만들려면 `readonly`, 옵셔널로 만들려면 `?` 수식어를 붙이면 됩니다.

```ts
interface Original {
	name: string;
	age: number;
	married: boolean;
}
type Copy = {
	read [key in keyof Original]?: Original[key];
}
```

```
type Copy = {
    readonly name?: string | undefined;
    readonly age?: number | undefined;
    readonly married?: boolean | undefined;
}
```

수식어 앞에 -를 붙이면 해당 수식어가 제거된 채로 속성을 가져옵니다.

```ts
interface Original {
  readonly name?: string;
  age: number;
  readonly married?: boolean;
}
type Copy = {
  -readonly [key in keyof Original]-?: Original[key];
};
```

```
type Copy = {
    name: string;
    age: number;
    married: boolean;
}
```

- 속싱이름 바꾸기, Capitalize<br>

`Capitalize`는 타입스크립트에서 제공하는 타입으로, 문자열의 첫 번쨰 자리를 대문자화합니다.<br>
as 예약어를 통해 속성 이름을 어떻게 바꿀지 정할 수 있습니다.

```ts
interface Original {
  name: string;
  age: number;
  married: boolean;
}
type Copy = {
  [key in keyof Original as Capitalize<key>]: Original[key];
};
```

```
type Copy = {
    Name: string;
    Age: number;
    Married: boolean;
}
```

<br>

## 2.11 타입을 집합으로 생각하자(유니언, 인터섹션)

`유니언 연산자는 합집합` 역할을 합니다.<br>
`&(인터섹션) 연산자는 교집합` 역할을 합니다

```ts
// string | number 타입은, string과 number의 합집합
let strOrNum = string | number = 'hello';
strOrNum = 123;
```

string과 number를 모두 포함한 부분이 합집합 영역입니다.<br>
string과 number가 서로 겹치는 부분이 교집합 영역입니다.

그런데, string과 number의 교집합 이라면 string이면서 number라는 뜻입니다.<br>
그런 값이 있을까요? 앖습니다. <br>
이렇게 원소가 존재하지 않는 집합을 공집합이라고 합니다.<br>
타입스크립트에서는 `never가 공집합 역할`을 합니다.

```ts
type nev = string & number;
// type nev = never
```

<br>

타입스크립트의 타입을 집합 관계로 정리하면 아래와 같습니다.

- 전체 집합: unknown
- 합집합 : |
- 교집합 : &
- 공집합 : never

<br>

### 항상 좁은 타입에서 넓은 타입으로 대입해야 합니다.

단, any 타입은 집합 관계를 무시합니다. <br>
일관성이 없어서 값을 예측하기 어렵게 만듭니다.

```ts
type A = string | boolean;
type B = boolean | number;
type C = A & B;
// type C = boolean

type D = {} & (string | null);
// type D = string

type E = string & boolean;
// type E = never

type F = unknown | {};
// type F = unknown
// 전체집합과의 합집합은 항상 전체집합입니다.
// 따라서, unknown과의 | 연산은 무조건 unknown 입니다.

type G = never & {};
// type G = never
// 공집합과의 교집합은 항상 공집합니다.
// 따라서, never와의 & 연산은 무조건 never 입니다.
```

<br>

### 브랜딩 (2.28절 에서 활용하는 법을 배웁니다.)

null/undefined를 제외한 원시 자료형과, 비어 있지 않는 객체를 & 연산할 때는 never가 되지 않습니다. 예외 사항이라고 보면 됩니다.

```ts
type H = { a: "b" } & number;
// type H = {a:'b'} & number
```

<br>

## 2.12 타입도 상속이 가능하다

---

자바스크립트에서 객체 간에 상속이 가능한 것처럼, 타입스크립트는 객체 타입 간에 상속하는 압버이 있습니다.

```js
//JavaScript
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} 멍멍`);
  }
}

class Cat extends Animal {
  meow() {
    console.log(`${this.name} 야옹`);
  }
}
```

- `extends 예약어`를 사용해서 기존 타입을 상속할 수 있습니다.<br>
  상속하면 Dog와 Cat 인터페이스에 name 속성이 존재하게 됩니다.

```ts
// TypeScript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

interface Cat extends Animal {
  meow(): void;
}
```

- 타입 별칭에서는, `&` 연산자를 사용해 상속을 나타낼 수 있습니다.

```ts
type Animal = {
  name: string;
};

type Dog = Animal & {
  bark(): void;
};

type Cat = Animal & {
  meow(): void;
};

type Nmae = Cat["name"];
// type Name = string
// Cat 타입에 name속성을 선언하지 않아도 Name 타입이 string인 것을 확인할 수 있다.
```

<br>

- 타입스크립트에서는 대부분 타입 별칭으로 선언한 객체 타입과 인터페이스로 선언한 객체 타입이 호환됩니다. 그래서 타입 별칭이 인터페이스를 상속할 수도 있고, 인터페이스가 타입 별칭을 상속할 수도 있습니다.

```ts
// 인터페이스 상속
interface Animal {
  name: string;
}
type Dog = Animal & {
  bark(): void;
};
type Cat = Animal & {
  meow(): void;
};

type Name = Cat["name"];

// 타입 별칭 상속
type Animal = {
  name: string;
};

interface Dog extends Animal {
  bark(): void;
}

interface Cat extends Animal {
  meow(): void;
}

type Nmae = Dog["name"];
```

- 한 번에 여러 타입을 상속할 수도 있습니다.

```ts
interface CatDog extends Dog, Cat {}

type meow = CatDog["meow"];
type bark = CatDog["bark"];
type Name = CatDog["name"];
```

- 상속 할 때 부모 속성의 타입을 변경할 수도 있습니다.<br>
  다만 부모에 대입할 수 있는 타입으로 바꾸어야 합니다.

```ts
interface Merge {
  one: string;
  two: string;
}
interface Merge2 extends Merge {
  one: "h" | "w";
  two: 123;
}
// 'h' | 'W', string에 대입 가능
// 123, string에 대입 불가능
```

대입할 수 있는지 없는지를 판단하는 방법은 다음 절에서 살펴보겠습니다.

<br>

## 2.13 객체 간에 대입할 수 있는지 확인하는 법을 배우자

---

```ts
interface A {
  name: string;
}
interface B {
  name: string;
  age: number;
}

const aObj = {
  name: "zero",
};
const bObj = {
  name: "nero",
  age: 32,
};
const aToA: A = aObj;
const bToB: B = bObj;

const aToB: B = aObj;
// Property 'age' is missing in type '{ name: string; }' but required in type 'B'
const bToA: A = bObj;
```

유일 하게 B 타입에 A 타입 객체를 대입하는 것만 실패했습니다.<br>
A 타입에 B 타입 객체를 대입하는 것은 가능하지만, B 타입에 A 타입 객체를 대입하는 것은 불가능합니다.

좁은 타입(여기서는 B)은 넓은 타입(여기서는 A)에 대입할 수 있지만, <br>
넓은 타입(A)은 좁은 타입(B)에 대입할 수 없습니다.

- `좁은 타입`, `넓은 타입` <br>
  좁은 타입과 넓은 타입을 구분할 때는, 어떤 타입이 더 구체적인지 확인하면 됩니다.<br>
  B타입에는 name과 age 속성이 꼭 있어야 하지만, <br>
  A타입에는 name 속성 밖에 없습니다. <br>

  구체적이라는 것은 조건을 만족하기 더 힘들고, 덜 추상적이라는 것입니다. <br>
  따라서, B 타입은 A 타입보다 좁은 타입입니다.

- 합집합은 각각의 집합이나 교집합보다 넓습니다.
- 튜플은 배열보다 좁은 타입입니다.
- readonly 수식어가 붙은 튜플은 일반 배열보다 넓은 타입이됩니다.

```ts
//튜플
let a: ["hi", "read"] = ["hi", "read"];
// 배열
let a: string[] = ["hi", "read"];

a = b;
// Type 'string[]' is not assignable to type '["hi", "readonly"]'.
// Target requires 2 element(s) but source may have fewer.
b = a;
```

- 배열과 배열 비교시, readonly 수식어가 붙은 배열이 더 넓은 타입입니다.
- 객체에서는 속성에 readonly가 붙어도 서로 대입할 수 있습니다.

```ts
let a: readonly string[] = ["hi", "readonly"];
let b: string[] = ["hi", "normal"];

a = b;
b = a;
// The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

- 두 객체가 있고 속성이 동일할 때, 속성이 옵셔널인 객체가 옵셔널이지 않은 객체보다 넓은 타입입니다.

<br>

타입의 범위

- 좁은 타입: 가능한 값이 적고, 매우 구체적
- 넓은 타입: 가능한 값이 많고, 더 일반적

타입의 대입

- 좁은 타입은 넓은 타입에 할당 가능
- 넓은 타입은 좁은 타입에 할당 불가능

unknown, never

- unknown: 어떤 타입의 값도 받을 수 있는 가능 넓은 타입
- never: 어떤 값도 가질 수 없는 가장 좁은 타입

합집합 타입(union)

- 두 타입 중 하나를 가질 수 있는 타입(예: string | number)
- 합집합 타입은 각 개별 타입보다 넓은 타입

튜플, 배열

- 튜플: 고정된 길이와 타입을 가진 배열로, 좁은 타입
- 배열: 길이나 타입이 고정되지 않은 일반 배열, 넓은 타입

<br>

### 2.13.1 구조적 타이핑

타입스크립트에서는 객체를 어떻게 만들었든 간에 구조가 같으면 같은 객체로 인식합니다.<br>
이를 `구조적 타이핑`이라고 부릅니다

```ts
interface Money {
  amount: number;
  unit: string;
}
interface Liter {
  amount: number;
  unit: string;
}

const liter: Liter = { amount: 1, unit: "liter" };
const circle: Money = liter;
```

Money와 Liter 인터페이스는 이름을 제외하고는 다른 점이 없습니다.<br>
이때 둘을 동일한 타입으로 인식합니다.

<br>

아래 코드 같은 경우도 있습니다.

```ts
interface A {
  name: string;
}
interface B {
  name: string;
  age: number;
}

const aObj = {
  name: "zero",
};
const bObj = {
  name: "nero",
  age: 32,
};

const aToA: A = aObj;
const bToB: B = bObj;
const aToB: B = aObj; // error
const bToA: A = bObj;
```

B 인터페이스는 A 인터페이스에 존재하는 name 속성을 가지고 있기 때문에,<br>
구조적 타이핑 관정에서 B 인터페이스는 A 인터페이스라고 볼 수 있습니다.
<br>

반대로, A 인터페이스에는 B 인터페이스에 존재하는 age 속성을 가지고 있지 않기 떄문에,<br> A 인터페이는 B 인터페이스가 아닙니다.

<br>

아래 코드도 서로 구조적으로 동일한 구조를 갖습니다.

```ts
type Arr = number[];
type CopyArr = {
  [Key in keyof Arr]: Arr[Key];
};

const copyArr: CopyArr = [1, 3, 9];
```

<br>

### 구조적으로 다르게 만드는 방법

구조적으로 동일하게 되면 서로 대입할 수 있게 됩니다. <br>
서로 대입하지 못하게 하려면, 서로를 구분하기 위한 속성을 추가해야 합니다. <br>
다시 말해, 구조적으로 동일하지 않게 만드는 것입니다.

```ts
interface Money {
  __type: "money";
  amount: number;
  unit: string;
}
interface Liter {
  __type: "liter";
  amount: number;
  unit: string;
}

const liter: Liter = { amount: 1, unit: "liter", __type: "liter" };
const circle: Money = liter;
// Type 'Liter' is not assignable to type 'Money'.
// Types of property '__type' are incompatible.
// Type '"liter"' is not assignable to type '"money"'.
```

`__type` 같은 속성을 브랜드(brand) 속성이라고 부르고, 이런 속성을 사용하는 것을 브랜딩한다고 표현합니다.<br>
속성의 이름은 꼭 `__type`이 아니어도 됩니다.
