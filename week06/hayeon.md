# 스터디 6주차

### 📝 6주차 스터디 목차

## 목차

- [2.26 추가적인 타입 검사에는 satisfies 연산자를 사용하자](#226-추가적인-타입-검사에는-satisfies-연산자를-사용하자)
- [2.27 타입스크립트는 건망증이 심하다](#227-타입스크립트는-건망증이-심하다)
- [2.28 원시 자료형에도 브랜딩 기법을 사용할 수 있다](#228-원시-자료형에도-브랜딩-기법을-사용할-수-있다)
- [2.29 배운 것을 바탕으로 타입을 만들어보자](#229-배운-것을-바탕으로-타입을-만들어보자)
  - [2.29.1 판단하는 타입 만들기](#2291-판단하는-타입-만들기)
  - [2.29.2 집합 관련 타입 만들기](#2292-집합-관련-타입-만들기)
- [2.30 타입스크립트의 에러 코드로 검색하자](#230-타입스크립트의-에러-코드로-검색하자)
- [2.31 함수에 기능을 추가하는 데코레이터 함수가 있다](#231-함수에-기능을-추가하는-데코레이터-함수가-있다)
- [2.32 엠비언트 선언도 선언 병합이 된다](#232-엠비언트-선언도-선언-병합이-된다)

<br>

## 2.26 추가적인 타입 검사에는 satisfies 연산자를 사용하자

satisfies 연산자는 타입 추론을 그대로 활용하면서 추가로 타입 검사를 하고 싶을 때 사용한다.
다음 코드를 살펴보자

```ts
const universe = {
  sun: "star",
  sriius: "star", // 일부로 sirius대신 sriius로 오타 냄
  earth: { type: "planet", parent: "sun" },
};
```

위의 코드는 객체의 타입을 선언 및 검사하려는 상황이다. 이때 하나의 속성에는 일부로 sirius 대신 sriius로 오타를 냈다. 이 상황에서 인덱스 시그니처를 사용해 아래와 같은 코드로 오타를 잡을 수 있다.

```ts
const universe: {
  [key in "sun" | "sirius" | "earth"]:
    | { type: string; parent: string }
    | string;
} = {
  sun: "star",
  sriius: "star", // "sriius": Unknown word
  earth: { type: "planet", parent: "sun" },
};

console.log(universe.earth.type); // Error: string' 형식에 'type' 속성이 없습니다.
```

위의 코드처럼 오타를 잡아 낼 수 있지만 속성 값의 타입을 객체와 문자열의 유니언으로 표기해뇠기 때문에 earth 타입이 객체라는 것을 제대로 잡아내지 못한다.
이럴 땐 처음과 같이 타입 추론을 하게끔 하고 오타를 잡을 수 있는 방법은 satisfies 연산자를 사용해야 한다.
객체 리터럴 뒤에 `satisfies es 타입`으로 표기한다.

<br>

```ts
const universe = {
  sun: "star",
  sriius: "star", // 일부로 sirius대신 오타,"sriius": Unknown word.
  earth: { type: "planet", parent: "sun" },
} satisfies {
  [key in "sun" | "sirius" | "earth"]:
    | { type: string; parent: string }
    | string;
};
console.log(universe.earth.type); //planet
```

이렇게 satisfies연산자를 사용하면 universe 타입은 타입 추론 된것을 그대로 사용하면서, 각각의 속성은 satisfies에 적은 타입으로 다시 한번 검사한다. 여기서 오타를 잡아 낼 수 있다.

<br>

## 2.27 타입스크립트는 건망증이 심하다

```ts
try {
} catch (error) {
  if (error) {
    error.message; // Error : Property 'message' does not exist on type '{}'
  }
}
```

위의 코드는 error가 unknown타입으로 추론되기 때문에 if 문을 통과하면 {}타입이 된다.{}타입은 속성으로 사용할 수 없는 타입이기 때문에 아래와 같이 타입주장을 할 수 있다.

```ts
try {
} catch (error) {
  if (error as Error) {
    error.message; // Error : 'error' is of type 'unknown'
  }
}
```

if문에서 error를 Error타입으로 강제 주장했지만 error가 여전히 unknown타입이라고 나온다.
이는 as로 강제 주장한 것이 일시적이기 때문이다.
if는 참인지 거짓인지를 판단할 때만 주장한 타입이 사용되고, 판단 후에는 원래 타입으로 돌아온다.
따라서 위와 같은 코드에서 에러를 해결하려면 `주장한 타입을 계속 기억할 수 있게 만들어야 한다.`
이럴땐`변수를 사용하자!`

```ts
try {
} catch (error) {
  const err = error as Error;
  if (err) {
    err.message; //const err: Error
  }
}
```

이렇게 변수를 사용해 타입을 주장해야 타입을 계속 기억할 수 있다.
하지만 제일 좋은 방법은 as를 쓰지 않는 것이 좋다.

```ts
try {
} catch (error) {
  if (error instanceof Error) {
    error.message; //var error: Error
  }
}
```

클래스의 인스턴스이므로 instanceof로 타입 추론을 할 수 있다.
(클래스의 인스턴스인 경우만 해당)

<br>

## 2.28 원시 자료형에도 브랜딩 기법을 사용할 수 있다

2.13절을 응용해서 원시 자료형 타입에 브랜드 속성을 추가하는 기법이 있다.
예를 들어 킬로미터를 마일로 바꿔주는 함수를 만들면 다음과 같다.

```js
function kmToMile(km: number) {
  return km * 0.62;
}
const mile = kmToMile(3); // 3이라는 숫자는 킬로미터 단위인지 마일단위인지 알 수 없다. - > 더 구체적인 타입을 정할 수 있다
```

위의 코드에서 `브랜딩 기법`을 사용해 `더 구체적인 타입`을 정할 수 있다.

```ts
type Brand<T, B> = T & { __brand: B }; // T는 원래 자료형, B는 새로 만들 자료형을 의미,&는 합침
type KM = Brand<number, "km">;
type Mile = Brand<number, "mile">;
function kmToMile(km: KM) {
  return (km * 0.62) as Mile;
}
const km = 3 as KM;
const mile = kmToMile(km);
//const mile: Mile
const mile2 = 5 as Mile;
kmToMile(mile2); //Error : 'Mile' 형식의 인수는 'KM' 형식의 매개 변수에 할당될 수 없습니다. -> mile2는 Mile타입이므로 kmToMile함수 인수로 넣을 수 없다.
```

위의 코드와 같이 Brand타입으로 만들어낸 KM타입은 `type KM = number & { **brand: "km"}` 타입이고 , Mile타입은 `type Mile = number & { **brand: "mile" }`타입이다.
앞서 살펴봤던 [13절](https://github.com/swJaNG12/TypeScript-Study/blob/main/week3/hayeon.md#213-%EA%B0%9D%EC%B2%B4-%EA%B0%84%EC%97%90-%EB%8C%80%EC%9E%85%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8A%94%EC%A7%80-%ED%99%95%EC%9D%B8%ED%95%98%EB%8A%94-%EB%B2%95%EC%9D%84-%EB%B0%B0%EC%9A%B0%EC%9E%90)에 따라 number타입에 각자 다른 브랜드 속성을 추가한 것이다.
이러면 둘다 number로 같은 타입이지만 서로 구별되게 만들 수 있다.

이렇게 브랜딩 기법을 활용하면 타입을 더 정밀하게 활용하면서 안정성도 올라가므로 프로젝트에 적용하는걸 추천한다.

<br>

## 2.29 배운 것을 바탕으로 타입을 만들어보자

지금까지 배웠던 내용을 바탕으로 유용한 타입들을 만들어보자.

## 2.29.1 판단하는 타입 만들기

타입스크립트를 작성할 때는 특정 타입이 무슨타입인지 판단할 수 있어야 한다.
그래야 컨디셔널 타입을 제거할 수 있고, 타입을 추릴수 있기 때문이다.
다양한 판단 타입을 직접 만들어보자.

### IsNever

- never인지 판단하는 타입이다.
- 배열로 감싼 이유는 T에 never를 넣을 때 분배법칙이 일어나는 것을 막기 위해서이다.

```ts
type IsNever<T> = [T] extends [never] ? true : false;
type A = IsNever<string>; // false
type B = IsNever<never>; // true
```

### IsAny

- any인지 판단하는 타입이다.
- T가 any라면 number & any는 any고, string은 any를 extends할 수 있기 때문에 T가 any일 때만 true가 된다.

```ts
type IsAny<T> = string extends number & T ? true : false;
type A = IsAny<string>; // false
type B = IsAny<any>; // true
```

기본적으로 string과 number은 겹치지 않아서 extends를 할 수 없다.(T가 string,number이면 false를 반환)
T 가 any라면 number & any는 any이고, string은 any를 extends할 수 있게 된다.
따라서 T가 any일 때만 true이므로 any인지 아닌지 판단할 수 있다.

### IsArray

- 배열인지 판단하는 타입이다.

```ts
type IsNever<T> = [T] extends [never] ? true : false;
type IsAny<T> = string extends number & T ? true : false;
type IsArray<T> = IsNever<T> extends true //1.먼저 `IsNever<T>`를 사용해 T가 never인지 확인한다.
  ? false
  : T extends readonly unknown[] //2. never타입이 아니라면 T가 readonly unknown[] 타입인지 확인한다.
  ? IsAny<T> extends true // 3. any 타입이 아니면 배열로 판단
    ? false // any타입이면 false 반환
    : true // 배열로 판단
  : false; // 만약 다른 타입이면 바로 false를 반환한다.

type TestArray = IsArray<string[]>; // true
```

- `IsArray<never>`가 never이 되는 것을 막기 위해 `IsNever<T> extends true가 필요`
- `IsArray<any>`가 boolean이 되는 것을 막기 위해 `IsAny<T> extends true가 필요`
- `IsArray<readonly[]>`가 false가 되는 것을 막기 위해 `T extends readonly unknown[]이 필요`

### IsTuple

이번에는 배열 중 튜플만 판단하는 타입을 만들어보자.(튜플이 아닌 배열 타입은 false로 반환한다.)

```ts
type IsNever<T> = [T] extends [never] ? true : false;
type IsTuple<T> = IsNever<T> extends true
  ? false
  : T extends readonly unknown[]
  ? number extends T["length"] // T가 배열이고 배열의 길이 속성의 타입이 number인지 확인한다.(T가 any일 경우 any['length']는 any이므로 number extends any는 true가 된다. )
    ? false // 만약 T의 길이 속성이 number 타입이면 튜플이 아니므로 false를 반환한다.
    : true // 그렇지 않은 경우 T는 튜플이므로 true를 반환한다.
  : false; // 만약 T가 다른 타입이라면 튜플이 아니므로 false를 반환한다.
type TestTuple = IsTuple<[number]>; // true
```

- 배열의 length는 number이고, 튜플은 1,2,3 같은 개별 숫자이므로 `number extends T["length"]`에서 false여야 한다.
- T가 any일 경우 any['length']는 any이므로 number extends any는 true가 된다.

### IsUnion

- 유니언인지 판단하는 타입이다.

```ts
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnion<T, U = T> = IsNever<T> extends true
  ? false
  : T extends T // 항상 true를 반환(이렇게 사용하는 이유는 분배법칙을 만들기 위함)
  ? [U] extends [T]
    ? false
    : true
  : false;
```

- T가 string | number인 경우 T extends T는 `(string extends string | number) | (number extends string | number)`이 된다.
- U는 분배법칙이 일어나지 않은 원본 타입을 담아두고 있다.
  `[U] extends [T]`는 `[ string | number] extends [string]` 또는 `[ string | number] extends [number]` 이 된다.
  그래서 `[U] extends [T]`는 false가 되어 `IsUnion<string | number>`은 true가 된다.
  만약 T가 string이면 `[string] extends [string]`이 되어 true로 반환되므로 false가 된다.

<br>

## 2.29.2 집합 관련 타입 만들기

타입스크립트의 타입은 집합으로 생각해도 될 정도로 집합의 원리를 충실하게 따르고 있다.
다양한 집합의 연산,특성을 타입으로 나타내보자.

- 전체집합은 unknown
- 공집합은 never
- 합집합은 | 연산자
- 교집합은 & 연산자

### 차집합

A가 {name : string , age : number}, B가 {name : string , married: boolean}인 경우 차집합(A - B)하면 {age : number}이 나와야 한다.
따라서 (B - A)인 경우는 {married: boolean}이어야 한다.

```ts
type Diff<A, B> = Omit<A & B, keyof B>;
type R1 = Diff<
  { name: string; age: number },
  { name: string; married: boolean }
>;
//type R1 = { age: number}
```

### Omit

특정 객체에서 `지정한 속성을 제거하는 타입`이다.(3.2절에서 자세히 구현 원리를 알아보자)
A & B는 {name : string , age : number ,married : boolean} 인데 keyof B는 name | married이므로 , name과 married 속성을 제거하면 age속성만 남는다.

### Diff

Diff 타입을 응용해 `대칭차집합(합집합 - 교칩합)`도 찾아 낼 수 있다.

예를 들어 {name : string , age : number }를 {name : string ,married : boolean}과 대칭차집합을 하면{age : number ,married : boolean}
이 나와야 한다.
서로 겹치지 않는 부분을 합쳐놓은 것이다.

```ts
type SymDiff<A, B> = Omit<A & B, keyof (A | B)>;
type R2 = SymDiff<
  { name: string; age: number },
  { name: string; married: boolean }
>;
//type R2 = { age: number; married: boolean;}
```

다만 현재 코드에서 차집합과 대칭차집합은 객체에서만 적용 가능하다.
아래의 코드로 변경하면 `유니온에서 대칭차집합`을 적용할 수 있다.

```ts
type SymDiffUnion<A, B> = Exclude<A | B, A & B>;
type R3 = SymDiffUnion<1 | 2 | 3, 2 | 3 | 4>;
//type R3 = 1 | 4
```

### Exclude

어떤 타입(A | B)에서 다른 타입 (A & B)를 제거하는 타입이다.

### 부분집합

`A가 B타입에 대입 가능하면 A는 B의 부분집합이다.`

```ts
type IsSubset<A, B> = A extends B ? true : false;
type R1 = IsSubset<string, string | number>; //type R1 = true
type R2 = IsSubset<{ name: string; age: number }, { name: string }>;
//type R2 = true

type R3 = IsSubset<symbol, unknown>; //type R3 = true
```

### Equal

두 타입이 동일한 타입인지 판단한다.

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;
type Test = Equal<string, string>; //true
type Test1 = Equal<any, 1>; //false
type Test2 = Equal<[any], [number]>; //false
type Test3 = Equal<{ x: 1 } & { y: 2 }, { x: 1; y: 2 }>; //false
type Test4 = Equal<any, unknown>; //false
```

`(<T>() => T extends X ? 1 : 2)타입`을 `(<T>()=> T extends Y ? 1 : 2)`에 대입할 수 있는지 확인하는 코드이다.
X와Y가 같은 타입이면 `Equal<X, Y>`가 true가 된다. X == Y인 상황에서 `(<T>() => T extends X ? 1 : 2)`타입은 `(<T>()=> T extends Y ? 1 : 2)`타입과 동일하므로 extends할 수 있다.
X와Y가 다른 타입이면 `Equal<X, Y>`가 false가 된다.
X가 string, Y가 any타입으로 가정하면 T에 여러 타입을 넣어서 하나라도 false가 나오는지 확인한다. 하나만 false여도 `(<T>() => T extends string ? 1 : 2)타입`을 `(<T>()=> T extends any ? 1 : 2)`에 대입할 수 없다.

<br>

| X      |   Y    |   T    | (<T>()=> T extends X ? 1 : 2) | (<T>()=> T extends Y ? 1 : 2) | extends |
| ------ | :----: | :----: | :---------------------------: | ----------------------------- | ------- |
| string |  any   | number |               2               | 1                             | false   |
| any    | string | number |               1               | 2                             | false   |
| 1      | number |   2    |               2               | 1                             | false   |

### NotEqual

Equal과 반대로 해당 타입이 아닌지 판단하는 타입이다.

```ts
type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;
```

<br>

## 2.30 타입스크립트의 에러 코드로 검색하자

에러가 발생할 때 에러 메세지 끝 숫자 코드가 붙어있다.(에러메세지~~(숫자코드))
구글에 `TS 숫자코드`라고 검색하면 에러에 대한 해결 방법을 찾을 수 있다.
타입스크립트의 에러코드와 해결 방법을 정리한 [사이트](https://typescript.tv/errors/)도 있다.

<br>

## 2.31 함수에 기능을 추가하는 데코레이터 함수가 있다

타입스크립트 5.0에서는 데코레이터(decorator) 함수가 정식으로 추가되었다.
데코레이터는 클래스의 기능을 증강하는 함수로 `여러 함수에서 공통으로 수행되는 부분`을 데코레이터로 만들어두면 좋다.

```ts
class A {
  eat() {
    console.log("Start");
    console.log("Eat");
    console.log("End");
  }
  work() {
    console.log("Start");
    console.log("Work");
    console.log("End");
  }
  sleap() {
    console.log("Start");
    console.log("Sleap");
    console.log("End");
  }
}
```

위의 코드에서 클래스 A에 메서드에 중복되는 부분을 아래와 같이 데코레이터를 사용해 중복을 제거할 수 있다.

```ts
function startAndEnd(originalMethod: any, context: any) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log("Start");
    const result = originalMethod.call(this, ...args);
    console.log("End");
    return result;
  }
  return replacementMethod;
}

class A {
  @startAndEnd eat() {
    console.log("Eat");
  }
  @startAndEnd work() {
    console.log("Work");
  }
  @startAndEnd sleap() {
    console.log("Sleap");
  }
}
```

startAndEnd 데코레이터의 선언을 보면 originalMethod매개변수가 eat,work,sleap 같은 기존 메서드이다. 이 메서드가 대체 메서드(replacementMethod)로 바뀐다고 생각하면 된다.

replacementMethod에 따라 기존 메서드의 호출 전후로 start와 end가 로깅된다.
현재 데코레이터가 any로 타이핑되어있는데 제대로 타이핑하면 다음과 같아진다.

```ts
function startAndEnd<This, Args extends any[], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    //context: 데코레이터의 정보를 갖고 있는 매개변수, startAndEnd데코레이터가 클래스의 메서드를 장식하거 있으므로 context는 ClassMethodDecoratorContext가 된다.
    This,
    (this: This, ...args: Args) => Return
  >
) {
  function replacementMethod(this: This, ...args: Args): Return {
    console.log("Start");
    const retult = originalMethod.call(this, ...args);
    console.log("End");
    return retult;
  }
  return replacementMethod;
}
```

#### context에는 다음과 같은 종류가 있다.

- ClassDecoratorContext : 클래스 자체를 장식할 때
- ClassMethodDecoratorContext : 클래스 메서드를 장식할 때
- ClassGetterDecoratorContext : 클래스의 getter를 장식할 때
- ClassSetterDecoratorContext : 클래스의 setter를 장식할 때
- ClassMemberDecoratorContext : 클래스 멤버를 장식할 때
- ClassAccessorDecoratorContext : 클래스 accessor를 장식할 때
- ClassFieldDecoratorContext : 클래스 필드를 장식할 때

### context 객체는 다음과 같은 타입이다

```ts
type Context = {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
    has?(value: unknown): boolean;
  };
  private?: boolean;
  static?: boolean;
  addInitializer(initializer: () => void): void;
};
```

다음과 같은 속성이 있다

- kind(데코레이터의 유형, ClassDecoratorContext라면 class , ClassMethodDecoratorContext라면 method)
- name(장식 대상의 이름)
- access(has,get,set등의 접근자를 모아둔 객체)
- private(private 여부)
- static(static 여부)
- addInitializer (초기화할 때 실행되는 메서드 )

<br>
이 속성들을 활용해 장식 대상의 정보를 가져올 수 있다.

```ts
function startAndEnd(start = "start", end = "end") {
  return function RealDecorator<This, Args extends any[], Return>(
    originalMethod: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ) {
    function replacementMethod(this: This, ...args: Args): Return {
      console.log(context.name, start); // 장식 대상의 이름
      const result = originalMethod.call(this, ...args);
      console.log(context.name, end);
      return result;
    }
    return replacementMethod;
  };
}
function log<Input extends new (...arg: any[]) => any>(
  value: Input,
  context: ClassDecoratorContext
) {
  if (context.kind === "class") {
    return class extends value {
      constructor(...args: any[]) {
        super(args);
      }
      log(msg: string): void {
        console.log(msg);
      }
    };
  }
  return value;
}
function bound(
  originalMethod: unknown,
  context: ClassMethodDecoratorContext<any>
) {
  const methodName = context.name;
  if (context.kind === "method") {
    context.addInitializer(function () {
      this[methodName] = this[methodName].bind(this);
    });
  }
}
// 클래스 데코래이터
@log
export class C {
  @bound
  @startAndEnd()
  eat() {
    console.log("Eat");
  }
  @bound
  @startAndEnd()
  work() {
    console.log("Work");
  }
  @startAndEnd("시작", "끝") sleap() {
    console.log("Sleap");
  }
}

class A {
  @startAndEnd() eat() {
    console.log("Eat");
  }
  @startAndEnd() work() {
    console.log("Work");
  }
  @startAndEnd("시작", "끝") sleap() {
    console.log("Sleap");
  }
}
const a = new A();
console.log(a.sleap());
/*
sleap 시작
Sleap
sleap 끝
 */
```

class C의 eat이나 work 데코레이터처럼 여러 개 붙일 수도 있다.

<br>
다음은 올바른 데코레이터 예시이다.
클래스 데코레이터의 경우 export나 export default 앞이나 뒤에 데코레이터를 붙일 수 있고, 동시에 붙일 순 없다.

```ts
@Log
export class C {}
export
@Log
class C {}
@Log
export class C {}
```

## 2.32 엠비언트 선언도 선언 병합이 된다

만약 타입스크립트에서 남의 라이브러리를 사용할 때 그 라이브러리가 자바스크립트라면 직접 타이핑해야 하는 경우가 생긴다.
그럴 때 앰비언트 선언(ambient declaration)을 사용하면 된다.
앰비언트 선언을 위해서는 `declare 예약어`를 사용해야 한다.

```ts
declare namespace NS {
  const v: string;
}

declare enum Enum {
  ADMIN = 1,
}
declare function func(param: number): string;
declare const variable: number;
declare class C {
  constructor(p1: string, p2: string);
}
new C(func(variable), NS.v);
```

위의 코드를 보면 타입만 있고 값을 대입하지 않아도 new C나 func(variable).Ns.v처럼 값으로 사용할 수 있다. 그 이유는 외부파일에 실제 값이 존재한다고 믿기 때문이다.
주의 할 점은 외부 파일에 값이 없으면 코드를 실헹할 때 런타임 에러가 발생하기 때문에 declare로 엠비언트 선언할 때는 반드시 해당 값이 실제로 존재함을 확인해야 한다.

#### namespace와 enum은 왜 declare로 선언할까? <br>

- namespace를 declare로 선언하면 내부 멤버의 구현부를 생략할 수 있다.
  enum을 declare로 선언하면 자바스크립트로 변환할 때 실제 코드가 생성되지 않는다.
  declare를 쓰는 경우에는 이미 다른 곳에 실제 값이 있다고 생각하기 때문이다.
- 인터페이스와 타입 별칭도 declare로 선언할 수 있다.
  하지만 인터페이스와 타입 별칭은 declare로 선언하지 않아도 동일하게 작동하므로 굳이 안써줘도 된다.

```ts
declare interface Int {}
declare type T = number;
```

### 선언이 생성하는 개체

| 유형         | 네임스페이스 | 타입 | 값  |
| ------------ | :----------: | :--: | :-: |
| 네임스페이스 |      O       |      |  O  |
| 클래스       |              |  O   |  O  |
| enum         |              |  O   |  O  |
| 인터페이스   |              |  O   |     |
| 타입 별칭    |              |  O   |     |
| 함수         |              |      |  O  |
| 변수         |              |      |  O  |

- 네임스페이스로 선언한 것은 네임스페이스면서 값으로 사용할 수 있다.([2.9.2절](https://github.com/swJaNG12/TypeScript-Study/blob/main/week3/hayeon.md#292-%EB%84%A4%EC%9E%84%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4))
- 클래스나 enum은 타입으로도, 값으로도 사용할 수도 있다. ([2.2절](https://github.com/swJaNG12/TypeScript-Study/blob/main/week1/hayeon.md#22-%ED%83%80%EC%9E%85-%EC%B6%94%EB%A1%A0%EC%9D%84-%EC%A0%81%EA%B7%B9-%ED%99%9C%EC%9A%A9%ED%95%98%EC%9E%90)
  )
  <br>

### 같은 이름의 다른 선언과 병합 가능 여부

| 병합가능 여부 | 네임스페이스 | 클래스 | enum | 인터페이스 | 타입 별칭 | 함수 | 변수 |
| ------------- | :----------: | :----: | :--: | :--------: | :-------: | :--: | ---- |
| 네임스페이스  |      O       |   O    |  O   |     O      |     O     |  O   | O    |
| 클래스        |      O       |   X    |  X   |     O      |     X     |  O   | X    |
| enum          |      O       |   X    |  O   |     X      |     X     |  X   | X    |
| 인터페이스    |      O       |   O    |  X   |     O      |     X     |  O   | O    |
| 타입 별칭     |      O       |   X    |  X   |     X      |     X     |  O   | O    |
| 함수          |      O       |   O    |  X   |     O      |     O     |  O   | X    |
| 변수          |      O       |   X    |  X   |     O      |     O     |  X   | X    |

인터페이스나 네임스페이스는 같은 이름으로 여러 개 존재할 때 병합되고, 여러 번 선언할 수도 있습니다.
함수는 오버로딩되므로 여러 번 선언할 수 있습니다.

#### 선언 병합 예시

```ts
declare class A {
  constructor(name: string);
}
function A(name: string) {
  return new A(name);
}
new A("zerocho");
A("zerocho");
```

클래스가 있을 때 new를 붙이지 않아도 되게 하는 코드이다.
class A는 앰비언트 선언이고, function A는 일반 선언이다. declare로 앰비언트 선언한 타입도 병합되고, 앰비언트 선언한 타입과 그렇지 않은 타입끼리도 병합이 가능하다.

```ts
function Ex() {
  return "hello";
}

namespace Ex {
  export const a = "world";
  export type B = number;
}
Ex(); //hello
Ex.a; //world
const b: Ex.B = 123;
```

함수와 네임스페이스가 병합될 수 있으므로 위의 코드는 에러가 발생하지 않는다.
함수에 속성이 별도로 있다는 걸 알리고 싶다면 함수와 동일한 이름의 namespace를 추가하면 된다.
