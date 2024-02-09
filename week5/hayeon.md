# 스터디 5주차

### 📝 5주차 스터디 목차

## 목차

- [2.19 공병성과 반공변성을 알아야 함수끼리 대입할 수 있다](#219-공병성과-반공변성을-알아야-함수끼리-대입할-수-있다)
- [2.20 클래스는 값이면서 타입이다](#220-클래스는-값이면서-타입이다)
  - [2.20.1 추상 클래스](#2201-추상-클래스)
- [2.21 enum은 자바스크립트에서도 사용할 수 있다](#221-enum은-자바스크립트에서도-사용할-수-있다)
- [2.22 infer로 타입스크립트의 추론을 직접 활용하자](#222-infer로-타입스크립트의-추론을-직접-활용하자)
- [2.23 타입을 좁혀 정확한 타입을 얻어내자](#223-타입을-좁혀-정확한-타입을-얻어내자)
- [2.24 자기 자신을 타입으로 사용하는 재귀 타입이 있다](#224-자기-자신을-타입으로-사용하는-재귀-타입이-있다)
- [2.25 정교한 문자열 조작을 위해 템플릿 리터럴 타입을 사용하자](#225-정교한-문자열-조작을-위해-템플릿-리터럴-타입을-사용하자)

<br>

## 2.19 공변성과 반공변성을 알아야 함수끼리 대입할 수 있다

어떤 함수는 다른 함수에 대입할 수 있고, 어떤 함수는 대입할 수 없다. 이 관계를 이해하려면 공변성과 방공변성이라는 개념을 알아야 한다.

- 공변성 : A -> B 일 때 `T<A> -> T <B>` 인 경우
- 반공변성 : A -> B 일 때` T<B> -> T <A>` 인 경우
- 이변성 : A -> B 일 때 `T<A> -> T<B> `도 되고` T<B> -> T<A>`도 되는 경우
- 무공변성 : A -> B 일 때 `T<A> -> T<B> `도 안 되고 `T<B> -> T<A>`도 안 되는 경우

기본적으로 타입스크립트는 공변성을 갖고 있지만, 함수의 매개변수는 반공변성을 갖고 있다.
<br>

> 이때 TS Config메뉴에서 strictFunctionTypes 옵션이 체크되어 있어야 한다.
> strictFunctionTypes 과 strict옵션 모두 체크되어 있지 않다면 타입스크립트는 매개변수에 대해 이변성을 갖는다.

실제 코드로 테스트해보면서 이해하자.

<br>

### 공변성

```ts
function a(x: string): number {
  // a 함수
  return 0;
}
type B = (x: string) => number | string; // b 타입
let b: B = a; // a 함수를 b 타입에 대입할 수 있다.
```

함수의 반환값 타입을 보면 b가 a보다 넓은 타입이다. 이 관계를 `a -> b`라고 표현한다.
`T 타입을 함수<반환값>`으로 생각하면 a->b 일 때 `T<a> , T<b>`으로 나타낼 수 있다.
즉 위의 코드에서 a 와 b 함수는 공변성을 갖고 있다고 볼 수 있다.

<br>

### 반환값은 항상 공변성을 가진다.

```ts
function a(x: string): number | string {
  return 0;
}
type B = (x: string) => number;
let b: B = a; // Error!
/*
'(x: string) => string | number' 형식은 'B' 형식에 할당할 수 없습니다.
  'string | number' 형식은 'number' 형식에 할당할 수 없습니다.
    'string' 형식은 'number' 형식에 할당할 수 없습니다. 
*/
```

이번엔 b -> a인 상황에서 함수 a를 타입 b에 대입하면 에러가 발생한다.
여기서 strict옵션을 해제해도 여전히 에러가 발생한다. 즉 반환값에 대해선 항상 공변성을 가진다고 볼 수 있다.

<br>

### 매개변수는 strict옵션에서 반공변성을 가진다.

```ts
function a(x: string | number): number {
  return 0;
}
type B = (x: string) => number;
let b: B = a;
```

매개변수를 보면 `string -> string | number`이므로 `b -> a`인 상황이다.
a를 b에 대입할 수도 있다. b -> a에서 `T<a> -> T <b>`이므로 매개변수는 반공변성을 가진다.

- 매개변수는 strict옵션일 때 반공변성을 가짐
- strict옵션이 아닐 때 이변성을 가짐
  - 이유는? (`b -> a`일때 `T<a> -> T <b>`도 가능,`T<b> -> T <a>` 도 가능하기 때문이다.)

<br>

### 객체의 메서드를 타이필할 때도 타이핑 방법에 따라 변성이 정해진다.

<br>

> strict 옵션이 활성화된 상황

```ts
interface SayMethod {
  say(a: string | number): string;
}

interface SayFunction {
  say(a: string | number): string;
}

interface SayCall {
  say: {
    (a: string | number): string;
  };
}
const SayFunc = (a: string) => "hello";
const MyAddingMethod: SayMethod = {
  say: SayFunc, // 이변성
};

const MyAddingFunction: SayFunction = {
  say: SayFunc, // 반공변성
};
const MyAddingCall: SayCall = {
  say: SayFunc, // Error // 반공변성
  // '(a: string) => string' 형식은 '(a: string | number) => string' 형식에 할당할 수 없습니다.
  // 'a' 및 'a' 매개 변수의 형식이 호환되지 않습니다.
  // 'string | number' 형식은 'string' 형식에 할당할 수 없습니다.
  // 'number' 형식은 'string' 형식에 할당할 수 없습니다.
};
```

`함수(매개변수): 반환 값`으로 선언한 것은 매개변수가 `이변성`을 가지기 때문에 `함수 : (매개변수) => 반환값`으로 선언한 것은 `반공변성`을 가진다.

<br>

## 2.20 클래스는 값이면서 타입이다

타입스크립트 클래스의 특징에 대해 알아보자.

### 자바스크립트 코드

```js
class Person {
  constructor(name, age, married) {
    this.name = name;
    this.age = age;
    this.married = married;
  }
}
```

<br>

### 타입스크립트 코드

```ts
class Person {
  name: string; //
  age: number;
  married: boolean;

  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age;
    this.married = married;
  }
}
```

자바스크립트와 주요한 차이점은, 타입스크립트는 name,age,married같은 멤버를 클래스 내부에 한 번 적어야 한다는 것이다.
다음과 같이 멤버의 타입은 생략할 수 있다.

```ts
class Person {
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

<br>

### 클래스 표현식으로 선언

```ts
const Person = class {
  name;
  age;
  married; // 여기
  constructor(name: string, age: number, married: boolean) {
    // 요기
    this.name = name;
    this.age = age;
    this.married = married;
  }
};
```

멤버는 항상 constructor 내부와 짝이 맞아야 한다.
<br>

### 조금 더 엄격하게, 클래스의 멤버가 제대로 들어 있는지 검사할 수 있다.

```ts
interface Human {
  // 먼저 인터페이스 선언
  name: string;
  age: number;
  married: boolean;
  sayName(): void;
}
class Person implements Human {
  // 클래스가 인터페이스를 implements한다.
  // Error
  //'Person' 클래스가 'Human' 인터페이스를 잘못 구현합니다.
  //'sayName' 속성이 'Person' 형식에 없지만 'Human' 형식에서 필수입니다.
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

- 인터페이스와 implements 예약어를 사용하면 된다.
  에러가 나는 이유 : Person 클래스는 Human인터페이스를 implement했으나 Human인터페이스의 sayName메소드를 구현하지 않았으므로 에러가 발생합니다.
  <br>

### 생성자 함수 방식으로 객체를 만드는 것을 지원하지 않는다

```ts
interface PersonInterface {
  name: string;
  age: number;
  married: boolean;
}

function Person(
  this: PersonInterface,
  name: string,
  age: number,
  married: boolean
) {
  this.name = name;
  this.age = age;
  this.married = married;
}
new Person("zero", 28, false); // Error : 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
```

클래스는 타입스크립트에서 값으로 쓰이면서 타입이 되기도 한다.
다만 타입으로 사용할 때 클래스의 이름은 클래스 자체의 타입이 아니라 인스턴스의 타입이 된다.
클래스 자체의 타입이 필요하다면 `type of 클래스이름`으로 타이핑해야 한다.

```ts
const person1: Person = new Person("zero", 28, false);
const P: typeof Person = Person;
const person2 = new P("nero", 32, true);
```

<br>

### 클래스 멤버로는 옵셔널이나 readonly, public , protected , private수식어가 있다.

```ts
class Parent {
  name?: string;
  readonly age: number;
  protected married: boolean;
  private value: number;
  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age;
    this.married = married;
    this.value = 0;
  }
  changeAge(age: number) {
    this.age = age; // Error : 읽기 전용 속성이므로 'age'에 할당할 수 없습니다.
  }
}
class Child extends Parent {
  constructor(name: string, age: number, married: boolean) {
    super(name, age, married);
  }
  sayName() {
    console.log(this.name);
  }
  sayMarried() {
    console.log(this.married);
  }
  sayValue() {
    console.log(this.value); // Error : 'value' 속성은 private이며 'Parent' 클래스 내에서만 액세스할 수 있습니다.
  }
}

const child = new Child("zero", 28, false);
child.name;
child.married; // Error :'married' 속성은 보호된 속성이며 'Parent' 클래스 및 해당 하위 클래스 내에서만 액세스할 수 있습니다.
```

<br>

- public 속성인 경우 : 선언한 자신의 클래스, 자손 클래스, new 호출로 만들어낸 인스턴스에서 속성을 사용할 수 있다.
  > 자손 클래스 ? extends로 상속받은 클래스를 의미한다. 여러번 extends해도 자손 클래스다.
- protected 속성인 경우 : 자신의 클래스와 자손 클래스에서는 속성을 사용할 수 있으나 인스턴스에서는 사용할 수 없다.
  > married속성은 child.married에서 에러가 발생한다.
- private 속성인 경우 : 자신의 클래스에서만 속성을 사용할 수 있다.
  value속성은 Child클래스나 child.value에서 에러가 발생한다.

<br>

### public,protected,private 비교

| 수식어    | 자신 class | 자손 class | 인스턴스 |
| --------- | :--------: | :--------: | :------: |
| public    |     O      |     O      |    O     |
| protected |     O      |     O      |    X     |
| private   |     O      |     X      |    X     |

<br>

### private field(#) vs private 비교

- 공통점 : 둘다 자신의 클래스에서만 사용 가능
- 차이점 : private 수식어로 선언한 속성은 자손 클래스에서 같은 이름으로 선언 할 수 없음
  > public 수식어는 생략해도 되므로 사용하지 않고 private 수식어는 private field로 대체
  > 따라서 protected 수식어만 명시적으로 사용한다.
  > implements하는 인터페이스 속성은 전부 public이어야 한다.

```ts
class PrivateMember {
  private priv: string = "priv";
}

class ChildPrivateMember extends PrivateMember {
  //Error : 'ChildPrivateMember' 클래스가 기본 클래스 'PrivateMember'을(를) 잘못 확장합니다.
  private priv: string = "priv";
}

class PrivateFiled {
  #priv: string = "priv";
  sayPriv() {
    console.log(this.#priv);
  }
}

class ChildPrivateFiled extends PrivateFiled {
  // Ok
  #priv: string = "priv";
}
```

<br>

### 클래스 Override

> TS Config메뉴에서 noImplicit Override옵션이 체크되어 있어야 한다.

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
    // Human의 sleep메서드를 오버라이드 하고 있음 -> 앞에 명시적으로 override 수식어를 붙여야 함

    console.log("에고고");
  }
}
```

- override 수식어를 붙이면 부모 클래스의 메서드가 바뀔 때 확인할 수 있고 부모 클래스의 메서드를 실수로 변경하거나 오타를 낸 경우 쉽게 확인할 수 있다는 장점이 있다.
  > noImplicitOverride 옵션을 활성화 시켜야 함

<br>

### 클래스 속성에도 인덱스 시그니처를 사용할 수 있다.

```ts
class Signature {
  [propName: string]: string | number | undefined;
  static [propName: string]: boolean;
}
const sig = new Signature();
sig.hello = "world";
Signature.isGood = true;
```

<br>

### 클래스,인터페이스의 메서드에서 this 타입으로 사용가능

```ts
class Person {
  age: number;
  married: boolean;

  constructor(age: number, married: boolean) {
    this.age = age;
    this.married = married;
  }
  sayAge() {
    console.log(this.age); // this:this
  }
  sayMarried(this: Person) {
    // 명시적으로 this 지정
    // this:Person
    console.log(this.married);
  }
  // 콜백 함수의 this타입이 Person 인스턴스가 된다!!
  sayCallback(callback: (this: this) => void) {
    console.log(this);
  }
}
```

<br>

### 콜백 함수 this

```ts
class A {
  callbackWithThis(cb: (this: this) => void) {
    // this가 클래스 자신을 가리킴
    cb.call(this);
  }
  callbackWithoutThis(cb: () => void) {
    cb();
  }
}
new A().callbackWithoutThis(function () {
  this; // this: A
});
new A().callbackWithoutThis(function () {
  this; //Error :'this' implicitly has type 'any' because it does not have a type annotation.
});
```

<br>

### 2.20.1 추상 클래스

implements보다 조금 더 구체적인 클래스 모양을 정의하는 방법인 추상 클래스

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
  // 반드시 abstract 속성이나 메서드를 구현해야 함
  value: number = 0;
  sayAge() {
    console.log(this.age);
  }
  sayMarried() {
    console.log(this.married);
  }
}
```

위 코드를 자바스크립트로 변환

```js
"use strict";
class AbstractPerson {
  constructor(name, age, married) {
    this.married = false;
    this.name = name;
    this.age = age;
    this.married = married;
  }
  sayName() {
    console.log(this.name);
  }
}
class RealPerson extends AbstractPerson {
  constructor() {
    super(...arguments);
    this.value = 0;
  }
  sayAge() {
    console.log(this.age);
  }
  sayMarried() {
    console.log(this.married);
  }
}
```

<br>

## 인터페이스로 구현함

```ts
interface Person {
  name: string;
  age: number;
  married: boolean;
  value: number;

  sayName(): void;
  sayAge(): void;
  sayMarried(): void;
}

class RealPerson implements Person {
  name: string;
  age: number;
  married: boolean = false;
  value: number = 0;

  constructor(name: string, age: number, married: boolean) {
    this.name = name;
    this.age = age;
    this.married = married;
  }

  sayName() {
    console.log(this.name);
  }

  sayAge() {
    console.log(this.age);
  }

  sayMarried() {
    console.log(this.married);
  }
}
```

<br>

### 위 코드를 자바스크립트로 변환

```js
"use strict";
class RealPerson {
  constructor(name, age, married) {
    this.married = false;
    this.value = 0;
    this.name = name;
    this.age = age;
    this.married = married;
  }
  sayName() {
    console.log(this.name);
  }
  sayAge() {
    console.log(this.age);
  }
  sayMarried() {
    console.log(this.married);
  }
}
```

<br>

## 2.21 enum은 자바스크립트에서도 사용할 수 있다

enum(열거형)타입은 여러 상수를 나열하는게 목적이다.

다음과 같이 enum 예약어로 선언할 수 있다.

```ts
enum Level {
  NOVICE,
  INTERMEDIATE,
  ADVANCED,
  MASTER,
}
```

Level 이라는 enum 타입 아래에 존대하는 이름을 멤버(member)라고 부른다.
enum은 다은 타입들과 다르게 자바스트립트로 변환할 때 아래 코드와 같이 그대로 남는다.

> 반대로 `const enum`으로 선언하면 자바스크립트 코드가 생성되지않는다.

<br>

### 자바스크립트 코드

```js
"use strict";
var Level;
(function (Level) {
  Level[(Level["NOVICE"] = 0)] = "NOVICE"; //Level[0] = "NOVICE" 와 Level["NOVICE"] = 0을 하나로 합쳐둔 것
  Level[(Level["INTERMEDIATE"] = 1)] = "INTERMEDIATE";
  Level[(Level["ADVANCED"] = 2)] = "ADVANCED";
  Level[(Level["MASTER"] = 3)] = "MASTER";
})(Level || (Level = {}));

// 객체로 표현하면 다음과 같다.
var Level = {
  0: "NOVICE",
  1 : "INTERMEDIATE"
  2: "ADVANCED",
  3 :"MASTER"
  NOVICE:0,// 기본적으로 멤버 순서대로 숫자 할당, 3으로 할당할 수도 있음,NOVICE = 3
  INTERMEDIATE:1, // 그럼 여긴 4
  ADVANCED :2 , // ADVANCED = 7 일때
  MASTER : 3// MASTER는 8이 된다.
  };
```

<br>

### 문자열 할당

다음과 같이 문자열 할당도 가능하지만 한 멤버가 앞에서 무자열로 할당되면 그 다음부턴 쭉 직접 값으로 할당해야 한다.

```ts
enum Level {
  NOVICE, // 여기는 0
  INTERMEDIATE = "hello",
  ADVANCED = "oh",
  MASTER, // Error :열거형 멤버에는 이니셜라이저가 있어야 합니다, 즉 값으로 할당하지 않아서 에러 발생
}
```

<br>

### 속성을 값으로 할당

```ts
enum Level {
  NOVICE,
  INTERMEDIATE,
  ADVANCED,
  MASTER,
}

const a = Level.NOVICE; // 출력 : 0
const b = Level[Level.NOVICE]; //  출력 : NOVICE
console.log(a, b);
```

`enum[enum_멤버]` 는 멤버의 이름을 가져오는 방법이다.

<br>

### enum은 값으로 사용하기보다 타입으로 사용하는 경우가 많다

```ts
enum Level {
  NOVICE,
  INTERMEDIATE,
  ADVANCED,
  MASTER,
}

const a = Level.NOVICE; // 출력 : 0
const b = Level[Level.NOVICE]; //  출력 : NOVICE
console.log(a, b);

function whatYourLevel(level: Level) {
  // enum을 타입으로 사용
  console.log(Level[level]);
}

const myLevel = Level.ADVANCED;
whatYourLevel(myLevel); // 출력  : ADVANCED
```

<br>

### 타입스크립트 enum 불완전

```ts
enum Role {
  USER,
  GUEST,
  ADMIN,
}
enum Role2 {
  USER = "USER",
  GUEST = "GUEST",
  ADMIN = "ADMIN",
}

function changeUserRol(rol: Role) {}
function changeRoleRol2(rol: Role2) {}
changeUserRol(2);
changeUserRol(4); //Error : '4' 형식의 인수는 'Role' 형식의 매개 변수에 할당될 수 없습니다.
changeRoleRol2(Role2.USER);
changeRoleRol2("USER"); // Error :'"USER"' 형식의 인수는 'Role2' 형식의 매개 변수에 할당될 수 없습니다. -> 왜 에러? 타입스크립트의 enum 불완전
```

<br>

### 브랜딩 사용

```ts
enum Money {
  WON,
  DOLLAR,
}
interface Won {
  type: Money.WON;
}
interface Dollar {
  type: Money.DOLLAR;
}

function moneyOrLiter(param: Won | Dollar) {
  if (param.type === Money.WON) {
    param; // (parameter) param: Won
  } else {
    param; //(parameter) param: Dollar
  }
}
```

브랜딩 속성으로 enum의 멤버를 사용, 다만 같은 enum의 멤버여야 서로 구분된다.

<br>

## 2.22 infer로 타입스크립트의 추론을 직접 활용하자

infer예약어는 타입스크립트의 `타입 추론 기능`을 극한까지 활용하는 기능이다.
컨디셔널 타입과 함께 사용할 수 있다.

<br>

### 배열이 있을 때 배열의 요소 타입을 얻고 싶을 때 사용

```ts
type El<T> = T extends (infer E)[] ? E : never; //infer E
type Str = El<string[]>; //type Str = string
type NumOrBool = El<(number | boolean)[]>; //type NumOrBool = number | boolean
```

타입스크립트에 추론을 맡기고 싶은 부분을 `infer 타입_변수`로 표시하면 된다.

> 다만 컨디셔널 타입에서 타입 변수는 참 부분에서만 쓸 수 있다. 거짓 부분에서 쓰면 에러 발생

<br>

### infer 타입 추론 예시코드

```ts
// 매개변수 타입추론
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// 생성자 매개변수 타입추론
type MyConstructorParameter<T> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;
// 반환값  타입추론
type MyReturnType<T> = T extends (...args: any) => infer R ? R : any;
//인스턴스 타입 타입추론
type MyInstanceType<T> = T extends abstract new (...args: any) => infer R
  ? R
  : any;

type P = MyParameters<(a: string, b: number) => string>;
//type P = [a: string, b: number]
type R = MyReturnType<(a: string, b: number) => string>;
//type R = string

type CP = MyConstructorParameter<new (a: string, b: number) => {}>;
//type CP = [a: string, b: number]
type I = MyInstanceType<new (a: string, b: number) => {}>;
//type I = {}
```

<br>

`(...args : any)=> any` 임의의 함수를 타이핑하는 부분 <br>
`abstract new (...args: any) => any` 임의의 생성자를 타이핑하는 방법
추론하길 원하는 매개변수와 반환값 부분을 infer로 바꾸면 된다.

<br>

### 서로 다른 타입 변수를 여러 개 동시에 사용 가능

```ts
type MyPAndR<T> = T extends (...args: infer P) => infer R ? [P, R] : never;
type PR = MyPAndR<(a: string, b: number) => string>;
//type PR = [[a: string, b: number], string]
```

매개변수 P타입 변수로 , 반환값은 R 타입 변수로 추론

<br>

### 같은 타입 변수를 여러 곳에 사용 가능

```ts
type Union<T> = T extends { a: infer U; b: infer U } ? U : never;
type Result1 = Union<{ a: 1 | 2; b: 2 | 3 }>;
//type Result1 = 1 | 2 | 3
type Intersection<T> = T extends {
  a: (pa: infer U) => void;
  b: (pa: infer U) => void;
}
  ? U
  : never;
type Result2 = Intersection<{ a(pa: 1 | 2): void; b(pb: 2 | 3): void }>;
//type Result2 = 2
```

<br>

## 2.23 타입을 좁혀 정확한 타입을 얻어내자

> 타입스크립트가 코드를 파악해 타입을 추론하는 곳을 제어 흐름 분석(Control Flow Analysis)이라 부른다.

```ts
// 클래스 구분 방법
class A {}
class B {}
function classAorB(param: A | B) {
  if (param instanceof A) {
    //(parameter) param: B
    param; //(parameter) param: A
  } else {
    param; //(parameter) param: B
  }
}
function numOrStr(a: number | string) {
  if (typeof a === "string") {
    a.split(",");
  } else {
    a.toFixed(1);
  }
}
// 배열 구분 방법
function numOrNumArr(a: number | number[]) {
  if (Array.isArray(a)) {
    a.slice(1); //(parameter) a: number[]
  } else {
    a.toFixed(1); //(parameter) a: number
  }
}

type B = { type: "b"; bbb: string };
type C = { type: "c"; ccc: string };
type D = { type: "d"; ddd: string };
type A = B | C | D;
function typeCheck(a: A) {
  if (a.type === "b") {
    a.bbb; //(parameter) a: B
  } else if (a.type === "c") {
    a.ccc; //(parameter) a: C
  } else {
    a.ddd; //(parameter) a: D
  }
}
```

```ts
// instanceof 연산자 사용, 클래스 구분 방법
class A {}
class B {}
function classAorB(param: A | B) {
  if (param instanceof A) {
    //(parameter) param: B
    param; //(parameter) param: A
  } else {
    param; //(parameter) param: B
  }
}

// in 연산자 사용
function numOrStr(a: number | string) {
  if (typeof a === "string") {
    a.split(",");
  } else {
    a.toFixed(1);
  }
}
interface X {
  width: number;
  height: number;
}
interface Y {
  length: number;
  center: number;
}
function objXorY(param: X | Y) {
  if ("width" in param) {
    param;
  } else {
    param;
  }
}
```

- instanceof 연산자

  - instanceof 연산자는 객체가 특정 클래스의 인스턴스인지를 판별한다.
    classAorB 함수에서는 param이 A 클래스의 인스턴스인지 여부를 확인하여 A와 B 클래스를 구분한다.

- in 연산자

  - in 연산자는 객체가 특정 프로퍼티를 가지고 있는지를 판별한다.
  - objXorY 함수에서는 param이 X 인터페이스를 구현한 객체인지를 판별하여 X와 Y를 구분한다.

<br>

## 2.24 자기 자신을 타입으로 사용하는 재귀 타입이 있다

```ts
type Recursive = {
  name: string;
  children: Recursive[]; //자신의 타입을 사용하는 것을 재귀 타입이라 부른다.
};

const recur1: Recursive = {
  name: "test",
  children: [],
};

const recur2: Recursive = {
  name: "test",
  children: [
    { name: "test2", children: [] },
    { name: "test3", children: [] },
  ],
};
```

### 컨디셔널 타입에도 사용

```ts
type Ele<T> = T extends any[] ? Ele<T[number]> : T;

// 타입 인수로 사용 불가능
type T = number | string | Record<string, T>; // Error : 'T' 형식 별칭은 순환적으로 자신을 참조합니다.

// 타입 인수를 쓰지 않는 방식으로 수정
type T = number | string | { [key: string]: T }; // Ok
```

<br>

### 재귀 함수 사용 시 에러 발생

```ts
type InfiniteRecur<T> = { item: InfiniteRecur<T> }; // 재귀
type Unwrap<T> = T extends { item: infer U } ? Unwrap<U> : T;
type Result = Unwrap<InfiniteRecur<any>>; // Error: Type instantiation is excessively deep and possibly infinite.
```

InfiniteRecur 타입은 무한 중첩된 item 속성을 갖고 있기 때문에 Unwrap 타입은 유한한 시간안에 InfiniteRecur 타입을 처리할 수 없다.

<br>

### 대표적인 예시로 JSON타입이 있다.

JSON은 문자열, 숫자 , 불 값 , null 그 자체이거나 다른 Json으로 구성된 배열 또는 객체 이다.
Json 객체 내부에는 다른 JSON이 들어 있을 수 있으므로 다음과 같이 재귀 타입으로 선언해야 한다.

```ts
type JSONType =
  | string
  | number
  | boolean
  | null
  | JSONType[]
  | { [key: string]: JSONType };

const a: JSONType = "string";
const b: JSONType = [1, false, { hi: "json" }];
const c: JSONType = { pop: null, arr: [{}] };
```

<br>

### 배열 타입 거꾸로 뒤집기

```ts
type Reverse<T> = T extends [...infer L, infer R] ? [R, ...Reverse<L>] : [];
```

- Reverse`<T> 타입`은 입력된 타입 T가 배열인 경우에는 R을 첫 요소로 하고, 나머지 요소는 L을 역순으로 변환하고, 배열이 아닌 경우에는 빈 배열을 반환한다.

<br>

### 함수의 매개변수 순서를 바꾸는 타입도 만들 수 있다.

```ts
type Reverse<T> = T extends [...infer L, infer R] ? [R, ...Reverse<L>] : [];
type FlipArguments<T> = T extends (...args: infer A) => infer R
  ? (...args: Reverse<A>) => R
  : never;

type Flipped = FlipArguments<(a: string, b: number, c: boolean) => string>;
//type Flipped = (args_0: boolean, args_1: number, args_2: string) => string
```

<br>

## 2.25 정교한 문자열 조작을 위해 템플릿 리터럴 타입을 사용하자

템플릿 리터널 타입은 특수한 문자열 타입이다. 백틱과 보간을 사용하는 자바스크립트와 비슷하지만 값 대신 `타입을 만들기 위해` 사용된다.

```ts
type Template = `template ${string}`;
let str: Template = "template ";
str = "template hello";
str = "template 123";
str = "template"; // Error: '"template"' 형식은 '`template ${string}`' 형식에 할당할 수 없습니다.
```

마지막 str은 template 문자열 뒤에 띄어쓰기가 없기 때문에 에러가 발생한다.
이렇듯 템플릿 리터럴 타입을 사용하면 문자열 변수를 엄격하게 관리할 수 있다.

<br>

### 문자열 조합

예를 들어 '지역:이동수단' 으로 표현하고 싶다면 다음과 같이 나타낼 수 있다.

```ts
type City = "seoul" | "suwon" | "busan";
type Vehicle = "car" | "bike" | "walk";
type ID = `${City}:${Vehicle}`;
const id: ID = "seoul:walk";
```

<br>

### 제네릭 및 infer과 같이 사용하기

```ts
type RemoveX<Str> = Str extends `x${infer Rest}`
  ? RemoveX<Rest>
  : Str extends `${infer Rest}x`
  ? RemoveX<Rest>
  : Str;
type Removed = RemoveX<"xxtestxx">; //type Removed = "test"
```

좌우 공백이 있는 문자열 타입에서 공백을 제거하는 작업, ' test ' -> 'test'타입으로 만드는 것

> 재귀 호출도 가능

위의 코드를 살펴보면

1. RemoveX<"xxtestxx">
   xxtestxx에 대해 Str extends `x${infer Rest}`를 평가하는데 xxtestxx는 x로 시작하는 문자열이므로 true가 되고, Rest는 xtestxx가 된다.
   다시 재귀적으로 RemoveX<"xtestxx">가 수행된다.

2. RemoveX<"xtestxx">
   1단계와 같은 이유로 Remove<'testxx'>가 된다.
3. Remove<"testxx">
   이제 좌측에 x가 전부 지워졌으니Str extends `${infer Rest}x`로 평가된다.
   testxx는 x로 끝나는 문자열이므로 true가 되고, Rest는 testx가 된다.
   그러면 RemoveX<"testx">가 수행된다.
4. RemoveX<"testx">
   3단계와 같은 이유로 RemoveX<"test">가 된다.
5. RemoveX<"test">
   Str extends `x${infer Rest}`, Str extends `${infer Rest}x` 둘다 false 이므로 자기 자신이 Str이 된다.
