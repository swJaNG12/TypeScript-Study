<br/>

### 🔖 2.1  타입 스크립트의 타입은 어디에 붙이는가?

- 기본적으로 이 세가지에 타입을 부여한다.

> 1. 변수 
> 2. 함수의 매개변수
> 3. 반환값

#### 2.1.1 기본타입

- string(문자열)
- number(숫자)
- boolean (불 값)
- object(객체) , 함수와 배열도 포함
- null
- undefined
- symbol
- bigint

#### 2.1.2. 변수에 타입을 표기 방법

```ts

const 변수명 : 타입 = 값
const str: string = "안녕!";
const num : number = 123;
const bool : boolean : true;
const obj : object = { hello : 'world'};
const n : null = null;
const u : undefined =  undefined;
const sym : symbol = Symbol('sym');
const big : bigint = 10000000n;
```

#### 2.1.3 함수에 타입을 표기 방법

- `매개변수의 타입`은 매개변수 바로 뒤에 표기
- `반환값의 타입`은 함수의 매개변수 소괄호 뒤에 표시

```ts
function 함수명(매개변수 : 매개변수의 타입) : 이 함수가 반환할 값의 타입 {
return 반환값;
}
// 함수
function plus(a: number, b: number): number {
  return a + b;
}
// 화살표 함수
const minus = (a: number, b: number): number => a - b;
```

### 🔖 2.2 타입 추론을 적극 활용하자

<br/>

```ts
// 함수
function plus(a: number, b: number): number {
  return a + b;
}
const result1: number = plus(2, 3); // 타입을 지정해줌
const result2 = plus(1, 2); // 타입을 지정하지 않아도 plus의 매개변수가 number 타입이기 때문에 반환값이 number일 수 밖에 없다.
```

- 위의 예시처럼 타입스크립트는 변수와 반환값의 타입을 스스로 추론할 수 있다.
- `다만 어떤 값이 들어올지 모르기때문에 매개변수에는 타입을 부여해야 한다.`

#### 2.2.3 타입을 부여하지 않았을 때 에러메세지

> Parameter 'a' implicitly has an 'any' type
> (parameter) a: any

- any타입(모든 타입을 허용하는 타입)은 직접 타입을 표기하지않아서 타입을 추론했다는 의미이다.
- any때문에 발생하는 에러를 `implicitAny에러` 라고 부른다.

#### 2.2.2 타입스크립트 추론

```ts
const str = "안녕!";
let str = "안녕!";
const num = 123;
const bool = true;
const obj = { hello: "world" };
const n = null;
const u = undefined;
const sym = Symbol("sym");
```

- 앞서 살펴봤던 코드를 예시로 타입 표기를 제거했더니 이전 예시와 다르게 str의 타입이 string이 아니라 `const str: "안녕!"` 이런 결과가 나온다.
- 이는 const로 선언했기 때문에 str변수는 '안녕!'외의 다은 문자열이 될 수 없기 때문에 이런 결과가 나온것이다.
- 즉 타입스크립트의 추론이 더 정확한 것이다.

#### 2.2.3 알고 넘어가야 하는 점

> 타입을 표기할 때는 정확한 값을 입력할 수 있고(리터널 타입)있고, 타입을 표기할 때는 더 넣은 타입을 표기해도 문제가 되지않는다.

- 예를 들어 밑의 코드처럼 선언해도 문제가 되지않는다. <br/>
  `{} 타입`은 객체를 의미하는것이 아니라 null과 undefined를 제외한 모든 타입을 의미한다.
  나머지 타입이 틀린 것이 아니지만 조금 부정확한 타입을 사용한 것이다.  <br/>
 -> 이러한 이유로 타입스크립트가 제대로 추론했다면 그대로 사용하고, 잘못 추론했다면 직접 타입을 지정하는 것이 좋은 방법이다.

```ts
📌 const str1 : "안녕!"= "안녕!"; // 제일 정확한 타입 선언
   const str2 : string= "안녕!";
   const str3 : {} = "안녕!";
   let str4 =  '안녕!'; // let으로 선언했을 경우 다른 값을 대입할 수 있기 때문에  let str4: string 문자열로 타입을 넓게 추론한다 (타입 넓히기)

// 여기서 let 변수에 대입할 때는 둘다 any로 추론된다.
   let n = null;
  let u  =  undefined;

```

<br/>

### 🔖 2.3 값 자체가 타입인 리터럴 타입

 <br/>
 
자바스크립트에서 변수를 let으로 선언하면 어떤 값이든 대입할 수 있지만 타입 스크립트에선 표기한 타입과 일치하는 값만 대입할 수 있다.
아래의 코드를 보면 같은 string 타입은 대입할 수 있지만, number 타입을 대입하려면 에러가 발생한다.

