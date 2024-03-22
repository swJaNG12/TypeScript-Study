# 스터디 4주차

### 📝 4주차 스터디 목차

<br/>

- [2.14 제네릭으로 타입을 함수처럼 사용하자](#214-제네릭으로-타입을-함수처럼-사용하자)

- [2.14.1 제네릭에 제약 걸기](#2141-제네릭에-제약-걸기)

- [2.15 조건문과 비슷한 컨디셔널 타입이 있다](#215-조건문과-비슷한-컨디셔널-타입이-있다)

  - [2.15.1 컨디셔널 타입 분배법칙](#2151-컨디셔널-타입-분배법칙)

- [2.16 함수와 메서드를 타이핑하자](-216-함수와-메서드를-타이핑하자)

- [2.17 같은 이름의 함수를 여러 번 선언 할 수있다](#217-같은-이름의-함수를-여러-번-선언-할-수있다)

- [2.18 콜백 함수의 매개변수는 생략 가능하다](#218-콜백-함수의-매개변수는-생략-가능하다)

 <br/>

## 2.14 제네릭으로 타입을 함수처럼 사용하자

### 타입 간에 중복이 발생 할 때 제네릭을 사용해 중복을 제거할 수 있다.

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

- 위의 코드는 type,race 속성의 타입은 동일한데, name, age 속성타입 만 다르다.
  이럴 땐 제너릭을 사용해 다음과 같이 중복을 제거할 수 있다.

  <br>

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

- 인터페이스 이름 뒤에 <> 로 제너릭을 표기할 수 있다.
  - <> 안엔 `타입 매개변수(Type Parameter)`를 넣으면 된다.
  - 서로 다른 부분은 각각 타입 매개변수 N과 A로 만들어서 넣어준다.
- 선언한 제네릭을 사용할 때는 매개변수에 대응하는 실제 타입 인수를 넣어준다.

<br>

### 클래스와 타입 별칭, 함수도 제네릭을 가질 수 있다.

#### 타입 별칭

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

#### 클래스

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

#### 함수

```ts
// 함수 표현식
const personFactoryE = <N, A>(name: N, age: A) => ({
  type: "human",
  race: "yellow",
  name,
  age,
});

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

### 인터페이스와 타입 간에 교차 사용

```ts
interface IPerson<N, A> {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
}

type TPerson<N, A> = {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
};
type Zero = IPerson<"zero", 28>;
interface Nero extends TPerson<"nero", 32> {}
```

#### 정리

- interface 이름 <타입 매개변수들> {...}
- type 이름<타입 매개변수들> = {...}
- class 이름<타입 매개변수들> {...}
- function 이름 <타입 매개변수들>(...) {...}
- const 함수이름 = <타입 매개변수들>(...) => {...}

<br>

### 객체나 클래스의 메서드에 따로 제네릭을 표기 (제네릭 자리 기억!)

```ts
class Person<N, A> {
  name: N;
  age: A;
  constructor(name: N, age: A) {
    this.name = name;
    this.age = age;
  }
  method<B>(param: B) {}
}

interface IPerson<N, A> {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
  method: <B>(param: B) => void;
}
```

<br>

### 타입 매개변수에는 default값을 사용할 수 있다.

```ts
interface Person<N = string, A = number> {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
  method: <B>(param: B) => void;
}

type Person1 = Person;
// type Person1 = Person<string, number>

// 이렇게 명시적으로 넣어주면 그 타입이 된다.
type Person2 = Person<number>;
// type Person2 = Person<number, number>

type Person3 = Person<number, boolean>;
//type Person3 = Person<number, boolean>
```

### 제네릭 추론

- 타입스크립트는 제네릭에 직접 타입을 넣지 않아도 추론을 통해 타입을 알아 낼 수 있다.

```ts
interface Person<N, A> {
  type: "human";
  race: "yellow";
  name: N;
  age: A;
}
const PersonFactoryE = <N, A = unknown>(name: N, age: A): Person<N, A> => ({
  type: "human",
  race: "yellow",
  name,
  age,
});

const zero = PersonFactoryE("zero", 28);

// const zero: Person<string, number>
//console.log(zero); { type: 'human', race: 'yellow', name: 'zero', age: 28 }
```

- 기본타입으로 unknown을 넣었지만 number이 좀 더 구체적인(좁은 타입)이기 때문에 number로 추론한다.
- 이처럼 추론을 통해 타입을 알아낼 수 있는 경우 직접 <>안 에 타입을 너히 않아도 된다.

<br>

```ts
function values<T>(initial: T[]) {
  return {
    hasValue(value: T) {
      return initial.includes(value);
    },
  };
}

const savedValues = values(["a", "b", "c"]);
console.log(savedValues.hasValue("x")); // false
```

- T[]가 ["a", "b", "c"]로 string[]로 추론되므로 T는 string이 된다.
  - 따라서 value 매개변수도 string이 되고, hasValue('x')를 해도 문제가 되지않는다.

### 유니언으로 추론하기

```ts
function values<T>(initial: readonly T[]) {
  // 매개변수에도 readonly 수식어를 붙임 ->  T가 "a" | "b" | "c"
  return {
    hasValue(value: T) {
      return initial.includes(value);
    },
  };
}

const savedValues = values(["a", "b", "c"] as const); // as const 접미사로 ["a", "b", "c"] 튜플로 만듬 ,
console.log(savedValues.hasValue("x"));
// '"x"' 형식의 인수는 '"a" | "b" | "c"' 형식의 매개 변수에 할당될 수 없습니다.
```

<br>

```ts
function values<const T>(initial: T[]) {
  // 타입 매개변수 앞에 const 수식어를 추가
  return {
    hasValue(value: T) {
      return initial.includes(value);
    },
  };
}

const savedValues = values(["a", "b", "c"]);
savedValues.hasValue("x");
// '"x"' 형식의 인수는 '"a" | "b" | "c"' 형식의 매개 변수에 할당될 수 없습니다.
```

- 타입 매개변수 앞에 const 수식어를 추가하면 타입 매개변수 T를 추론할 때 as const 붙인 값으로 추론된다.
  <br>

## 2.14.1 제네릭에 제약 걸기

- 타입 매개변수에는 제약(constraint)을 사용할 수 있다.

  - extends문법으로 제약을 표시 `(타입 상속을 의미하던 extends와는 사용법이 다름)`

- 밑의 코드를 보면 `A extends number` 이 부분이 A의 타입이 숫자 타입이어야 한다는 뜻이다.

```ts
interface Ex<A extends number, B = string> {
  a: A;
  b: B;
}

type Usecase1 = Ex<string, boolean>; // 조건 충족 xx
// 'string' 형식이 'number' 제약 조건을 만족하지 않습니다.

type Usecase2 = Ex<1, boolean>; // 더 구체적인 타입 입력 가능 oo

type Usecase3 = Ex<number>;
```

- 이러한 점에서 제약은 기본값과 다르다.
- 기본값은 지정한 타입과 완전히 다른 타입을 제공할 수 있고, 제약은 어긋나는 타입은 제공할 수 없다!!

#### 📍 타입 매개변수에 사용하는 extends는 제약을 의미!!

<br>
 
 ### 하나의 타입 매개변수가 다른 타입 매개변수의 제약이 될 수도 있다.

```ts
interface Ex<A, B extends A> {
  // B 타입 매개변수는 A타입이어야 한다.
  a: A;
  b: B;
}

type Usecase1 = Ex<string, number>; // 조건 충족 xx
// 'number' 형식이 'string' 제약 조건을 만족하지 않습니다.

type Usecase2 = Ex<string, "hi">; // 더 구체적인 타입 입력 가능 oo

type Usecase3 = Ex<number, 123>;
```

<br>

### 자주쓰이는 제약들

- 타입 매개변수가 객체,배열,함수,생성자,속성의 키여야 한다는 제약을 나타낸다.

```ts
<T extends object> // 모든 객체
<T extends any[]> // 모든 배열
<T extends (...args:any) => any> // 모든 함수
<T extends abstract new (...args:any) => any> // 생성자 타입
<T extends keyof any> // string | number | symbol
```

<br>

### 제네릭에 제약을 사용할 때 흔히 하는 실수들

1. 타입 매개변수와 제약을 동일하게 생각한다?

#### 예시 1)

```ts
interface V0 {
  value: any;
}

const f = <T extends V0>(): T => {
  return { value: "test" };
};
// '{ value: string; }' 형식은 'T' 형식에 할당할 수 없습니다.
//   '{ value: string; }'은(는) 'T' 형식의 제약 조건에 할당할 수 있지만, 'T'은(는) 'V0' 제약 조건의 다른 하위 형식으로 인스턴스화할 수 있습니다.
```

타입 매개변수 T에 V0 인터페이스라는 제약이 걸려있고, 함수의 반환값 타입이 T로 되어있다.
반환값 타입인 { value: string }도 v0인터페이스와 일치하는데 왜 에러가 발생할까??

바로 타입 매개변수와 제약을 동일하게 생각해서 발생하는 실수!!
`T는 정확히 V0가 아니라 V0에 대입할 수 있는 모든 타입을 의미한다.`
즉 , {value: string ,another: string}도 T가 될 수 있기때문에 {value: string} 는 T 가 아닐 수 있다.

<br>

#### 예시 2)

```ts
function onlyBoolean<T extends boolean>(arg: T = false): T {
  return arg;
}

// 'boolean' 형식은 'T' 형식에 할당할 수 없습니다.
//   'boolean'은(는) 'T' 형식의 제약 조건에 할당할 수 있지만, 'T'은(는) 'boolean' 제약 조건의 다른 하위 형식으로 인스턴스화할 수 있습니다.
```

다음 코드도 T에 boolean이 걸려있고, 함수의 매개변수도 T타입인 상황이다.
그런데 왜 에러가 발생할까??
바로 never때문이다.
never은 모든 타입에 대입할 수 있으므로 never extends boolean은 참이다.
따라서 T가 never일 수도 있으므로 false를 기본값으로 넣는 것은 불가능하다.

#### ` 타입 매개변수가 제약에 대입할 수있는 타입인지 따져봐야한다!!`

<br>
 다음과 같이 제네릭을 쓰지않고 
 원시값 타입만 사용한다면 제약을 걸지 않아도 된다.

```ts
interface V0 {
  value: any;
}

const f = (): V0 => {
  return { value: "test" };
};

function onlyBoolean(arg: true | false = true): true | false {
  return arg;
}
```

## 2.15 조건문과 비슷한 컨디셔널 타입이 있다

조건에 따라 다른 타입이 되는 `컨디셔널 타입(Conditional Type)`에 대해 알아보자

#### 예시 1)

```ts
type A1 = string;
type B1 = A1 extends string ? number : boolean;
// type B1 = number

type A2 = number;
type B2 = A2 extends string ? number : boolean;
// 특정 타입 extends 다른 타입 ? 참일 때 타입 : 거짓일 때 타입
// type B2 = boolean
```

#### 예시 2)

```ts
interface X {
  x: number;
}

interface XY {
  x: number;
  y: number;
}

interface YX extends X {
  y: number;
}

type A = XY extends X ? string : number;
// type A = string;

type B = YX extends X ? string : number;
// type B = string;
```

#### 특정 타입이 다른 타입의 부분집합일 때 참이 된다.

<br>

### 타입 검사할 때 많이 사용된다.

```ts
type Result = "hi" extends string ? true : false;
//type Result = true

type Result2 = [1] extends [string] ? true : false;
//type Result2 = false
```

### never과 함께 사용

```ts
type Start = string | number;
type New = Start extends string | number ? Start[] : never;
// type New = Start[]
let n: New = ["hi"];
n = [123];
```

여기서 type New = Start[]를 하면 되지않을까?
제네릭과 더불어 쓸 때만 never이 의미가 있다.

```ts
type ChooseArray<A> = A extends string ? string[] : never;
type StringArray = ChooseArray<string>;
//type StringArray = string[]
type Never = ChooseArray<number>;
//type Never = never
type Result = never extends string ? true : false;
//type Result = true
```

- never은 모든 타입에 대입할 수 있기때문에 모든 타입을 extends할 수 있다.

<br>

### 매핑된 객체 타입에서 키가 never이면 해당 속성은 제거된다.

- 따라서 컨디셔널 타입과 함께 사용 가능

```ts
type OmitByType<O, T> = {
  [k in keyof O as O[k] extends T ? never : k]: O[k];
};

type Result = OmitByType<
  {
    name: string;
    age: number;
    married: boolean;
    rich: boolean;
  },
  boolean
>;
// type Result = {
//   name: string;
//   age: number;
// };
```

`O[k] extends T ? never : k]`에서 속성의 타입이 T이면 never이 된다.
키가 never이면 해당 속성은 제거되므로 속성의 타입이 T인 속성들은 전부 제거된다.

### 삼항 연산자처럼 중첩

```ts
type ChooseArray<A> = A extends string
  ? string[]
  : A extends boolean
  ? boolean[]
  : never;

type StringArray = ChooseArray<string>;
//type StringArray = string[]
type BooleanArray = ChooseArray<boolean>;
//type BooleanArray = boolean[]
type Never = ChooseArray<number>;
// type Never = never
```

### 인덱스 접근 타입으로 표현(3.9절에서..)

```ts
type A1 = string;
type B1 = A1 extends string ? number : boolean;
type B2 = {
  t: number;
  f: number;
}[A1 extends string ? "t" : "f"];
```

- B1과 B2의 타입은 같다.

<br>

## 2.15.1 컨디셔널 타입 분배법칙

```ts
type Start = string | number;
type Result = Start extends string ? Start[] : never;
//type Result = never
```

- string | number 타입으로부터 string[ ]타입을 얻고 싶은데 string | number가 string을 extends할 수 없기 때문에 이럴 때 아래 코드와 같이 `컨디셔널 타입을 제네릭과 함께 사용`하면 원하는 바를 얻을 수 있다.

```ts
type Start = string | number;
type Result<Key> = Key extends string ? Key[] : never;
let n: Result<Start> = ["hi"];
// let n: string[]
```

- 타입을 제네릭으로 바꾸면 검사하려는 `타입이 제네릭이면서 유니언이면 분배법칙이 실행`된다.
- Result<string | number> 는 Result<string> | Result<number> 이 된다.

#### 따라서 `key extends string | number ? key[ ] : never`를 거치면 `string[ ] | never`이 되고, never이 사라져서 최종적으로 `string[ ] `타입이 된다.

<br>

### boolean 분배법칙

```ts
type Start = string | number | boolean;
type Result<Key> = Key extends string | boolean ? Key[] : never;
// Result<string> | Result<boolean>
let n: Result<Start> = ["hi"];
// let n: string[] | false[] | true[]
n = [true];
```

- boolean 분배법칙이 적용될 때는 boolean을 true | false로 인식하기 때문에
  let n: string[ ] | false[ ] | true[ ]이 된다.

<br>

```ts
type IsString<T> = T extends string ? true : false;
type Result = IsString<"hi" | 3>; // 분배법칙 아니면 조건에 맞지않으므로 false가 나와야 함
// type Result = boolean
```

- IsString<"hi"> | IsString<3>
  > 분배법칙에 따라 ('hi' extends string ? true : false) | (3 extends string ? true : false)
  > 수행하면 true | false 이므로 type Result = boolean이 된다.

<br>

#### 이럴 땐 아래 코드와 같이 분배법칙이 일어나지 않게 해야 한다!

```ts
type IsString<T> = T extends [string] ? true : false;
type Result = IsString<"hi" | 3>;
// type Result = false;
// / ["hi" | 3] 이 [string]을 extends하는지 검사하므로 false가 된다.
```

`배열로 제네릭을 감싸주면 분배법칙이 일어나지 않는다.`

<br>

### never도 분배법칙의 대상이다.

- never가 유니언이라고 생각하는 것이 좋다.

```ts
type R<T> = T extends string ? true : false;
type RR = R<never>;
// type RR = never
```

- 컨디셔널 타입에서 제네릭과 never가 만나면 never이 된다.
  - 따라서 never를 타입 인수로 사용하려면 분배법칙이 일어나는 것을 막아야 한다.

```ts
type IsNever<T> = [T] extends [never] ? true : false;
type T = IsNever<never>; //type T = true
type F = IsNever<"never">; // type F = false
```

#### 제네릭과 컨디셔널 타입을 같이 사용할 때는 조심

```ts
function test<T>(a: T) {
  type R<T> = T extends string ? T : T;
  const b: R<T> = a; //'T' 형식은 'R<T>' 형식에 할당할 수 없습니다
}
```

- 매개변수 a 는 T타입이고 , R<T>타입은 T가 string이든 아니든 T타입이 된다.
  변수 b는 R<T>타입으로 표기했으니 T 타입인 매개변수 a를 대입할 수 있어야하지만, R<T> 타입이 T가 될 거라고 생각하는 것이다.
  타입스크립트는 제네릭이 들어있는 컨디셔널 타입을 판단할 때 값의 판단을 뒤로 미룬다.
  즉, 변수 b에 매개변수 a를 대입할때까지도 타입스크립트는 R<T>가 T라는것을 알지 못한다.
  그래서 T를 R<T>에 대입할 수 없다는 에러가 발생한다.

따라서 판단을 뒤로 미루지 못하도록 배열로 제네릭을 감싸면 된다.

```ts
function test<T extends [T] extends [string] ? string : never>(a: T) {
  type R<T> = [T] extends [string] ? T : T;
  const b: R<T> = a;
}
```

- 타입 매개변수를 선언할 때 바로 < [T] extends [string]>하는 것이 불가능 하므로 한 번 더 컨디셔널 타입으로 묶어 선언한 것이다.
  더 자세히는 2.22에서.. 😵‍💫

<br>

## 2.16 함수와 메서드를 타이핑하자

#### 함수의 매개변수를 타이핑하기위한 문법들

```ts
function example(a: string, b?: number, c = false) {
  // function example(a: string, b?: number, c?: boolean): void
}
example("hi", 123, true);
example("hi", 123);
example("hi");
```

- 매개변수 c는 기본값으로 false가 들어 있고, 타입 추론으로 boolean 타입이 된다.
  여기서 `기본값이 제공된 매개변수는 자동으로 옵셔널`이 된다.

<br>

#### 매개변수는 배열이나 객체처럼 ...(나머지)문법을 사용할 수 있다.

- 배열이나 객체에서는 ...문법은 나머지 속성문법, 함수에선 나머지 매개변수 문법이다.

```ts
function example(a: string, ...b: number[]) {
  //function example(a: string, ...b: number[]): void
}
example("hi", 123, 4, 56);
// b는 [123, 4, 56]이 된다!

function example2(...a: string[], b: number) {}
// rest 매개 변수는 매개 변수 목록 마지막에 있어야 합니다.
```

- 나머지 매개변수 문법을 사용하는 매개변수는 `항상 배열이나 튜플타입`이여야 한다.
- 배열의 전개 문법과는 달리 `매개변수의 마지막 자리에만 위치`해야 한다.

<br>

#### 다음과 같이 매개변수 자리에 전개 문법을 사용할 수 있다.

```ts
//1. 튜플 타입을 전개 -> 임의로 매개변수의 이름이 정해짐
function example3(...args: [number, string, boolean]) {}
//function example3(args_0: number, args_1: string, args_2: boolean): void
example3(1, "3", false);

// 2.  매개변수의 이름을 지정할 수도 있다.
function example4(...args: [a: number, b: string, c: boolean]) {}
//function example4(a: number, b: string, c: boolean): void
```

<br>

#### 구조분해 할당을 적용할 때 타이핑 실수

```ts
function destructuring({ prop: { nested: string } }) {}
```

- 여기서 nested속성을 string타입으로 표기한 것이 아니라 nested속성을 string변수로 이름을 바꾼것이다.
  제대로 고치면 다음과 같은 코드가 된다.

```ts
function destructuring({ prop: { nested } }: { prop: { nested: string } }) {}

destructuring({ prop: { nested: "hi" } });
```

<br>

### 함수 내부에서 this를 사용하는 경우

- 표기하지 않으면 any로 추론되고, 에러가 발생하기 때문에 명시적으로 표기해야 한다.
- `매개변수의 첫 번째 자리`에 this를 표기하면 된다.

```ts
function example3(this: Document, a: string, b: "this") {}
example3("hello", "this");
//void' 형식의 'this' 컨텍스트를 메서드의 'Document' 형식 'this'에 할당할 수 없습니다.t
example3.call(document, "hello", "this");
```

매개변수 자리에 존재하는 this는 실제 매개변수가 아니므로 다른 매개변수들은 한 자리 씩 뒤로 밀려난다.
this에 타입을 표기했다고 해서 this를 쓸 수 있는 것이 아니다.

example3 함수처럼 thus가 Document 타입일 수 없음을 알고 있기때문에 에러를 표시한다.
따라서 call매서드등을 활용해 this의 값을 명시적으로 document로 지정을 해줘야 에러가 사라진다.
<br>

### 메서드에서 this 사용

- 일반적으로 this가 메서드를 갖고 있는 객체 자신으로 추론되므로 this를 명시적으로 타이핑할 필요가 없지만 `this가 바뀔 수 있을 땐 명시적으로 타이핑`해야 한다.

```ts
type Animal = {
  age: number;
  type: "dog";
};

const person = {
  name: "zero",
  age: 28,
  sayName() {
    this; // person객체를 가리킴
    this.name; // person 객체의 name 속성에 접근
  },
  sayAge(this: Animal) {
    // this의 타입을 명확히 하기 위해 Animal타입 지정
    this;
    this.type;
    console.log(this);
  },
};
person.sayAge.bind({ age: 3, type: "dog" });
```

<br>

#### 생성자 함수 대신 클래스를 사용하는 방법을 더 권장한다.(2.20에서 자세히..)

- 자바스크립트에선 함수를 생성자로 사용할 때 new를 붙여서 객체를 만들수 있었다.
- 타입스크립트에선 함수를 생성자로 사용할 수 없기때문에 class를 써야 한다.

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
  sayName() {
    console.log(this.name);
  }
}

const zero = new Person("zero", 28, false);
```

<br>

## 2.17 같은 이름의 함수를 여러 번 선언 할 수 있다

자바스크립트에서는 함수의 매개변수에 개수와 타입이 고정되어 있지않아 마음대로 값과 개수를 바꿔서 넣을 수 있었다.
하지만 타입스크립트에선 매개변수에 어떤 타입과 값이 들어올지 `미리 타입 선언`을 해야한다.

다음과 같이 두 문자열을 합치거나 두 숫자를 더하는 add함수를 만들어보자.

```ts
function add(x: string | number, y: string | number): string | number {
  return x + y;
  //'+' 연산자를 'string | number' 및 'string | number' 형식에 적용할 수 없습니다
}
```

매개변수 x와 y를 모두 string | number로 타이핑했기 때문에 x가 문자열이면서 y가 숫자일 수 있게 된다. 즉 x + y를 할 수 없다는 에러가 발생한다.
`이럴 때 필요한 기법이 오버로딩`이다.

## 오버로딩 (overloading)

타입을 미리 여러 개 타이핑해두는 기법이다.

```ts
function add(x: number, y: number): number; // 타입만 선언
function add(x: string, y: string): string; // 타입만 선언
function add(x: any, y: any) {
  // 구현 , 여기서 any타입이 되는게 아니라 오버로딩한 타입의 조합으로 된다.
  //({x : number, y : number}),({x : string, y : string})
  return x + y;
}

console.log(add(1, 2)); //3
console.log(add("1", "2")); //12
console.log(add("1", 2)); // 에러 ,오버로드 1/2('(x: number, y: number): number')에서 다음 오류가 발생했습니다.
```

<br>

### 오버로딩을 선언하는 순서도 타입 추론에 영향을 준다.

- 여러 오버로딩에 동시에 해당될 수 있는 경우 제일 먼저 선언된 오버로딩에 해당된다.

```ts
function example(param: string): string; // 해당  , 제일 먼저 선언된 오버로딩에 해당!!
function example(param: string | null): number; // 해당
function example(param: string | null): number | string {
  if (param) {
    return "string";
  } else return 123;
}

const result = example("what"); //const result: string
```

- 순서를 바꿔서 출력해보면 result는 number 타입으로 바뀐다.
  다만 실제로는 result가 string이므로 실행할 때 에러가 발생한다.

```ts
function example(param: string | null): number; // 통과
function example(param: string): string; // 통과
function example(param: string | null): number | string {
  if (param) {
    return "string";
  } else {
    return 123;
  }
}

const result = example("what"); //const result: number
```

<br>

### 인터페이스 오버로딩

```ts
interface Add {
  (x: number, y: number): number;
  (x: string, y: string): string;
}

const add: Add = (x: any, y: any) => x + y;
console.log(add(1, 2)); //3
console.log(add("1", 2)); // 에러 ,오버로드 1/2('(x: number, y: number): number')에서 다음 오류가 발생했습니다.
```

<br>

### 타입 별칭 오버로딩

```ts
type Add1 = {
  (x: number, y: number): number;
};

type Add2 = {
  (x: string, y: string): string;
};
type Add = Add1 & Add2;
const add: Add = (x: any, y: any) => x + y;
```

<br>

### 주의할 점

```ts
function a(param: string): void;
function a(param: number): void;
function a(param: string | number) {}

function errorA(param: string | number) {
  a(param); //에러 ,오버로드 1/2('(param: string): void')에서 다음 오류가 발생했습니다.
  // 'string | number' 형식의 인수는 'string' 형식의 매개 변수에 할당될 수 없습니다.
}

function b(p1: string): void;
function b(p1: string, p2: number): void;
function b(p1: string, p2?: number) {}

function errorB(p1: string, p2: number | undefined) {
  b(p1, p2); //에러 ,'number | undefined' 형식의 인수는 'number' 형식의 매개 변수에 할당될 수 없습니다.
}
```

- 다음 순서대로 오버로딩을 검사한다.

  - `a(param)의 경우` : errorA 의 param이 string | number 인데 a의 param은 string이나 (첫 번째 오버로딩)number이라서 (두 번째 오버로딩)에러가 발생한다.
  - `b(p1,p2)의 경우 `: errorB의 p2가 number | undefined 인데 b의 p2는 없거나(첫 번째 오버로딩) number라서 (두 번째 오버로딩)에러가 발생한다.

다음과 같이 오버로딩을 제거하면 에러 메세지는 사라진다.

```ts
function a(param: string | number) {}

function errorA(param: string | number) {
  a(param);
}

function b(p1: string, p2?: number) {}

function errorB(p1: string, p2: number | undefined) {
  b(p1, p2);
}
```

`즉 유니온이나 옵셔널 매개변수를 활용할 수 있는 경우는 오버로딩을 쓰지 않는 것이 좋다.`

<br>

## 2.18 콜백 함수의 매개변수는 생략 가능하다

이 절에서는 함수가 콜백 함수로 사용될 때 발생하는 타입스크립트의 특징에 대해 알아보자

```ts
function example(callback: (err: Error, result: string) => void) {}
example((e, r) => {});
example(() => {});
example(() => true);
```

보통 함수의 매개변수에 타입을 표기하지 않으면 에러가 발생하지만 , ` 콜백 함수의 매개변수에는 타입을 표기하지 않아도 된다`.
example함수를 선언 할 때 `callback: (err: Error, result: string) => void`로
콜백 함수에 대한 타입을 표기했기 때문에 `(e, r) => {}`함수는 callback 매개변수의 타입으로 추론된다.
따하서 매개변수 e는 Error , r은 string 타입이 된다.
이런 현상을 `문맥적 추론 (Contextual Typing)`이라고 부른다.

`콜백 함수의 매개변수는 함수를 호출할 때 사용하지 않아도 된다.`
`example(() => {})`처럼 콜백 함수에 error 매개변수와 result 매개변수 자리가 없어도 호출이 가능하다.

<br>

예시로 배열의 forEach 메서드를 생각해보면 쉽게 알수 있다.

```ts
[1, 2, 3].forEach((item, index, arr) => {
  console.log(item, index, arr);
});
[1, 2, 3].forEach((item, index) => {});
[1, 2, 3].forEach((item) => item);
```

forEach 메서드의 콜백 함수는 callbackfn 타입이다. 콜백 함수의 매개변수에 타입을 표기할 필요가 없고, 매개변수도 전부 옵셔널이다.
옵셔널로 굳이 만들 필요가 없다.
callbackfn의 반환값 타입이 void라서 반환값이 없어도 되고 있어도 된다.
