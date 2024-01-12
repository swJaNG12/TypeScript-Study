# 스터디 2주차

### 📝 2주차 스터디 목차 <br/>

<br/>

#### [2.7 타입스크립트에만 있는 타입을 배우자](#27-타입스크립트에만-있는-타입을-배우자)

#### [2.7.1 any](#271-any)

#### [2.7.2 unKnown](#272-unknown)

#### [2.7.3 void](#273-void)

#### [2.7.4 {}, Object](#274--object)

#### [2.7.5 타입 간 대입 가능표](#275-타입-간-대입-가능표)

#### [2.8 타입 별칭으로 타입에 이름을 붙이자](#28-타입-별칭으로-타입에-이름을-붙이자)


<br/>

### 2.7 타입스크립트에만 있는 타입을 배우자

타입스크립트에는 any처럼 자바스크립트에서는 보지 못한 타입들이 있다.
(any, unknown , void {} , never 등등) 먼저 any부터 살펴보자.

<br/>

#### 2.7.1 any

```ts
let str: any = "hello";
const result = str.toFixed(); // 에러를 표시하지않는다
```

위의 예시를 보면 str 문자열을 any로 타입을 지정했더니, toFixed()를 사용했어도 타입 스크립트는 에러를 표시하지 않는다.
왜 그럴까? 타입 스크립트는 any 타입을 쓰면 모든 동작을 허용하기 때문에 타입을 검사하지 못하므로 타입 스크립트를 쓰는 의미가 퇴색된다.

또 any 타입을 통해 파생되는 결과도 any 타입이 된다.
즉 result 변수도 any 타입으로 추론되는 걸 확인할 수 있고, 계속 any 타입이 생성되므로 사용을 지양해야 한다.

- 대부분의 경우 타입이 any로 추론되면 다음과 같이 implicitly 에러가 발생한다

```ts
function plus(x, y) {
  return x + y; //Parameter 'x' implicitly has an 'any' type
} //Parameter 'y' implicitly has an 'any' type
```

하지만 any여도 에러가 발생하지 않을 때가 있다. 다음 예시를 살펴보자.
arr 변수에 타입을 표기하지 않으면 자동으로 any로 추론된다.

```ts
const arr = []; // any 타입
```

`이와같이 타입스크립트가 any로 추론하는 타입이 있다면 타입을 직접표기해야 한다.`
any타입은 타입 검사를 포기한다는 선언과 같기때문이다.

```ts
const arr: string[] = []; // string[]타입
```

한 가지 신기한 점은 any[]로 추론된 배열에는 push 메서드나 인덱스로 요소를 추가할 때마다 추론하는 타입이 바뀐다는 것이다.

```ts
const arr = []; // any 타입
// 1. push(string)
arr.push("1");
// 여기서 arr타입을 확인해보면 string[]이다.
arr;

//2. push(number)
arr.push(3);

arr; // arr: (string | number)[] 으로 변했음.
```

```ts
const arr2 = []; // any[]

// 1. 문자열을 0번째 index에 대입해보자
arr2[0] = "1";

arr2; // string[]

// 2.

arr2[1] = 3;
arr2; // (string | number)[]
```

- concat은 에러발생

<br/>

arr3를 사용하여 concat 메서드를 호출할 때, 타입스크립트는 concat 메서드가 동일한 타입의 배열을 예상하므로('123'은 문자열이므로) 에러를 발생시킨다.

```ts
const arr3 = []; // 암묵적으로 any[]타입

const arr4 = arr3.concat("123");

// Variable 'arr3' implicitly has type 'any[]' in some locations where its type cannot be determined.
// Variable 'arr3' implicitly has an 'any[]' type.
```

- 이 문제를 해결하려면 arr3의 타입을 명시하거나 타입을 추론할 수 있도록 일부 값을 포함시켜야 한다.

```ts
const arr3: string[] = [];
const arr4 = arr3.concat("123");

or;

const arr3 = ["123"];
const arr4 = arr3.concat("123");
```

- pop()
  
<br/>

pop메서드를 사용해 요소를 제거할 때는 이전 추론으로 되돌아가지 못한다.

```ts
const arr = []; //any[]
arr.push("1");

arr; // string[]

arr.pop();
arr; // 여기서 다시 any[]타입으로 돌아가지못한다. -> const arr: string[]타입
```

- 문자열 타입과 연산할 때

