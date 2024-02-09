# 스터디 5주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 5주차 스터디 목차

- [2.19 공변성과 반공변성을 알아야 함수끼리 대입할 수 있다](#219-공변성과-반공변성을-알아야-함수끼리-대입할-수-있다)
  - [2.19.1 함수의 반환값은 항상 공변성을 갖고 있습니다](#2191-함수의-반환값은-항상-공변성을-갖고-있습니다)
  - [2.19.2 함수의 매개변수는 반공변성을 갖고 있습니다](#2192-함수의-매개변수는-반공변성을-갖고-있습니다)
- [2.20 클래스는 값이면서 타입이다](#220-클래스는-값이면서-타입이다)
  - [private 수식어와 #의 차이점](#private-수식어와-의-차이점)
  - [클래스 인덱스 시그니처](#클래스-인덱스-시그니처)
  - [추상 클래스](#2201-추상-클래스)
- [2.21 enum은 자바스크립트에서도 사용할 수 있다.](#221-enum은-자바스크립트에서도-사용할-수-있다)
- [2.22 infer로 타입스크립트의 추론을 직접 활용하자](#222-infer로-타입스크립트의-추론을-직접-활용하자)
  - [함수 매개변수 타입 추론](#함수-매개변수-타입-추론)
  - [생성자 매개변수 타입 추론](#생성자-매개변수-타입-추론)
  - [반환값 타입 추론](#반환값-타입-추론)
  - [인스턴스 타입 추론](#인스턴스-타입-추론)
  - [유니언 인터섹션](#유니언-인터섹션)
- [2.23 타입을 좁혀 정확한 타입을 얻어내자](#223-타입을-좁혀-정확한-타입을-얻어내자)
  - [typeof 연산자로 타입 좁히기](#typeof-연산자로-타입-좁히기)
  - [null undefined 구분](#null-undefined-구분)
  - [boolean 타입 구분](#boolean-타입-구분)
  - [배열 타입 구분](#배열-타입-구분)
  - [클래스 구분](#클래스-구분)
  - [서로다른 두 객체 구분](#서로다른-두-객체-구분)
    - [instanceof(error)](#instanceoferror)
    - [1. in 연산자 사용하기](#1-in-연산자-사용하기)
    - [2. 브랜드 속성 사용하기](#2-브랜드-속성-사용하기)
    - [3. is 특수 연산자를 사용한 서술 함수](#3-is-특수-연산자를-사용한-서술-함수)
- [2.24 자기 자신을 타입으로 사용하는 재귀 타입이 있다](#224-자기-자신을-타입으로-사용하는-재귀-타입이-있다)
  - [재귀 타입을 사용한 json](#재귀-타입을-사용한-json)
  - [재귀 타입으로 배열 뒤집기](#재귀-타입으로-배열-뒤집기)
- [2.25 정교한 문자열 조작을 위해 템플릿 리터럴 타입을 사용하자](#225-정교한-문자열-조작을-위해-템플릿-리터럴-타입을-사용하자)
  - [템플릿 리터럴 타입으로 문자열을 조합하자](#템플릿-리터럴-타입으로-문자열을-조합하자)

---

<br>

## 2.19 공변성과 반공변성을 알아야 함수끼리 대입할 수 있다.

---

어떤 함수는 다른 함수에 대입할 수 있고, 어떤 함수는 대입할 수 없는 경우를 이해하려면 공변성과 반공변성이라는 개념을 알아야 합니다.

- 공변성 : A가 B보다 좁은 타입일 때, `T<A>` -> `T<B>`인 경우
- 반공변성 : A가 B보다 좁은 타입일 때, `T<B>` -> `T<A>`인 경우
- 이변성 : A가 B보다 좁은 타입일 때, `T<A>` -> `T<B>` 이고 `T<B>` -> `T<A>`인 경우
- 무공변성 : A가 B보다 좁은 타입일 때, `T<A>` -> `T<B>` 도 아니고 `T<B>` -> `T<A>`도 아닌 경우

<br>

### 2.19.1 함수의 반환값은 항상 공변성을 갖고 있습니다.

```ts
function a(x: string): number {
  return 0;
}
type B = (x: string) => number | string;
let b: B = a;
```

a 함수를 B 타입에 대입할 수 있습니다. 반대의 경우에는 항상 에러가 발생합니다.<br>
함수의 반환값 타입을 보면, a는 number를 반환하고, B는 number | string을 반환하므로, B가 a보다 넓은 타입입니다.

이 관계를 a -> b라고 표현할 수 있습니다.

<br>

### 2.19.2 함수의 매개변수는 반공변성을 갖고 있습니다.

함수의 매개변수의 경우 tsconfig 옵션인 strict 옵션(또는 strictFunctionTypes)에 따라서 다릅니다.<br>

- 매개변수의 경우는 strict 옵션에서 반공변성을 가집니다.<br>
  B가 a보다 좁은 상황에서 a를 b에 대입할 수 있습니다. 반대는 에러가 발생합니다.

```ts
function a(x: string | number): number {
  return 0;
}
type B = (x: string) => number;
let b: B = a;
```

- strict 옵션이 꺼져있다면 이변성을 가집니다. 아래 두 경우 모두 대입가능합니다.

```ts
function a1(x: string | number): number {
  return 0;
}
type B1 = (x: string) => number;
let b: B1 = a1;

function a2(x: string): number {
  return 0;
}
type B2 = (x: string | number) => number;
let b: B2 = a2;
```

<br>

객체의 메서드를 타이핑할 때 타이핑 방법에 따라 변성이 정해집니다.<br>
객체의 메서드를 정의할 때 2가지 방법을 사용할 수 있습니다.<br>

1. 메서드로 정의하는 방식
2. 함수 프로퍼티로 정의하는 방식, 이 방식은 객체의 프로퍼티 값으로 함수를 할당합니다.

먼저, 자바스크립트 코드로 확인해 봅시다.

```js
// 메서드로 정의하는 방식
const obj1 = {
  say(a) {
    return a;
  },
};

// 함수 프로퍼티로 정의하는 방식
const obj2 = {
  say: function (a) {
    return a;
  },
};
```

자바스크립트에서는 두 방식에서 기능적 차이점은 없습니다.<br>
하지만, 타입스크립트에서는 타이핑 방법에 따라 변성이 변합니다.

```ts
// 메서드로 정의
interface SayMethod {
  say(a: string | number): string;
}

// 함수 프로퍼티 정의
interface SayFunction {
  say: (a: string | number) => string;
}
interface SayCall {
  say: {
    (a: string | number): string;
  };
}
```

메서드로 선언한 것은 매개뱐수가 이변성을 가집니다.<br>
함수 프로퍼티로 선언한 것은 반공변성을 가집니다.

<br>

## 2.20 클래스는 값이면서 타입이다.

---

자바스크립트에서 클래스는 아래처럼 정의합니다.

```js
class Person {
  constructor(name, age, married) {
    this.name = name;
    this.age = age;
    this.married = married;
  }
}
```

타입스크립트에서는 아래처럼 작성합니다.

```ts
class Person {
  name: string;
  age: number;
  married: boolean;
  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age;
    this.married = married;
  }
}
```

맴버는 항상 constructor 내부와 짝이 맞아야 합니다.<br>

```ts
class Person {
  name: string;
  married: boolean; // error
  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age; // error
  }
}
```

`married: boolean`에서 발생하는 에러와 `this.age`에서 에러가 발생하는 원리는 조금 다릅니다.<br>

tsconfig.json에서 strict옵션이 활성화되어 있다고 했기때문에 strictPropertyInitialization 옵션도 활성화된 상태입니다. 이 옵션이 활성화되어 있으면 맴버로 선언한 프로퍼티는 생성자에서 초기화 되어야 합니다. 위 코드에서는 생성자에서 married가 초기화되지 않았기 때문에 에러가 발생한 것입니다.

반면, this.age에서 발생한 에러는, 타입스크립트 클래스에서는 기본적으로 생성자에서 프로퍼티를 사용하려면 맴버변수로 먼저 선언해야 하는데 age는 맴버변수로 선언되지 않았기 때문에 에러가 발생한 것입니다.

<br>

조금 더 엄격하게, 클래스의 멤버가 제대로 들어 있는지 검사하는 방법은 인터페이스와 함께 `implements` 예약어를 사용하는 것입니다.

```ts
interface Human {
  name: string;
  age: number;
  married: boolean;
  sayName(): void;
}
class Person implements Human {
  // error
  name;
  age;
  married;
  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age;
    this.married = married;
  }
}
```

Person 클래스는 human 인터페이스의 sayName 메서드를 구현하지 않았기 때문에 에러가 발생합니다.

<br>

타입스크립트에서 클래스는 값으로 쓰이면서 타입이 되기도 합니다.<br>
타입으로 사용할 때 클래스 이름으로 타이핑하면 그 변수는 클래스의 인스턴스로 사용할 수 있고, `typeof 클래스 이름` 이렇게 타이핑하면 그 변수는 클래스 그 자체로 사용할 수 있습니다.

```ts
const person1: Person = new Person("zero", 28, false);
const P: typeof Person = Person;
const person2 = new P("nero", 32, true);
```

클래스 맴버로는 옵셔널(?), readonlt, public, protected, private 수식어를 붙일 수 있습니다.

- public<br>
  protected, private이 붙지 않으면 기본적으로 모든 맴버변수는 public입니다.<br>
  선언한 자신 클래스, 상속받은 자손 클래스, 클래스의 인스턴스에서 이 속성을 사용할 수 있습니다.

- protected<br>
  선언한 자신 클래스, 상속받은 자손 클래스에서만 이 속성을 사용할 수 있습니다. 인스턴스에서는 사용할 수 없습니다.

- private<br>
  자신의 클래스에서만 이 속성을 사용할 수 있습니다.<br>

  ### private 수식어와 #의 차이점

  자바스크립트의 private field(#) 과 의도는 같지만 차이점이 있습니다. private으로 선언한 속성은 상속받은 자손 클래스에서 같은 이름의 속성을 사용할 수 없습니다. 반면 #을 붙인 속성은 자손 클래스에서 같은 이름의 속성을 사용할 수 있습니다.

  ```ts
  class PrivateMember {
    private priv: string = "priv";
  }
  class ChildPrivateMember extends PrivateMember {
    private priv: string = "priv";
  }
  // error

  class PrivateField {
    #priv: string = "priv";
    sayPriv() {
      console.log(this.#priv);
    }
  }
  class childPrivateField extends PrivateField {
    #priv: string = "priv";
  }
  ```

인터페이스를 implements 할 때는 모든 속성이 public 이어야 합니다.<br> private, protected면 에러가 발생합니다.

명시적으로 오버라이드 하고 싶다면 noImplicitOverride 옵션을 활성화하고 `override`수식어를 붙이면 됩니다.

```ts
class Human {
  eat() {
    console.log("냠냠");
  }
  sleep() {
    console.log("쿨쿨");
  }
}
class Employee extends Human {
  work() {
    console.log("끙차");
  }
  override sleep() {
    console.log("에고고");
  }
}
```

<br>

### 클래스 인덱스 시그니처

객체에서 인덱스 시그니처를 사용하여 동적으로 추가되는 프로퍼티의 키와 값의 타입을 제한할 수 있습니다.

클래스의 속성에도 인덱스 시그니처를 사용할 수 있습니다

```ts
class Sinature {
  [propName: string]: string | number | undefined;
  static [propName: string]: boolean;
}

const sig = new Sinature();
sig.hello = "world";
Sianture.isGood = true;
```

클래스나 인터페이스의 메서드에서는 this를 타입으로 사용할 수 있습니다.

```ts
class A {
  consructor(public age?: number) {}

  sayAge(this: A) {
    console.log(this.age);
  }
  callbackWithThis(cb: (this: this) => void) {
    cb.call(this);
  }
  callbackWithoutThis(cb: () => void) {
    cb.call(this);
  }
}
new A().callbackWithThis(function () {
  this;
});
new A().callbackWithoutThis(function () {
  this;
});
```

sayAge 처럼 명시적으로 this를 타이핑할 수도 있습니다.<br>
아니면, callbackWithThis 처럼 this를 this로 타이핑할 수 있습니다.

### 2.20.1 추상 클래스

`추상 클래스(abstract class)`를 사용하면 implements보다 조금 더 구체적으로 클래스의 모양을 정의할 수 있습니다.<br>

```ts
abstract class AbstractPerson {
  name: string;
  age: number;
  married: boolean = false;
  abstract value: number;

  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age;
    this.married = married;
  }

  sayName() {
    console.log(this.name);
  }

  abstract sayAge(): void;
  abstract sayMarried(): void;
}

class RealPerson extends AbstractPerson {
  // error
  sayAge() {
    console.log(this.age);
  }
}
```

`abstract`가 붙은 속성 또는 메서드는 반드시 상속받는 클래스에서 정의해야 합니다.<br>
위 코드에서 AbstractPerson클래스르 상속받은 RealPerson 클래스에서 value, sayMarried 가 구현되어 있지 않기 때문에 에러가 발생합니다.

```ts
class RealPerson extends AbstractPerson {
  value: number = 0;
  sayMarried() {
    console.log(this.married);
  }
  sayAge() {
    console.log(this.age);
  }
}
```

객체 타이핑을 위해 interface로 implements 하느냐, 클래스를 사용하냐는 취향차이입니다.<br>
차이점은 클래스를 사용하면 자바스크립트로 변환된 후에도 코드로 남아있다는 것입니다.

<br>

## 2.21 enum은 자바스크립트에서도 사용할 수 있다.

---

enum 타입은 여러 상수를 나열하는 목적으로 쓰입니다<br>
enum(열거형) 타입은 원래 자바스크립트에는 없는 타입이지만, 자바스크립트의 값으로 사용할 수 있는 특이한 타입입니다. 자바스크립트로 변환해도 사라지지 않고, 모두 자바스크립트 코드로 남게됩니다.

```ts
enum Level {
  ONE, // 0
  TWO, // 1
  THREE = 10,
  FOUR, // 여기는 11
}
```

ONE, TWO 처럼 enum 내부에 존재하는 것들의 이름을 맴버라고 부릅니다.
<br>
멤버에는 기본적으로 숫자 0부터 순서대로 할당되고, FOUR 처럼 할당되어 있지 않고 이전의 할당된 값이 있다면, 그 할당된 값의 +1 한 값이 저절로 할당됩니다.

문자열도 할당 가능하지만, 한 멤버를 문자열로 할당하면 할당한 맴버 뒤의 모든 맴버에 직접 값을 할당해야 합니다.

```ts
enum Level {
  ONE,
  TWO = "ㄴ",
  THREE = "10",
  FOUR = 11,
}
```

enum 타입의 속성은 값으로도 활용할 수 있습니다.

```ts
enum Level {
  ONE,
  TWO,
  THREE,
  FOUR,
}
const a = Level.THREE; // '10'
const b = Level[Level.ONE]; // 'ONE'
const c = Level[Level.FOUR]; // 'FOUR'
```

enum은 값보다는 타입으로 사용하는 경우가 더 많습니다.

```ts
function whatsYourLevel(level: Level) {
  console.log(Level[level]);
}

const myLevel = Level.TWO;
whatsYourLevel(myLevel); // 'TWO'
```

enum을 타입으로 사용하면 enum의 맴버 이름의 유니언과 비슷한 역할을 합니다.

enum은 같은 enum에 있는 멤버끼리만 구분할 수 있습니다. 다른 enum의 멤버끼리는 구분되지 않을 수 있습니다.

const enum을 사용하면 자바스크립트 코드가 생기지 않습니다.<br>
다만 const를 사용하면 []로 접근할 수 없습니다.

```ts
const enum Money {
  WON,
  DOLLAR,
}
Money.WON;
MONEY[(Money, WON)];
// A const enum member can only be accessed using a string literal.
```

<br>

---

## 2.22 infer로 타입스크립트의 추론을 직접 활용하자

infer 키워드를 통해 타입 추론이 가능합니다. <br>
추론하려는 부분을 infer로 만들면 됩니다.

```ts
type El<T> = T extends (infer E)[] ? E : never;
type Srt = El<string[]>;
type NumOrBool = El<(number | boolean)[]>;
```

`El<string[]>`으로 T는 string[] 이 됩니다.<br>
T는 어떤 타입 E의 배열로 확장가능합니다. 따라서 참이 됩니다.<br>
infer 키워드로 E의 타입, 즉 배열 요소의 타입을 추론하도록 지정했습니다. 그래서 E는 string이 됩니다.

(...args: any) => any 는 임의의 함수를 타이핑하는 부분입니다.<br>
abstract new (...args: any) => any 는 임의의 생성자를 타이핑하는 방법입니다.<br>
이 둘에서 추론하길 원하는 매개변수와 반환값 부분에 infer를 붙이면 됩니다.

### 함수 매개변수 타입 추론

```ts
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;
type P = MyParameters<(a: string, b: number) => string>;
```

(...args: any) => any 는 임의의 함수를 타이핑하는 부분입니다.

### 생성자 매개변수 타입 추론

```ts
type MyConstructorParameters<T> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;
type CP = MyConstructorParameters<new (a: string, b: number) => {}>;
```

### 반환값 타입 추론

```ts
type MyReturnType<T> = T extends (...args: any) => infer R ? R : never;
type R = MyReturnType<(a: string, b: number) => string>;
```

### 인스턴스 타입 추론

```ts
type MyInstanceType<T> = T extends abstract new (...args: any) => infer R
  ? R
  : any;
type I = MyInstanceType<new (a: string, b: number) => {}>;
```

<br>
서로 다른 타입변수를 만들어서 매개변수와 반환값을 동시에 추론할 수도 있습니다.

```ts
type MyPAndR<T> = T extends (...args: infer P) => infer R ? [P, R] : never;
type PR = MyPAndR<(a: string, b: number) => string>;
// type PR = [[string, number], string]
```

<br>

### 유니언, 인터섹션

같은 이름으로 타입 변수를 만들어서 여러 곳에서 쓸 수도 있습니다.<br>

유니언
기본적으로 같은 이름의 타입 변수는 서로 유니언이 됩니다. <br>

```ts
type Union<T> = T extends { a: infer U; b: infer U } ? U : never;
type Result = Union<{ a: string | number; b: number | boolean }>;
// type Reslt = string | number | boolean
```

<br>

하지만 매개변수의 경우에는 다릅니다. 매개변수는 반공변성을 갖고 있으므로 매개변수인 경우에는 인터섹션이 됩니다.

```ts
type Intersection<T> = T extends {
  a: (pa: infer U) => void;
  b: (pb: infer U) => void;
}
  ? U
  : never;

const MyObj = {
  a(pa: 1 | 2): void {},
  b(pb: 2 | 3): void {},
};
type Result2 = Intersection<typeof MyObj>;
// type Result2 = 2
```

<br>

## 2.23 타입을 좁혀 정확한 타입을 얻어내자

---

타입 좁히기 방법에는 여러가지가 있습니다.<br>
이때 중요한 점이 있습니다.<br>
타입 좁히기는 자바스크립트 문법을 사용해서 진행해야 한다는 점입니다. <br>
즉, 자바스크립트에서도 실행할 수 있는 코드여야 합니다.

### typeof 연산자로 타입 좁히기

```ts
function strOrNum(param: string | number) {
  if (typeof param === "string") {
    param; // (parameter) param: string
  } else if (typeof param === "number") {
    param; // (parameter) param: number
  } else {
    param; // (parameter) param: never
  }
}
```

else 문에서 param 타입은 string 도 number도 아니기 때문에 never입니다.<br>
이렇게 타입스크립트가 코드를 파악해서 타입을 추론하는 것을 `제어 흐름 분석`이라고 부릅니다.

<br>

### null, undefined 구분

타입 좁히기에 꼭 typeof를 써야 할 필요는 없습니다.

```ts
function strOrNullOrUndefined(param: string | null | undefined) {
  if (param === null) {
    param; // (parameter) param: null
  } else if (param === undefined) {
    param; // (parameter) param: undefined
  } else {
    param; // (parameter) param: string
  }
}
```

<br>

### boolean 타입 구분

boolean은 true | false입니다.

```ts
function trueOrFalse(param: boolean) {
  if (param) {
    param; // (parameter) param: true
  } else {
    param; // (parameter) param: false
  }
}
```

<br>

### 배열 타입 구분

Array.isArray를 사용해서 구분할 수 있습니다.

```ts
function StrOrNumArr(param: string | number[]) {
  if (Array.isArray(param)) {
    param; // (parameter) param: number[]
  } else {
    param; // (parameter) param: string
  }
}
```

<br>

### 클래스 구분

instanceof 연산자로 구분할 수 있습니다.

```ts
class A {};
class B {};

fucntion classAOrB (param: A | B) {
	if(param instanceiof A) {
		param  // (parameter) param: A
	} else {
		param // (parameter) param: B
	}
}
```

<br>

### 서로다른 두 객체 구분

아래 방식으로는 서로 다른 두 객체를 구분할 수 없습니다

#### instanceof(error)

```ts
interface X {
  width: number;
  height: number;
}
interface Y {
  length: number;
  center: number;
}
function objXorY(param: X | Y) {
  if (param instanceof X) {
    param;
  } else {
    param;
  }
}
// 'X' only refers to a type, but is being used as a value here.
```

그럼 어떻게 구분할 수 있을까요?

#### 1. in 연산자 사용하기

```ts
function objXorY(param: X | Y) {
  if ("wdith" in param) {
    param; // (parameter) param: X
  } else {
    param; // (parameter) param: Y
  }
}
```

<br>

#### 2. 브랜드 속성 사용하기

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
function moneyOrLiter(param: Money | Liter) {
  if (param.__type === "money") {
    param; // (paramter) param: Money
  } else {
    param; // (paramter) param: Liter
  }
}
```

<br>

#### 3. is 특수 연산자를 사용한 서술 함수

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
function isMoney(param: Money | Liter): param is Money {
  if (param.__type === "money") {
    return true;
  } else {
    return false;
  }
}
function moneyOrLiter(param: Money | Liter) {
  if (isMoney(param)) {
    param;
  } else {
    param;
  }
}
```

isMoney 함수의 반환값 타입으로 param is Money 타입을 표기했습니다.<br>
이를 서술 함수(Type Predicate)라고 부릅니다.
이렇게 하면 isMoney의 반환값이 true일 때 매개변수의 타입도 is 뒤에 적은 타입으로 좁혀집니다.

<br>

## 2.24 자기 자신을 타입으로 사용하는 재귀 타입이 있다.

타입스크립트에는 재귀 타입이 있습니다.<br>
재귀 타입은 자기 자신을 타입으로 다시 사용합니다.

```ts
type Recursive = {
  name: string;
  children: Recursive[];
};
const recur1: Recursive = {
  name: "test",
  children: [],
};
const recur2: Recursive = {
  name: "test1",
  children: [
    { name: "test2", children: [] },
    { name: "test3", children: [] },
  ],
};
```

자바스클비트에서 재귀 함수를 사용할 때는 Maximum call stack size exceede 에러르 조심해야 합니다.<br>
타입스크립트에서도 비슷하게 재귀 타입을 사용할 때 에러가 발생할 수 있습니다.

```ts
type InfiniteRecur<T> = {
  item: InfiniteRecur<T>;
};
type Unwrap<T> = T extends { item: infer U } ? Unwrap<U> : T;
type Result = Unwrap<InfiniteRecur<any>>; // error
```

1. `InfiniteRecur<T>` 이 타입은 재귀적으로 정의된 타입입니다. 이 타입은 item이라는 속성을 가지며, 이 속성의 타입 역시 `InfiniteRecur<T>`입니다. 이렇게 타입이 자신을 참조하는 형태로 정의되면, 이 타입은 무한히 중첩된 구조를 가질 수 있습니다.

2. `Unwrap<T>` 이 타입은 조건부 타입으로, T가 { item: infer U } 형태의 타입 즉, item 속성을 가진 객체의 타입인 경우에는 `Unwrap<U>`를 반환하고, 그렇지 않은 경우에는 T를 그대로 반환합니다. 여기서 infer U는 T가 { item: infer U } 형태의 타입일 때 U를 item 속성의 타입으로 추론하게 합니다. Unwrap<T> 역시 재귀적으로 정의된 타입으로, T가 {item infer U} 형태의 타입인 경우에는 무한히 중첩된 구조를 가질 수 있습니다.

<br>

### 재귀 타입을 사용한 JSON

JSON은 문자여르 숫자, 불 값, null, 다른 JSON으로 구성된 배열 또는 객체입니다. JSON 배열이나 JSON 객체 내부에는 른 JSON이 들어갈 수 있으므로 재귀 타입으로 선언해야 합니다.

```ts
type JSONType =
	| string
	| boolean
	| number
	| null
	| JSONType[]
	| { [key: string]: JSONType };

const a: JSONType = 'string';
const b: JSONType = [1, false, {'hi', 'json'}];
const c: JSONType = {
	prop: null,
	arr: [{}]
}
```

<br>

### 재귀 타입으로 배열 뒤집기

재귀 타입으로 배열을 뒤집을 수 있습니다.<br>
[1,2,3] 타입이 있다면 [3,2,1]로 만들 수 있습니다.

```ts
type Reverse<T> = T extends [...infer L, infer R] ? [R, ...Reverse<L>] : [];
```

1. [1,2,3] 배열 타입이 있을 때 Reverse<[1,2,3]> 이 됩니다.
2. 그럼 L은 [1,2], R은 3이 됩니다.
3. 그럼 반환 타입은 [3, ...Reverse<[1,2]>] 이 되는데 재귀로 다시 Reverse<T>가 됩니다.
4. 이제 L은 [1], R은 2가 됩니다.
5. 그럼 반환은 [2,...Reverse<[1]>] 이 됩니다.
6. Reverse<[1]> 은 [1, ...Revese<[]>] 이 됩니다.
7. Reverse<[]>는 [] 이므로 Reverse[1]은 [1]
8. Reverse<[1,2]>는 [2,1]
9. Reverse<[1,2,3]>는 [3,2,1]입니다.

이 `Reverse<T>`로 함수의 매개변수 순서를 바꾸는 타입을 만들 수 있습니다.

```ts
type Reverse<T> = T extends [...infer L, infer R] ? [R, ...Reverse<L>] : [];

type FlipArg = T extends (...args: infer A) => infer R
  ? (...args: Reverse<A>) => R
  : never;
```

<br>

## 2.25 정교한 문자열 조작을 위해 템플릿 리터럴 타입을 사용하자

---

템플릿 리터럴 타입은 특수한 문자열 타입으로 자바스크립트의 템플릿 리터럴과 사용법이 비슷하지만, 값 대신 타입을 만들기 위해 사용합니다.<br>

아래 코드는 템플릿 리터럴 타입의 간단한 예시입니다.

```ts
type Literal = "Literal";
type Template = `template ${Literal}`;
// type Template = "template Literal"
const str: Template = "template Literal";
```

{}안에 string을 사용하면 타입을 더 넓힐 수 있습니다.

```ts
type Template = `template ${string}`;
let str: Template = "template ";
str = "template 123";
str = "template hello";
```

<br>

### 템플릿 리터럴 타입으로 문자열을 조합하자

템플릿 리터럴 타입을 사용하면 문자열의 조합을 표현할 때 편리합니다.

```ts
type City = "seoul" | "suwon" | "busan";
type Vehicle = "car" | "bike" | "walk";
type ID = `${City} : ${Vehicle}`;
const id: ID = "seoul : car";
```

각각 지역과 이동수단을 뜻하는 City와 vehicle이 늘어나도 각 City, vehicle 타입에 추가만하면 됩니다.