```ts
//1.문자열 리터럴 타입
let str: string = "Hello";
str = "World";

//에러!!
str = 124;
// Type 'number' is not assignable to type 'string

//2.숫자 리터럴 타입
let num: 52 = 52; // num 변수에 할당되는 값이 반드시 42여야 함을 의미
//3.불리언 리터럴 타입
let bool: true = true; // bool 변수에 할당되는 값이 반드시 true여야 함을 의미

//4. 객체의 속성 값 리터럴 타입
const obj1: { name: "hayeon" } = {
  name: "hayeon",
};
// const obj1: {
//     name: "hayeon";
// }
const obj2 = {
  name: "hayeon",
};
//const obj1: {
//     name: string;
// }
//배열의 요소 값 리터럴 타입
const arr: [1, 2, "three"] = [1, 2, "three"];

const func: (amount: number, unit: string) => string = (amount, unit) =>
  amount + unit;

const arr2 = [1, 2, "three"]; //  const arr2: (string | number)[]
// arr2의 타입은 문자열 또는 숫자타입의 배열이라는 뜻
```

#### 2.2.3 as const , readonly

- 값이 변하지 않는 것이 확실하면 as const를 붙혀 정의한다
- readonly 수식어가 붙으면 해당 값을 변경할 수 없다. 변경하면 예시의 코드처럼 에러가 발생한다.
  자바스크립트의 실수를 타입스크립트에서 통제할 수 있다.

```ts
const arr = [1, 2, "three"] as const;
//const arr2: readonly [1, 2, "three"]
// 에러!!
//arr.push(3)
// Property 'push' does not exist on type 'readonly [1, 2, "three"]'.
```

<br/>

### 🔖 2.4 튜플

#### 2.4.1 배열과 타입 추론

- string[]은 모든 요소가 문자열이라는 뜻 , 다른 자료형 값은 넣을 수 없다.
- <>표기법은 제너릭 , Array<number>는 숫자로만 이루어진 배열을 나타낸다.

```ts
const arr1: string[] = ["1", "2", "3"];
const arr2: Array<number> = [1, 2, 3];
//error!!
// arr1.push(4) -> number' 유형의 인수는 'string' 유형의 매개 변수에 할당할 수 없습니다
```

#### 2.4.2 타입 추론

- 배열을 추론할 때 배열안의 요소들의 타입을 토대로 추론을 한다.

```ts
const arr3 = [1, 2, 3]; // const arr3: number[]
const arr4 = [1, "3", 4]; //const arr4: (string | number)[]
const arr5 = []; // const arr5: any[]
```

#### 2.4.3 추론 한계

```ts
const array = [123, 4, 45];
array[3].toFixed();
```

이 경우 array[3]이 undefined인데도 toFixed()를 메서드를 사용해도 문제가 발생하지않는다.
이는 array[3]이 number로 추론되기 때문이다.
이 문제는 `튜플`을 사용해 해결할 수 있다.

---

#### 2.4.4 튜플의 개념

- 튜플은 각 요소의 타입과 개수가 고정된 배열을 의미한다.

```ts
const tuple: [number, boolean, string] = [1, true, "넘버원"];

tuple[0] = 3;
tuple[1] = false;
tuple[2] = "hi";

//tuple[3] = 'error' -> Type '"error"' is not assignable to type 'undefined'.
//Tuple type '[number, boolean, string]' of length '3' has no element at index '3'.

// push,pop,unshift,shift 메서드를 사용해 배열에 요소를 추가,삭제 하는건 에러가 발생 하지 않는다.
tuple.push("hi");
// 여기서 튜플에서 push 같은 메서드로 값을 막고싶다면  readonly 수식어를 붙혀준다.
const tuple2: readonly [number, boolean, string] = [1, true, "넘버원"];
// tuple2.push('error') // 에러
// Property 'push' does not exist on type 'readonly [number, boolean, string]'.

// const array3 = [123,4,45]
// array3[3].toFixed()
const array3: [number, number, number] = [123, 4, 45];
// 객체가 undefined 일 수 있다는 에러가 뜬다.
// 배열보다 더 정교한 타입 검사를 원하면 튜플을 사용할 수 있다.
//array3[3].toFixed(); // Object is possibly 'undefined'.
```

#### 2.4.5 특징

- 타입을 표기하지 않은 인덱스는 undefined타입이 되므로 값을 넣을 때 에러가 발생한다.
- 튜플은 요소의 타입과 개수가 고정되어 있어, 해당 위치에 다른 타입을 할당할 수 없다.
- 추론되지 않은 인덱스는 undefined 타입으로 간주된다.
- readonly를 통해 읽기 전용으로 만들 수 있으며, 이 경우 변경 메소드를 사용할 수 없다.

#### 2.4.6 ...타입[]

- ...타입[]을 사용하여 특정 위치에 여러 타입이 연달아 나옴을 표시할 수 있다.

```ts
const strNumBools: [string, number, ...boolean[]] = [
  "hi",
  123,
  false,
  false,
  true,
];

const strNumBool: [string, ...number[]] = ["hi", 123, 234, 343, 33];

const strsNumBool: [...string[], number, boolean] = [
  "hi",
  "no",
  "yes",
  33,
  true,
];
```

#### 2.4.7 전개구문 타입 추론

