# 스터디 2주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

## 2주차 스터디 목차

- [2.7 타입스크립트에만 있는 타입을 배우자](#27-타입스크립트에만-있는-타입을-배우자)

  - [2.7.1 any](#271-any)
  - [2.7.2 unknown]()
  - [2.7.3 void]()
  - [2.7.4 {}, Object]()
  - [2.7.5 never]()
  - [2.7.6 타입 간 대입 가능표]()

- [2.8 타입 별칭으로 타입에 이름을 붙이자]()

---

---

<br />

## <span style="color: yellow">2.7</span> 타입스크립트에만 있는 타입을 배우자

[week1-2.2.1-타입 추론](../week1/sungwoo.md#221-타입-추론)

위에서 나왔듯이 매개변수에 타입을 표기하지 않으면 any 타입이 부여되기 때문에 <br />
`implicitAny` 에러가 발생합니다.

```ts
function plus(x, y) {
  return x + y;
}
// Parameter 'x' implicity has an 'any' type.
// Parameter 'y' implicity has an 'any' type.
```

타입스크립트에는 any처럼 자바스크립트에 없는 타입들이 있습니다. <br />
e.g., unknown, void, {}, never

---

<br />

### <span style="color: yellow">2.7.1</span> any

`any`는 타입스크립트에서 지양해야 할 타입입니다. <br/>
왜냐하면 any 타입은 모든 동작을 허용하기 때문입니다.

```ts
let str: any = "hello";
const result = str.toFixed();
// const result: any
```

str 변수는 문자열인데도 toFixed() 메서드를 사용하고 있습니다. <br />
실행하면 에러가 발생하지만, 저 상태에서 타입스크립트는 에러를 표시하지 않습니다.<br/>
any 타입을 쓰면, 타입스크립트가 타입을 검사하지 못하기 때문에 타입스크립트를 쓰는 의미가 퇴색합니다.

그리고 위 코드에서 알 수 있듯이, any 타입을 사용하면 파생되는 결과물도 any 타입이 됩니다.<br/>
따라서 한 번 any 타입을 쓰게 되면 계속 any 타입이 생성되기 때문에, any 타입의 사용은 지양해야 합니다.

하지만, any 타입을 쓸 일은 없어도 만나는 경우가 있습니다.<br/>
매개변수에 타입을 부여하지 않으면 any로 추론되는 경우처럼, 타입스크립트가 any로 타입을 추론하는 경우입니다.<br/>
대부분 타입이 any로 추론되면 `implicitAny` 에러가 발생합니다.

<br/>

하지만 any여도 에러가 발생하지 않고, 다르게 추론하는 경우가 있습니다.

<br/>

### <span style="color: yellow">2.7.1.1</span> 빈 배열에 타입을 표기하지 않는 경우

빈 배열에 타입을 표기하지 않으면 배열이 any[] 타입이 되어버립니다.

```ts
const arr = [];
// const: any[]
```

any[]로 추론된 배열에 push, concat, pop을 사용하면 배열의 타입 추론에 변동이 생길 수 있습니다.

`push 메서드`나 `인덱스`로 요소를 추가할 때마다 추론하는 타입이 바뀝니다.

```ts
const arr = [];

arr.push(1);
arr;
// const arr: number[]

arr.push("1");
arr;
// const arr: (string : number)[]

arr[2] = false;
console.log(arr); // [1, '1', false];
// arr: (string | number | boolean)[]
```

`concat 메서드`는 에러가 발생합니다.

```ts
const arr = [];
const arr2 = arr.concat("123");
// variable 'arr' implicitly an 'any[]' type.
```

`pop 메서드`로 요소를 제거할 때는 이전 추론으로 되돌아가지 못합니다.

<span style="color: yellow"></span>

<br/>

### <span style="color: yellow">2.7.1.2</span> 숫자나 문자열 타입과 연산

any는 숫자나 문자열 타입과 연산할 때 타입이 바뀌기도 합니다.

```ts
// 문자열
const a: any = "123";

const nb1 = a - 1;
console.log(nb1); // 122
// nb1: number

const nb2 = a * 1;
console.log(nb2); // 123
// nb2: number

const nb3 = a / 2;
console.log(nb3); // 61.5
// nb3: number

// 숫자
const b: any = 123;

const nb4 = b - 1;
console.log(nb4); // 122;
// nb4: number

const nb5 = b * 1;
console.log(nb5); // 123;
// nb5: number

const nb6 = b / 2;
console.log(nb6); // 61.5
// nb6: number
```

더하기 연산에서는 조금 다르게 추론합니다.

```ts
// 숫자
const a: any = 123;

const an1 = a + 1;
console.log(an1); // 124
// an1: any

const nb1 = a + "1";
console.log(nb1);
// nb1: string

// 문자열
const b: any = "123";

const an2 = b + 1;
console.log(an2);
// an2: any

const nb2 = b + "1";
console.log(nb2);
// nb2: string
```

<br/>

### <span style="color: yellow">2.7.1.3</span> 명시적 any 반환

타입스크립트가 명시적으로 any를 반환하는 경우도 있습니다. <br/>
대표적으로 `JSON.parse`와 `fetch` 함수가 있습니다.

```ts
fetch("url")
  .then((response) => {
    return response.json();
  })
  .then((result) => {});
// (parameter) result: any

const result = JSON.parse('{"a":1}');
// const result: any;
```

이뗴는 직접 타이핑하여 모든 타입이 any가 되는 것을 방지해야 합니다.

```ts
fetch("url")
  .then<{ data: string }>((response) => {
    return response.json();
  })
  .then((result) => {});
// (parameter result: {
//   data: string
// })

const result: { a: string } = JSON.parse('{"a":1}');
// const result: {
//   a: string
// }
```

<br/>

---

### <span style="color: yellow">2.7.2</span> unknown

`unknow`은 모든 타입을 대입할 수 있지만, 그 후 어떠한 동작도 수행할 수 없게 됩니다.<br/>
any처럼 동작을 허용하지 않고, unknown인 변수를 사용한 모든 동작은 에러로 처리됩니다.

```ts
const a: unknown = "hello";
const b: unknown = "world";
a + b;
// 'a' is of type 'unknown'
// 'b' is of type 'unknown'

a.slice();
// 'a' is of type 'unknown'
```

unknown 타입을 직접 표시할 경우는 거의 없고, 대부분 try catch문에서 보게 됩니다.

```ts
try {
} catch (e) {
  console.log(e.message);
}
// var e: unknown
// 'e' is of type 'unknown'
```

catch문의 e에는 any와 unknown 외의 타입을 직접 표기할 수 없습니다.

이때 `타입 주장(Type Assertion)`으로 타입을 강제 지정할 수 있습니다.

<br/>

### <span style="color: yellow">2.7.2.1</span> as 타입 주장

```ts
try {
} catch (e) {
  const error = e as Error;
  console.log(error.message);
}
// const error: Error
```

error는 Error로 인식되어 관련 기능이 동작합니다.

하지만 항상 as 연산자를 사용해서 다른 타입으로 주장할 수 있는 것은 아닙니다.

```ts
const a: number = "123" as number;
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other . If this was intentional, convert the expression to 'unknown' first.
```

강제로 변환하는 방법이 있긴합니다.

```ts
const a: number = '123' as unknown number;
```

먼저 unknown으로 주장한 후에 원하는 타입으로 다시 주장하면 됩니다.<br>
다만 강제로 주장한 것이므로 as를 사용할 떄는 자신이 책입져야 합니다.

<br/>

as 같은 것이 하나 더 있습니다. <br/>
`!(non-null assertion)` 연산자입니다. <br/>
null과 undefined가 아님을 주장할 수 있는 연산자입니다.

<br/>

`!(non-null assertion)`

```ts
function a(param: string | null | undefined) {
  param.slice(3);
}
```

매개변수 param이 null이거나 undefined 일 수도 있으니까 <br/>
string의 메서드인 slice를 사용할 수 없다는 에러 메세지가 표시됩니다.

이럴 때 param이 null 이나 undefined가 아닌 것이 확실하다면 값 뒤에 !연산자를 붙이면 됩니다.

```ts
function a(param: string | null | undefined) {
  param!.slice(3);
}
```

<br/>

### <span style="color: yellow">2.7.2.2</span> <> 타입 주장

배열에서 사용했던 <> 과는 다른 의미입니다. <br>
이 방식은 React의 JSX와 충동합니다. 따라서 as로 주장하는 것을 권장합니다.

```ts
try {
} catch (e) {
  const error = <Error>e;
  console.log(error.message);
}
```

---

<br/>

### <span style="color: yellow">2.7.3</span> void

자바스크립트에서 void는 연산자입니다. <a href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/void" target="_blank">MDN void - JavaScript</a><br>
타입스크립트에서는 타입으로 사용됩니다.

타입스크립트에서 함수의 반환값이 없는 경우<br>
undefined가 반환되고, 타입은 void로 추론됩니다.

```ts
function noReturn() {}
// function noReturn: void
```

void는 함수의 반환값을 무시하도록 하는 특수한 타입입니다.

```ts
const func: () => void = () => 3;
const value = func();
// const value: void
```

하지만 아래 같은 상황에서는 반환값을 무시하지 않고 에러가 발생합니다.

```ts
// 반환값의 타임만 따로 표기하는 경우
const func = (): void => 3;
// Type 'number' is not assignable to type 'void'

// 반환값의 타입이 void와 다른 타입의 유니온인 경우
const func2: () => void | undefined = () => 3;
// Type 'number' is not assignable to type 'void'
```

<br>
void를 활용하여 반환값을 무시하는 특성은 콜백 함수에 주로 사용합니다.

```ts
[1, 2, 3].forEach((v: number): void => {
  console.log(v.toString());
});
```

> ## <span style="color: yellow">void를 사용하는 목적 2가지</span>
>
> - 사용자가 함수의 반환값을 사용하지 못하도록 제한
> - 반환값을 사용하지 않는 콜백 함수를 타이핑할 때

<br>

---

### <span style="color: yellow">2.7.4</span> {}, Object

null과 undefined를 제외한 모든 값을 의미합니다.<br>

실제로 사용하려고 하면 에러가 발생합니다.

```ts
const obj: {} = {name: 'zero'};
const arr: {} = [];
const func: {} = () -> {};
```

{} 타입을 직접 사용할 일은 거의 없지만, if 문안에 unknown 타입을 넣을 때 볼 수 있으니 알아두어야 합니다.

```ts
const unk: unknown = "hello";
unk;
if (unk) {
  unk;
  // const unk: {}
} else {
  unk;
  // const unk: unknown
}
```

<br>

---

### <span style="color: yellow">2.7.5</span> never

never 타입에는 어떠한 타입도 대입할 수 없습니다.

많이 사용하지는 않지만 드물게 직접 써야할 상황이 있습니다.

```ts
function: neverFunc1(): never {
	throw new Error('에러')
}

function infinite(): never {
	while(true) {
		console.log('무한 반복됩니다.')
	}
}
```

### <span style="color: yellow">2.7.6</span> 타입 간 대입 가능표

|    ->     | any | unknown | {}  | void | undefined | null | never |
| :-------: | :-: | :-----: | :-: | :--: | :-------: | :--: | :---: |
|    any    |     |    O    |  O  |  O   |     O     |  O   |   X   |
|  unknown  |  O  |         |  X  |  X   |     X     |  X   |   X   |
|    {}     |  O  |    O    |     |  X   |     X     |  X   |   X   |
|   void    |  O  |    O    |  X  |      |     X     |  X   |   X   |
| undefined |  O  |    O    |  X  |  O   |           |  X   |   X   |
|   null    |  O  |    O    |  X  |  X   |     X     |      |   X   |
|   never   |  O  |    O    |  O  |  O   |     O     |  O   |       |

<br>

---

---

## <span style="color: yellow">2.8</span> 타입 별칭으로 타입에 이름을 붙이자

타입스크립트에서는 `type`키워드로 타입에 이름을 저장해서 사용할 수 있다.

```ts
type A = string;
const str: A = "hello";
// cosnt str: string
```

기존 타입에 새로 이름을 붙인 것을 `타입 별칭(Type alias)`이라고 합니다.<br>
타입 별칭은 대문자로 시작하는 단어로 만드는 것이 관습입니다

<br>

타입 별칭은 주로 복잡하거나 가독성이 낮은 타입에 붙입니다.

```ts
// 타입 별칭 없을 때
const func1: (value: number, unit: string) => string = (value, unit) => {
  return value + unit;
};

// 타입 별칭 사용할 때
const ValueWithUnit = (value: number, unit: string) => string;

const func2: ValueWithUnit = (value, unit) => {
  return value + unit;
};
```

<br>

함수 외에는 주로 객체나 배열을 주로 타입 별칭으로 분리합니다.

```ts
// 타입 별칭 없을 때
const person1: {
  name: string;
  age: number;
  married: boolean;
} = {
  name: "zero",
  age: 28,
  married: false,
};

// 타입 별칭 사용할 때
type Person = {
  name: string;
  age: number;
  married: boolean;
};

const person2: Person = {
  name: "zero",
  age: 28,
  married: false,
};
const person3: Person = {
  name: "yaro",
  age: 48,
  married: true,
};
```