```ts
const a: any = "123";

// 여기서 a의 타입은 any로 변하지않음
const an1 = a + 1; // const an1: any

const nb1 = a - 1; // nb1: number

const nb2 = a * 1; // nb2: number
const nb3 = a - 1; // nb3: number
const st1 = a + "1"; // st1: string
```
<br/>

어떤 값에 연산을 할 때는 숫자로 바뀌므로 number 타입 되고 어떤 값에 문자열을 더하면 string 타입이 된다.
다만 a가 숫자 면 number이 되지만 a가 문자열이면 string이 되므로 타입스크립트는 그냥 a를 any로 추론한다.

- 타입 스크립트가 명시적으로 any를 반환하는 경우

- 1. JSON.parse , fetch 함수

- 타입을 명시하지 않았을 때
- fetch를 통한 비동기 처리에서는 result의 타입이 명시되지 않아 any로 추론된다.

```ts
fetch("url")
  .then((response) => response.json())
  .then((result) => {
    // data의 타입을 명시적으로 알 수 없는 경우
    //(parameter) result: any
  });
const result = JSON.parse('{"key": "value"}');
//const result: any
//JSON.parse 역시 명시적인 타입 정보가 없어서 any로 추론된다
```

- 제네릭을 사용하여 타입을 명시적으로 정의한 경우 <{data: string}>
- then 메서드에서의 result 변수는 명시적으로 { data: string } 타입으로 정의된다.

```ts
fetch("url")
  .then<{ data: string }>((response) => {
    return response.json();
  })
  .then((result) => {
    //(parameter) result: {
    //data: string;
  });

const result: { hello: string } = JSON.parse('{"key": "value"}');
```

### 2.7.3 unKnown
<br/>
unKnown는 any와 비슷하게 모든 타입을 대입할 수 있지만. 그 후 어떤 동작도 수행할 수 없게 된다.
unknown인 a,b 변수를 사용한 모든 동작이 에러로 처리된다.

`any와 다르게 모든 동작을 허용해서 타입 검사가 되지않는 상황은 발생하지 않는다.`

```ts
const a: unknown = "hello";
const b: unknown = "world";
a + b;
//'a' is of type 'unknown
//'b' is of type 'unknown'
```

- 대부분 try catch문에서 볼수있다.

```ts
try {
} catch (e) {
  console.log(e.message);
}
//var e: unknown
//'e' is of type 'unknown'
```

타입스크립트에서는 catch (e)를 사용하여 오류를 잡을 때 잡힌 변수 e의 타입이 암묵적으로 unknown으로 설정된다.
타입스크립트 컴파일러가 잡힌 오류 객체의 타입을 정적으로 결정할 수 없기 때문이다.

catch문의 e에는 any와 unknown 외엔 다른 타입을 직접 표기할 수 없기 때문에 `as`로 타입을 주장할 수 있다.

```ts
try {
} catch (e) {
  const error = e as Error;
  console.log(error.message);
  //console.log((e as Error).message);
}
```

`as 연산자를 사용해 다른 타입으로 주잘할 수 있는것은 아니다!`

```ts
const a: number = "123" as number;

//Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```
<br/>
-> 강제로 바꾸는 법
먼저 unknown으로 주장후 원하는 타입을 다시 주장하면된다.
다만 강제로 주장한 것에대해 as를 사용할 때는 자신이 책임을 져야한다..

```ts
const a: number = "123" as unknown as number;
```

- as와 같은 non-null assertion 연산자

이 연산자닌 null이 아님을 주장하는 연산자이다. undefined도 아님을 주장할 수 있다.

```ts
function a(param: string | null | undefined) {
  param.slice(3);
}
//param' is possibly 'null' or 'undefined'
// param가 null이거나 undefined일수 있기때문에 메서드를 사용할 수 없다는 의미의 에러..
```

이 경우 뒤에 ! 연산자를 붙이면 해결가능하다

```ts
function a(param: string | null | undefined) {
  param!.slice(3); // 여기 ! 붙임
}
```

### 2.7.3 void
<br/>
- 첫번째 예시

```ts
const func: () => void = () => 3;

const value = func();
```

func라는 변수를 선언하고, 이 변수의 타입을 () => void로 명시한다.
즉 func는 어떤 값을 반환하지 않는 함수임을 명시한다.
하지만 3을 반환하고 있음에도 에러를 발생하지 않는다.
이렇듯 반환값이 void 타입이라고 해서 함수가 undefined가 아닌 다른 값을 반환하는 것을 막지 않는다.