```ts
const arr = [34, ...strNumBool];
//arr 의 타입 const arr: (string | number)[]
// 구조분해 할당으로 추론
// - 나머지 속성문법을 사용할 수있다.
const [a, ...rest1] = ["hi", 1, 2, 3];
// const a: string
// const rest1: [number, number, number]
const [b, ...rest2]: [string, ...number[]] = ["hi", 23, 434, 55];
//const b: string
//const rest2: number[]
```

#### 2.4.8. 옵셔널 수식어

- 튜플 내부의 값이 선택적으로 올 수 있음을 의미한다.

```ts
let tuple1: [number, boolean?, string?] = [1, false, "yes"];

tuple1 = [3, true];
// tuple1 = [5 , 'error']// 두번째 값이 boolean타입과 맞지않음
tuple1 = [3, undefined, undefined];
// 옵셔널자리엔 undefined 올 수도 있다.
```

<br/>

### 🔖 2.5 타입 구분

- 타입으로 사용항 수 있는 값 (변수의 이름)
- 타입으로 사용할 수 없는 값 (리터럴 값), (Date,Math,Error,String, Object,Number,Boolean와 같은 내장 객체 타입으로도 사용가능)

- 하지만 , String, Object,Number,Boolean,Symbol을 타입으로 사용하는 것은 권장하지 않는다. 아래 예시를 보면서 이해하자.

```ts
//error!
// 연산자 '+'를 '숫자' 및 '숫자' 유형에 적용할 수 없습니다
function add(x: Number, y: Number) {
  return x + y;
}
//error!
const str1: String = "hello";
const str2: string = str1;
//'String' 유형은 'String' 유형에 할당할 수 없습니다.
// 'string'은 기본이지만 'string'은 래퍼 개체입니다. 가능한 경우 'string'을 사용하는 것을 선호합니다.

const obj: Object = "what!";
```

- Number 간에는 연산자를 사용할 수 없고, string에 String을 대입할 수 없다.
-  error는 아니지만 객체타입인데 문자열 대입이 가능하다.
 ->  이러한 이유로 string ,object,number, boolean, symbol로 통일해 사용하는 것이 좋다.

<br/>

### 🔖 2.6 유니언 타입

#### 2.6.1 유니언 타입이란?

- 하나의 변수가 여러 타입을 가질 수 있는 가능성을 표시하는 것

  ```ts
  let strOrNum = string | number = 'hi';
  strOrNum = 1232;
  ```

- strOrNum은 string이 될 수 있고 , number이 될 수 있다. 따라서 모두 대입이 가능하다.

```ts
const arr = [1, "3", 4];
//const arr : (string | number)[]
```

- 이때 arr의 타입은 (string | number)[]로 추론되고 , 소괄호를 붙혀야 string | number타입을 가진 배열로 나타난다.
- 소괄호를 쓰지않으면 숫자의 배열이 되버린다. <br/>

#### 2.6.2 함수의 매개변수, 반환값에서도 쓰인다.

```ts
function returnNum(value: string | number): number {
  return parseInt(value); // -> error
  //'string | number' 유형의 인수는 'string' 유형의 매개 변수에 할당할 수 없습니다.
  // 'number' 유형은 'string' 유형에 할당할 수 없습니다
}

returnNum(1);
returnNum("11");
```

returnNum함수의 매개변수 타입은 string | number이기 때문에 매개변수가 숫자 or 문자열 일 수도 있다. <br/>
하지만 parseInt(value) 이 부분에서 에러가 발생한다. <br/>
자바스크립트에선 parseInt(1), parseInt('1') 둘다 에러없이 작동하지만, 타입스크립트에선 `parseInt의 인수로 문자열만` 넣을 수 있다. <br/>

- 다음과 같이 수정해보자!

```ts
function returnNum(value: string | number): number {
  if (typeof value === "number") {
    return parseInt(value.toString()); // value를 문자열로 변환하여 parseInt 호출
  }
  return parseInt(value); // value가 이미 문자열이면 그대로 parseInt 호출
}

returnNum(1); // 1
returnNum("11"); // 11
```

- 위 코드에서 typeof value === "number" 체크로 인해 value 의 타입이 number로 지정하고, 해당 블록 내에서는 value를 숫자로 다룰 수 있게 한다. <br/>
  else 블록 내에서는 value의 타입이 string으로 좁혀져서 문자열 메소드를 사용할 수 있게한다. <br/>

- 이렇게 유니언 타입으로부터 정확한 타입을 찾아내는 기법을 `타입 좁히기`라고 부른다. <br/>
  보통 조건문이나 특정한 상황에서 타입을 한정짓는 것을 의미한다. <br/>

<br/>

#### 2.6.3 | 연산자

- 유니언은 타입 사이에만 | 연산자를 쓸 수 있는것이 아니라 타입 앞에도 사용할 수있다 점입니다.

```ts
type Union2 = string | boolean | number | null;
```

Union2는 여러 줄에 걸쳐서 유니언을 표기하고 싶을 때 종종 사용한다.
