# 스터디 4주차

### 📝 4주차 스터디 목차

<br/>

- [2.14 제너릭으로 타입을 함수처럼 사용하자](#214-제너릭으로-타입을-함수처럼-사용하자)

- [2.14.1 제너릭에 제약 걸기](#2141-제너릭에-제약-걸기)

- [2.15 조건문과 비슷한 컨디셔널 타입이 있다](#215-조건문과-비슷한-컨디셔널-타입이-있다)

  - [2.15.1 컨디셔널 타입 분배법칙](#2151-컨디셔널-타입-분배법칙)

- [2.16 함수와 메서드를 타이핑하자](-216-함수와-메서드를-타이핑하자)

- [2.17 같은 이름의 함수를 여러 번 선언 할 수있다](#217-같은-이름의-함수를-여러-번-선언-할-수있다)

- [2.18 콜백 함수의 매개변수는 생략 가능하다](#218-콜백-함수의-매개변수는-생략-가능하다)

 <br/>

## 2.14 제너릭으로 타입을 함수처럼 사용하자

### 타입 간에 중복이 발생 할 때 제너릭을 사용해 중복을 제거할 수 있다.

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

## 2.14.1 제너릭에 제약 걸기

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

## 2.15.1 컨디셔널 타입 분배법칙

## 2.16 함수와 메서드를 타이핑하자

## 2.17 같은 이름의 함수를 여러 번 선언 할 수 있다

## 2.18 콜백 함수의 매개변수는 생략 가능하다