하지만 void를 반환받은 value 변수는 void 타입이 되어버린다.
`void 타입을 통해서 사용자가 이 함수의 반환값을 사용하지 못하도록 막을 수 있다.`

- 두 번째 예시
  여기서 func2처럼 반환값의 타입만 따로 표기

```ts
// 에러
// Type 'number' is not assignable to type 'void'.
//

const func2 = (): void => 3;

const func3: () => void | undefined = () => 3;
```

`void를 활용해 반환값을 무시하는 특성은 콜백 함수에 주로 사용된다.`

```ts
[1, 2, 3]
  .forEach((v) => v) // 숫자를 반환
  [(1, 2, 3)].forEach((v) => console.log(v)); // undefined를 반환
```

배열의 forEach 메서드는 콜백 함수를 인수로 받는다.
다음과 같이 반환 값을 사용하지 않아도 되지만, 명시적으로 void를 사용하는 것이 해당 함수의 의도를 명확하게 표현할 수 있다.

```ts
[1, 2, 4].forEach((v: number): void => {
  // 여기서 어떤 반환값을 지정하더라도 무시된다.
  console.log(v);
  v.toString(); // 반환값이 있어도 무시된다.
});
```

- 정리하면 void는 두 가지 목적을 위해 사용된다.

`1. 사용자가 함수의 반환값을 사용하지 못하도록 제한한다.`
`2. 반환값을 사용하지 않는 콜백 함수를 타이필할 때 사용한다.`
<br/>
### 2.7.4 {}, Object
<br/>
`null 과 undefined를 제외한 모든 값을 의미한다.`

- unknown 타입을 if문을 통해 검증해 보면 { } 타입이 나온다.
  if문 안에 unknown 타입을 넣을 때

```ts
const unk: unknown = "hello";
unk; //   unknown타입
if (unk) {
  unk; //  {} 타입
} else {
  unk; // unknown 타입
}
```
<br/>

### 2.7.5 타입 간 대입 가능표
<br/>
- 세로 항목이 가로 항목에 대입이 가능하면 O ,가능하지 않다면 X 이다. -예시) undefined는 void에 대입이 가능하지만 void는 undefined에 대입할 수 없다.

| Type      | any | unknown | {}  | void | undefined | null | never |
| --------- | :-: | :-----: | :-: | :--: | :-------: | :--: | :---: |
| any       |     |    O    |  O  |  O   |     O     |  O   |   X   |
| unknown   |  O  |         |  X  |  X   |     X     |  X   |   X   |
| {}        |  O  |    O    |     |  X   |     X     |  X   |   X   |
| void      |  O  |    O    |  X  |      |     X     |  X   |   X   |
| undefined |  O  |    O    |  X  |  O   |           |  X   |   X   |
| null      |  O  |    O    |  X  |  X   |     X     |      |   X   |
| never     |  O  |    O    |  O  |  O   |     O     |  O   |       |

<br/>

### 2.8 타입 별칭으로 타입에 이름을 붙이자
<br/>

```ts
type A = string;
const str: A = "Hello";
```

string타입을 A라는 이름을 지정했을 때 타입으로 A를 사용할 수 있고, string과 동일한 타입이 된다.

이렇게 기존 타입에 새로 이름을 붙인 것을 `타입 별칭(type alias)`이라 부른다.

> 별칭을 대문자로 시작하는 단어로 하는게 관습이다.

```ts
const func1: (value: number, unit: string) => string = (value, unit) =>
  value + unit;

type ValueWithUnit = (value: number, unit: string) => string;
const func2: ValueWithUnit = (value, unit) => Value + unit;
```

- 함수 외에는 객체나 배열을 주로 타입별칭으로 분리한다.

```ts
const person1 {

  name : string,
  age : number,
  married : boolean
} = {
  name : 'zero',
  age: 28,
  married : false,
}

// 타입 별칭으로 분리하면 person2,person3처럼 Person타입을 재사용할 수 있다!!

type Person ={
  name : string
  age : number,
  married : boolean
}

const person2 : Person = {
  name : 'zero',
  age: 28,
  married : false,
}

const person3 : Person = {
  name : 'hayeon',
  age: 26,
  married : false,
}

```
