# 스터디 3주차

### 📝 3주차 스터디 목차

 <br/>

- [2.9 인터페이스로 객체를 타이핑하자](#29-인터페이스로-객체를-타이핑하자)
  - [2.9.1 인터페이스 선언 병합](#291-인터페이스-선언-병합)
  - [2.9.2 네임스페이스](#292-네임스페이스)
- [2.10 객체의 속성과 메서드에 적용되는 특징을 알자](#210-객체의-속성과-메서드에-적용되는-특징을-알자)
  - [2.10.1 인덱스 접근 타입](#2101-인덱스-접근-타입)
  - [2.10.2 매핑된 객체 타입](#2102-매핑된-객체-타입)
- [2.11 타입을 집합으로 생각하자(유니언,인터섹션)](#211-타입을-집합으로-생각하자유니언인터섹션)
- [2.12 타입도 상속이 가능하다](#212-타입도-상속이-가능하다)
- [2.13 객체 간에 대입할 수 있는지 확인하는 법을 배우자](#213-객체-간에-대입할-수-있는지-확인하는-법을-배우자)
  - [2.13.1 구조적 타이핑](#2131-구조적-타이핑)

<br/>

## 2.9 인터페이스로 객체를 타이핑하자

<br/>

#### 배열 타이핑

```ts
interface Arr {
  length: number; // 인덱스 시그니처 이 전에 표기했으므로 number이 아니어도 된다.
  [key: number]: string; // 이 객체는 length를 제외한 속성 키가 전부 number이라는 뜻 -> 인덱스 시그니처(Index Signature) 문법
}
const arr: Arr = ["3", "5", "6"];
```

- 배열의 타이핑을 위해 속성 키를 number로 하는 것을 허용한다.
- 따라서 타입스크립트에서 속성 키로 가능한 타입은 string고ㅓ symbol, number이 된다.
  -number은 자바스크립트에서 string으로 변환

#### 함수 타이핑

```ts
interface Func {
  (x: number, y: number): number;
} //

const add: Func = (x, y) => x + y;
```

<br/>

#### 속성이 없는 인터페이스

```ts
interface NoProp {}
const obj: NoProp = {
  why: "에러 안 남",
};
const what: NoProp = "이게 되네?";
const omg: NoProp = null; // 'null' 형식은 'NoProp' 형식에 할당할 수 없습니다.
```

- {} 타입과 비슷하게 속성이 없는 인터페이스도 null과 undefined를 제외한 모든 타입을 의미한다.
- 따라서 null 과 undefined를 제외한 값을 대입할 수 있다.
- 이렇게 만든 이유?? 📌
- 일반적으로 빈 객체로 타입을 선언할 일이 없기때문이다.
- 빈 객체 타입을 특별하게 null과 undefined를 제외한 모든 값을 가리키는 타입으로 만들었다.

<br/>

### 2.9.1 인터페이스 선언 병합

```ts
interface Merge {
  one: string;
}
interface Merge {
  two: number;
}
const example: Merge = {
  one: "1",
  two: 2,
};
```

- 선언 병합 (declaration merging) : 같은 이름으로 여러 인터페이스를 선언하고, 인터페이스끼리 서로 합쳐서 쓸 수 있다.
- 이러한 기능을 만들어둔 이유 ?

  - 다른 라이브러리의 객체를 수정하는 경우에 이렇게 객체를 수정하면 타입스크립트에서 정의한 객체 타입이 달라져 에러가 발생하는 경우를 대비해 타입스크립트에서는 그 객체에 대한 타입을 수정할 수 있는 기능이 필요했고, 이것이 인터펲이스가 합쳐진 이유이다.
  - 다른 사람이 수정해도 되는 객체의 타입을 인터페이스로 선언해두면 언제든 같은 이름의 인터페이스를 만들어 타입을 수정할 수 있다.

#### 다만 인터페이스 간에 속성이 겹치는데 타입이 다를 경우는 에러가 발생한다.

- 속성이 같은 경우 타입도 같아야 한다.

```ts
interface Merge {
  one: string;
}
interface Merge {
  one: number; //  'one' 속성이 'string' 형식이어야 하는데 여기에는 'number' 형식이 있습니다.
}
```

<br/>

### 2.9.2 네임스페이스

<br>

- 인터페이스 병합의 단점?
  - 의도치않게 다름 사람이 만든 인터페이스와 내 인터페이스의 이름이 같아서 겹치는 경우 인터페이스가 병합되어 원하지 않은 결과를 낳게된다.
    이를 대비해 네임스페이스로 선언하면된다.

#### 네임스페이스 선언방법

1. 내부 타입을 사용할 때 export로 해야함

```ts
namespace Example {
  export interface Inner {
    test: string;
  }
  export type test2 = number;
}
const ex1: Example.Inner = {
  test: "hello",
};

const ex2: Example.test2 = 123;
```

2.  네임스페이스를 중첩할 때 내부 네임스페이스를 export해 사용

```ts
namespace Example {
  export namespace Outer {
    export interface Inner {
      test: string;
    }
    export type test2 = number;
  }
}
const ex1: Example.Outer.Inner = {
  test: "hello",
};

const ex2: Example.Outer.test2 = 123;
```

3.  네임스페이스 자체를 자바스크립트 값으로 사용

```ts
namespace Ex {
  export const a = "real";
}

const a = Ex; // { a: 'real' }
const b = Ex.a; // real
const x = Ex["a"]; // real
```

- 한 가지 조심할 점은, 네임스페이스 내부의 값은 []를 사용해 접근할 수 있지만, 내부타입은 []로 접근할 수 없다.

```ts
namespace Example {
  export type test2 = number;
}

const x3: Example["test2"] = 123; // 'Example' 네임스페이스를 형식으로 사용할 수 없습니다.
```

- 내부에 같은 이름의 인터페이스가 있다면 합쳐지고, 내부에 같은 이름의 타입 별칭이 있다면 에러 발생

```ts
namespace Example {
  export interface Inner {
    test: string;
  }
  export type test2 = number; //'test2' 식별자가 중복되었습니다.
}

namespace Example {
  export interface Inner {
    test1: boolean;
  }
  export type test2 = number; // 'test2' 식별자가 중복되었습니다.
}

// 합쳐짐
const ex1: Example.Inner = {
  test: "hello world",
  test1: true,
};
```

- 네임스페이스도 병합되는 특성이 있으므로 다른 사람이 이름이 같은 네임스페이스를 만든다면 원치않게 합쳐지는 문제가 발생할 수 있다.
  - 이를 방지하기위해 모듈 파일이 있다. (5.3절)

<br/>

## 2.10 객체의 속성과 메서드에 적용되는 특징을 알자

<br/>

#### 객체의 속성에는 옵셔널(optional)이나 readonly 수식어 사용 가능

```ts
interface Example {
  hello: string;
  world?: string; // string | undefined
  readonly wow: boolean;
  readonly multiple?: symbol; // symbol | undefined
}

const example: Example = {
  hello: "hi",
  world: undefined,
  wow: false,
};

example.wow = true; // 읽기 전용 속성이므로 'wow'에 할당할 수 없습니다
```

<br/>

#### 객체 리터널을 대입했냐, 변수를 대입했냐에 따라 타입 검사 방식이 달라지는 경우

```ts
interface Example {
  hello: string;
}

const example: Example = {
  // example에는 객체 리터럴을 대입
  hello: "hi",
  why: "나만 에러야", // 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Example' 형식에 'why'이(가) 없습니다.
};

const obj = {
  hello: "hi",
  why: "나는 에러 아니야",
};
const example2: Example = obj; // example2는  obj변수를 대입
//const obj: {
//    hello: string;
//    why: string;
// }
```

<br/>

#### 객체 리터럴을 대입할 때와 변수를 대입할 때 타입스크립트는 다르게 처리하는 경우

- 객체 리터럴을 대입하면 `잉여 속성 검사(Excess Property Checking)`가 실행된다.
  - 잉여 속성 검사는 타입 선언에서 선언하지 않는 속성을 사용할 때 에러를 표시하는 것을 의미한다.

```ts
interface Money {
  amount: number;
  unit: string;
}

const money = { amount: 1000, unit: "wow", error: "에러 아님" };

function addMoney(money1: Money, money2: Money): Money {
  return {
    amount: money1.amount + money2.amount,
    unit: "won",
  };
}

addMoney(money, {
  // 인수자리에 변수로 값을 대입하면 에러가 xx
  amount: 3000, // 객체 리터럴을 대입하는 경우 에러 발생 oo
  unit: "money",
  error: "에러", // 객체 리터럴은 알려진 속성만 지정할 수 있으며 'Money' 형식에 'error'이(가) 없습니다.
});
```

<br/>

#### 객체에서 전개 문법과 나머지 속성을 사용할 수 있다.

```ts
const {
  prop: { nested },
}: {
  prop: {
    nested: string;
  };
} = {
  prop: { nested: "hi" },
};

console.log(nested); // hi
```

<br/>

### 2.10.1 인덱스 접근 타입

- 특정 속성의 타입을 별도 타입으로 만들고 싶을 때

  - 특정한 속성에 연동되게 타입을 만들고 싶다면?

```ts
type Animal = {
  name: string;
};
// 이러한 접근 방식을 인덱스 접근 타입(Indexed Access Type)이라 부른다.
type N1 = Animal["name"]; // type N1 = string
type N2 = Animal["name"];
type N3 = Animal.name; // 에러 -> 객체.속성은 사용할 수 없다.
//'Animal'이(가) 네임스페이스가 아니라 형식이므로 'Animal.name'에 액세스할 수 없습니다. 'Animal'에서 'Animal["name"]'과(와) 함께 'name' 속성의 형식을 검색하려고 했나요?
```

<br>

```ts
const obj = {
  hello: "world",
  name: "zero",
  age: 28,
};

type Keys = keyof typeof obj;
// type Keys = "hello" | "name" | "age"

type Value = (typeof obj)[Keys];
// type Value = string | number
```

- 키의 타입은 'hello' | 'name' | 'age' |
- 값의 타입은 string | number
  - obj 객체가 변경이 가능하기 때문에 'world' | 'zero' | 28가 아님
  - as const를 붙이면 값의 타입은 'world' | 'zero' | 28
- keyof 연산자과 인덱스 접근 타입을 활용해 키의 타입과 값을 구할 수 있다.
  - 키의 타입 : keyof객체\_타입
  - 값의 타입 : 객체*타입[키의*타입]
- obj의 값이 타입 자리에 바로 쓸수 없기때문에 typeof연산자를 붙여 타입으로 만듬
- Keys 타입에는 obj의 속성 키 타입이 들어있다.
  - typeod obj가 객체 타입이고, keys가 키의 타입이므로 Value는 값의 타입이 된다.

<br/>

#### keyof의 특성

```ts
type Keys = keyof any;
// type Keys = string | number | symbol;

type ArrayKeys = keyof [1, 2, 3];
let a: ArrayKeys = "lastIndexOf";
a = "length";
a = "2";
a = "3"; // '"3"' 형식은 'keyof [1, 2, 3]' 형식에 할당할 수 없습니다.
a = 3; // 여기서 숫자 3이 포함되는 이유는 모든 number은 배열의 키로 허용되기 때문이다.
```

- 객체의 키는 syting과 symbol만 되는 것이 원칙이지만 타입스크립트에서는 배열을 위해 number타입의 키를 허용한다.
- 배열의 keyof를 적용하면 'number | 배열*속성*이름*유니언 | 배열*인덱스*문자열*유니언'이 된다.
- 배열 속성 이름은 배열에 length, forEach, lastIndexOf 등을 의미하고, 배열인덱스 문자열은 [1,2,3]의 인덱스인 '0' | '1' | '2'를 의미한다.

<br/>

#### 튜플과 배열에서 인덱스 접근 타입을 사용할 수 있다.

```ts
type Arr = [1, 3, 4];
type First = Arr[0];
// type First = 1

type Length = Arr["length"];
// type Length = 3

type Arr2 = (string | boolean)[];

type El = Arr2[number];

//type El = string | boolean
```

- 배열에는 숫자 키가 허용되므로 Arr[0]과 Arr['0'] 모두 유효한 문법이다.
- El 타입처럼 배열[number]인덱스 접근 타입으로 배열 요소들의 타입을 모두 가져올 수 있다.

<br/>

#### 인덱스 접근 타입을 활용해 특정 키들의 값 타입을 추릴 수 있다.

```ts
const obj = {
  hello: "world",
  name: "zero",
  age: 28,
};

type Value = (typeof obj)["hello" | "name"];
// type Value = string
```

- hello와 name 속성의 값은 둘 다 string이므로 Values도 string이 된다.

<br/>

#### 객체의 메서드를 선언할 때 세 가지 방식을 사용할 수 있다. (2.19절)

```ts
interface Example {
  a(): void;
  b: () => void;
  c: {
    (): void;
  };
}
```

- 메서드(매개변수) : 반환값
- 메서드 : (매개변수) => 반환값
- 메서드 : {(매개변수): 반환값}

<br>

### 2.10.2 매핑된 객체 타입

```ts
type HelloAndHi = {
  [key: "hello" | "hi"]: string;
};
// key -> 인덱스 시그니처 매개 변수 형식은 리터럴 유형이나 제네릭 형식일 수 없습니다. 대신 매핑된 개체 형식을 사용하세요
```

- 인덱스 시그니처에서 사용할 수있는 타입은 string , number, symbol, 템플릿 리터럴 타입과 유니언뿐이다.
- 에러메세지에서 나온 `매핑된 객채타입(Mapping Object Type)`이란?

  - 기존의 다른 타입으로부터 새로운 객체 속성을 만들어내는 타입을 의미한다.
  - 인터페이스에서는 쓰지 못하고 타입 별칭에서만 사용할 수 있다.

- 아래 예시처럼 `in 연산자`를 사용해 인덱스 시그니처가 표현하지 못하는 타입을 표현할 수 있다.

```ts
type HelloAndHi = {
  [key in "hello" | "hi"]: string;
};

// type HelloAndHi = { -> 순서대로 평가되어 객체의 속성이 된다.
//   hello: string;
//   hi: string;
// };
```

- in 연산자 오른쪽에는 유니언 타입이 와야함!

```ts
interface Original {
  name: string;
  age: number;
  married: boolean;
}

type Copy = {
  [key in keyof Original]: Original[key];
};

// type Copy = {
//   name: string; ->  Original[name];
//   age: number; -> Original[age];
//   married: boolean; -> Original[married]
// };
```

- in 연산자 오른쪽에는 유니언 타입이 와야하므로 keyof연산자를 사용해 Original의 속성 이름만 가져옴(name | age | married)

<br/>

#### 튜플과 배열도 객체이므로 매핑된 객체타입을 적용할 수 있다.

```ts
type Tuple = [1, 2, 3];
type CopyTuple = {
  [key in keyof Tuple]: Tuple[key];
};

// type CopyTuple = {
//     [x: number]: 3 | 1 | 2;
//     0: 1;
//     1: 2;
//     2: 3;
//     length: 3;
//     toString: () => string;
//     toLocaleString: () => string;
//     pop: () => 3 | 1 | 2 | undefined;
//     push: (...items: (3 | 1 | 2)[]) => number;
//     concat: {
//         (...items: ConcatArray<3 | 1 | 2>[]): (3 | ... 1 more ... | 2)[];
//         (...items: (3 | ... 2 more ... | ConcatArray<...>)[]): (3 | ... 1 more ... | 2)[];
//     };
//     ... 27 more ...;
//     readonly [Symbol.unscopables]: {
//         ...;
//     };
// }
```

```ts
type Tuple = [1, 2, 3];
type CopyTuple = {
  [key in keyof Tuple]: Tuple[key];
};

const copyTuple: CopyTuple = [1, 2, 3];

type Arr = number[];
type CopyArr = {
  [key in keyof Arr]: Arr[key];
};
// type CopyArr = {
//     [x: number]: number;
//     length: number;
//     toString: () => string;
//     toLocaleString: () => string;
//     pop: () => number | undefined;
//     push: (...items: number[]) => number;
//     concat: {
//         (...items: ConcatArray<number>[]): number[];
//         (...items: (number | ConcatArray<...>)[]): number[];
//     };
//      ... 27 more ...;
//     readonly [Symbol.unscopables]: {
//         ...;
//     };
// }
const copyArr: CopyArr = [1, 3, 4];
```

- CopyTuple 과 CopyArr는 객체 타입이지만 배열을 값으러 받을수 있다.
  - 이유? 구조적 타이핑때문 (2.13절)
  - 다른 타입으로부터 값을 가져오면서 수식어를 붙일 수 있다.(readonly, 옵셔널)
  - 반대로 제거할 수도 있다. (수식어 앞에 -를 붙이면 해당 수식어가 제거된다.)

```ts
interface Original {
  readonly name?: string;
  readonly age?: number;
  readonly married?: boolean;
}

type Copy = {
  -readonly [key in keyof Original]-?: Original[key];
};

//type Copy = {
//     name: string;
//     age: number;
//     married: boolean;
// }
```

- Copy는 -readOnly와 -?를 사용해 Original로 부터 readOnly와 ? 수식어를 모두 제거함

##### 다음과 같이 속성 이름도 바꿀 수 있다.

- 다음 예시에서 as 예약어를 사용해 기존 이름에서 첫번째 문자만 대문자로 바꿈

```ts
interface Original {
  name: string;
  age: number;
  married: boolean;
}

type Copy = {
  [key in keyof Original as Capitalize<key>]: Original[key];
};

// type Copy = {
//   Name: string;
//   Age: number;
//   Married: boolean;
// };
```

<br>

## 2.11 타입을 집합으로 생각하자(유니언,인터섹션)

#### 합집합 |

```ts
let strOrNum: string | number = "hello";
strOrNum = 123;
```

- string | number 타입은 string과 number의 합집합이라고 생각할 수 있다.
- string & number 겹치는 원소가 존재하지 않기 때문에 공집합이라고 부름 (never)

```ts
type nev = string & number;
//type nev = never
```

#### 교집합 &

- & : 인터섹션(intersection) 연산자

#### 전체집합 unknown

#### 공집합 never

-> 좁은 타입(never)을 넓은 타입(unknown)에 대입할 수 있다.
반대로 넓은 타입(unknown)은 좁은 타입(never)에 대입할 수 없다.
`항상 좁른 타입에서 넓은 타입으로 대입해야 한다.` (대입 관계표 참고)

- any타입은 집합 관계에서 무시하므로 &,| 연산을 하지 않는 것이 좋음
  <br>

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

type G = never & {};
// type G = never
```

- F 와 G 처럼 unknown 과의 | 연산은 무조건 unknown,
  never과의 & 연산은 무조건 never이 된다.
  - 전체집합과의 합집합은 항상 전체집합이고, 공집합과의 교집합은 항상 공집합.

<br/>

#### null/undefined를 제외한 원시 자료형과 비어 있지 않은 객체를 & 연산할 땐 never가 되지 않는다.

```ts
type H = { a: "b" } & number;
// type H = { a: "b" } & number;

type I = null & { a: "b" };
// type I = never
type J = {} & string;
// type J = {} & string
```

- 객체 타입과 원시값이 겹치는 부분이 없는데 never이 아닌 이유? (2.28에서)

  - 브랜딩 기법? 📌

- 타입 I는 null과 객체의 교집합이라 never
- J는 {}가 null과 undefined를 제외한 모든 값을 의미하는 타입이므로 string과 교집합을 구하면 string이다.

<br/>

## 2.12 타입도 상속이 가능하다

#### 타입스트립트에서 객체 타입간에 상속하는 방법

#### 인터페이스

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

interface Cat extends Animal {
  meow(): void;
}
// extends 예약어를 사용해 기존 타입 상속가능
```

#### 타입별칭

##### & 연산자를 사용했을 때

```ts
interface Animal = {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

interface Cat extends Animal {
  meow(): void;
}
// & 연산자를 사용해 상속을 나타냄
```

<br/>

##### | 연산자를 사용했을 때

- | 연산자를 사용하면 Cat 타입은 Animal 타입이거나 { meow(): void } 타입이기 때문에 name 속성이 없으므로 에러가 발생한다.

```ts
type Animal = {
  name: string;
};

type Dog =
  | Animal
  | {
      bark(): void;
    };

type Cat =
  | Animal
  | {
      meow(): void;
    };
type Name = Cat["name"];
// 'Cat' 형식에 'name' 속성이 없습니다
```

<br/>

#### 타입 별칭과 인터페이스

1. 타입 별칭이 인터페이스를 상속할 수 있고, 인터페이스가 타입 별칭을 상속할 수 있다.

```ts
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
```

2. 한 번에 여러 타입을 상속할 수 도 있다.

```ts
type Animal = {
  name: string;
};

interface Dog extends Animal {
  bark(): void;
}

interface Cat extends Animal {
  meow(): void;
}

interface DogCat extends Dog, Cat {}
type meow = DogCat["meow"];
type bark = DogCat["bark"];
```

- DogCat인터페이스는 Dog와 Cat을 둘 다 상속하므로 meow,bark메서드를 사용할 수 있다.
  <br>

3. 다음과 같이 상속할 때 부모 속성의 타입을 변경할 수도 있다.

```ts
interface Merge {
  one: string;
  two: string;
}
interface Merge2 extends Merge {
  one: "h" | "w";
  two: "123";
}
```

4. 다른 타입으로 변경하면 에러 발생

```ts
interface Merge {
  one: string;
  two: string;
}
interface Merge2 extends Merge {
  one: "h" | "w";
  two: 123; // 에러
}

// Merge2' 인터페이스가 'Merge' 인터페이스를 잘못 확장합니다.
// 'two' 속성의 형식이 호환되지 않습니다.
// 'number' 형식은 'string' 형식에 할당할 수 없습니다
```

- 부모의 속성 타입을 바꾸더라도 부모에 대입할 수 있는 타입으로 바꾸어야함
  - "h" | "w" 는 string으로 대입, '123'도 string으로 대입할 수 있으므로,123은 대입할 수 없다. 판단하는 방법은 ?

<br>

## 2.13 객체 간에 대입할 수 있는지 확인하는 법을 배우자

- 변수를 대입할 때 객체 간에 대입할 수 있는 여부를 따져봐야한다.

```ts
interface A {
  // B타입 보다 더 넓은 타입
  name: string;
}

interface B {
  // A타입보다 좁은 타입, 구체적인 타입
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
const bTobA: A = bObj;
const aToB: B = aObj; // aToB 에러
//'age' 속성이 '{ name: string; }' 형식에 없지만 'B' 형식에서 필수입니다.
const bTob: B = bObj;
```

- A 타입에 B 타입 객체를 대입하는 건 가능하지만 B타입에 A타입 객체를 대입하는 것은 불가능 하다.

```ts
interface A {
  name: string;
}

interface B {
  age: number;
}
function test(): A | B {
  if (Math.random() > 0.5) {
    return {
      age: 28,
    };
  }
  return {
    name: "zero",
  };
}
// A & B는 A와 B의 속성을 모두 가져야 하기 때문에 에러
const target1: A & B = test(); // target1 에러
//'A | B' 형식은 'A & B' 형식에 할당할 수 없습니다.
// 'A' 형식은 'A & B' 형식에 할당할 수 없습니다.
//   'age' 속성이 'A' 형식에 없지만 'B' 형식에서 필수입니다.
const target2: A = test(); // target2에러
// 'A | B' 형식은 'A' 형식에 할당할 수 없습니다.
//  'name' 속성이 'B' 형식에 없지만 'A' 형식에서 필수입니다.

const target3: B = test(); // target3에러
//'A | B' 형식은 'B' 형식에 할당할 수 없습니다.
// 'age' 속성이 'A' 형식에 없지만 'B' 형식에서 필수입니다.
```

- test 타입에는 name과 age속성이 꼭 있어야 하지만 A타입에는 name밖에 없기 때문에 오류
- 합집합은 각각의 집합이나 교집합보다 넓기 때문에 대입할 수 없다.
  - 넓은 타입에서 좁은 타입에 대입할 수 없다.

<br/>

#### 튜플은 배열보다 좁은 타입

```ts
let a: ["hi", "readonly"] = ["hi", "readonly"];

let b: string[] = ["hi", "normal"];

a = b;
//string[]' 형식은 '["hi", "readonly"]' 형식에 할당할 수 없습니다.
//  대상에 2개 요소가 필요하지만, 소스에 더 적게 있을 수 있습니다.
b = a;
```

- 따라서 튜플은 배열에 대입할 수 있으나, 배열은 튜플에 대입할 수 없다.

<br>

#### readonly 수식어가 붙은 배열은 더 넓은 타입이 된다.

```ts
let a: readonly string[] = ["hi", "readonly"];
let b: string[] = ["hi", "normal"];

a = b;
b = a; // b에러

//'readonly string[]' 형식은 'readonly'이며 변경 가능한 형식 'string[]'에 할당할 수 없습니다.
```

- string[]이 readonly string[]보다 더 좁은 타입이므로 b를 a에 대입할 수 있고, 반대는 불가는하다.

<br/>

#### readonly 튜플과 일반 배열을 서로 대입

```ts
let a: readonly ["hi", "readonly"] = ["hi", "readonly"];
let b: string[] = ["hi", "normal"];

a = b; // 에러
//'string[]' 형식은 'readonly ["hi", "readonly"]' 형식에 할당할 수 없습니다.
// 대상에 2개 요소가 필요하지만, 소스에 더 적게 있을 수 있습니다.
b = a; // 에러
// 'readonly ["hi", "readonly"]' 형식은 'readonly'이며 변경 가능한 형식 'string[]'에 할당할 수 없습니다.
```

- 배열을 튜플에 대입하려는 a = b의 경우, 배열이 튜플보다 넓은 타입이므로 에러
- 튜플을 배열에 대입하려믄 b = a의 경우, 튜플이 배열보다 좁은 타입인 것은 맞으나 readonly 수식어가 붙었기 때문에 넓은 타입으로 간주 -> 대입 x

<br/>

#### 두 객체가 있고 속성은 동일할 때

- 속성이 옵셔널인 객체가 옵셔널이지 않은 객체보다 더 넒은 타입이다.

```ts
type Optional = {
  a?: string;
  b?: string;
};

type Mandatory = {
  a: string;
  b: string;
};

const o: Optional = {
  a: "hello",
};
const m: Mandatory = {
  a: "hello",
  b: "world",
};

const o2: Optional = m;
const m2: Mandatory = o; // 에러
//'Optional' 형식은 'Mandatory' 형식에 할당할 수 없습니다.
// 'a' 속성의 형식이 호환되지 않습니다.
//  'string | undefined' 형식은 'string' 형식에 할당할 수 없습니다.
//   'undefined' 형식은 'string' 형식에 할당할 수 없습니다.
```

- 옵셔널이란 기존 타입에 undefined가 유니언이 된 것과 같기때문에 `기존 타입 | undefined`가 기존타입보다 `넓은 타입`이므로 옵셔널인 객체가 더 넓은 타입이다.

- 아래 예시와 같이 배열과 다르게 객체에선 속성에 readonly를 붙여서 서로 대입 가능하다.

```ts
type ReadOnly = {
  readonly a: string;
  readonly b: string;
};

type Mandatory = {
  a: string;
  b: string;
};

const o: ReadOnly = {
  a: "hi",
  b: "world",
};
const m: Mandatory = {
  a: "hello",
  b: "world",
};

const o2: ReadOnly = m;
const m2: Mandatory = o;
```

<br>

### 2.13.1 구조적 타이핑

- 타입스크립트에서는 모든 속성이 동일하면 객체 타입의 이름이 다르더라도 동일한 타입으로 취급한다.
- 구조가 같으면 같은 객체로 인식하는 것을 `구조적 타이핑(structural typing)` 이라 부른다.

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

<br>

```ts
interface A {
  // B타입 보다 더 넓은 타입
  name: string;
}

interface B {
  // A타입보다 좁은 타입, 구체적인 타입
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
const bTobA: A = bObj;
const aToB: B = aObj; // aToB 에러
//'age' 속성이 '{ name: string; }' 형식에 없지만 'B' 형식에서 필수입니다.
const bTob: B = bObj;
```

- B 인테페이스는 A 인테페이스가 존재하는 속성을 갖고있기 때문에 B 인터페이스는 구조적 타이핑 관점에서 A 인테페이스라고 볼 수 있다.
- 이는 완전히 구조가 같아야만 동일한 것이 아니다.

<br>

```ts
type Arr = number[];
type CopyArr = {
  [key in keyof Arr]: Arr[key];
};

const copyArr: CopyArr = [1, 3, 4];
```

- CopyArr 타입에 존재하는 모든 속성을 숫자 배열이 갖고 있으므로 둘은 구조적으로 동일한 셈이다.

  <br>

```ts
type SimpleArr = { [key: number]: number; length: number };
const simpleArr: SimpleArr = [1, 3, 4];
```

- 숫자 배열은 SimpleArr 객체 타입에 있는 모든 속성을 갖고 있기 때문에 숫자 배열은 구조적으로 SimpleArr이라고 볼수 있다.

<br/>

#### 같은 구조적 타이핑이지만 서로 대입하지 못하게 하려면?

- 구분할 수 있는 속성을 추가 -> 구조적으로 동일하지 않게 만든다.

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
const circle: Money = liter; // 에러
// 'Liter' 형식은 'Money' 형식에 할당할 수 없습니다.
//   '__type' 속성의 형식이 호환되지 않습니다.
//     '"liter"' 형식은 '"money"' 형식에 할당할 수 없습니다.
```

- 서로 `__type 속성`이 다르므로 대입되지 않는다.
- 이름이 \_\_type이 아니더라도 객체를 구별할 수 있는 속성으로 다른 속성과 겹치지 않는 이름으로 만들면 된다.
- \_\_type 속성같은 속성을 `브랜딩(brand)속성`이라고 부르고, 브랜등 속성을 사용하는 것을 `브랜딩(branding)한다`고 표현한다.
