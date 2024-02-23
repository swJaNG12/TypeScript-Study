# 스터디 7주차

### 📝 7주차 스터디 목차

## 목차

## 목차

- [3.1 Partial, Required, Readonly, Pick, Record](#31-partial-required-readonly-pick-record)
- [3.2 Exclude, Extract, Omit, NonNullable](#32-exclude-extract-omit-nonnullable)
- [3.3 Parameters, ConstructorParameters, ReturnType, InstanceType](#33-parameters-constructorparameters-returntype-instancetype)
- [3.4 ThisType](#34-thistype)
- [3.5 forEach 구현하기](#35-foreach-구현하기)
- [3.6 map 구현하기](#36-map-구현하기)
- [3.7 filter 구현하기](#37-filter-구현하기)

<br>

# 3.1 Partial,Required, Readonly , Pick, Record

## Partial

- 기존 객체의 속성을 전부 옵셔널로 만드는 함수

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P]; // 기존 객체의 속성을 전부 옵셔널 수식어를 추가해 붙이고 있음
};

type Result = MyPartial<{ a: string; b: number }>; // 따라서 모든 객체의 속성이 옵셔널로 바뀜
/*
type Result = {
    a?: string | undefined;
    b?: number | undefined;
}*/
```

## Required

- 반대로 모든 속성을 옵셔널이 아니게 만들 수 도 있다.

```ts
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

type Result = MyRequired<{ a?: string; b?: number }>;
/*
type Result = {
    a: string;
    b: number;
}
}*/
```

## Readonly

- readonly가 아니게 만들수 있다.

```ts
type MyReadonly<T> = {
  -readonly [P in keyof T]: T[P];
};

type Result = MyReadonly<{ readonly a: string; readonly b: number }>;
/*
type Result = {
    a: string;
    b: number;
}
}*/
```

## Pick

- 객체에서 지정한 속성만 추릴 수 있다.

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Result = MyPick<{ a: string; b: number; c: number }, "a" | "b">;
// a | b | c 에서 -> a | b 만 추릴 수 있게 함
/*
type Result = {
    a: string;
    b: number;
}
}*/
```

- 속성이 아닌 경우 에러

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Result = MyPick<{ a: string; b: number; c: number }, "a" | "b" | "d">; // Error : '"d"' 형식은 '"a" | "b" | "c"' 형식에 할당할 수 없습니다.
// a | b | c 에서 -> 속성이름이 아닌 d를 쓰면 에러가 발생한다.
/*
type Result = {
    a: string;
    b: number;
}
}*/
```

- 속성이 아닌 경우 무시 가능

```ts
type MyPick<T, K> = {
  [P in K extends keyof T ? K : never]: T[P];
};
type Result = MyPick<{ a: string; b: number; c: number }, "a" | "b" | "d">; // OK
//  매핑된 객체 타입과 컨디셔널 타입을 같이 사용해주면  "a" | "b" | "d"는 제너릭(K)이자 유니언이므로 분배법칙이 실행된다. 즉 "d" 속성이 아닌 경우에 무시하고 나머지 속성만 가져올 수 있다.
```

- 주의 할 점

```ts
type MyPick<T, K> = {
  [P in K extends keyof T ? K : never]: T[P];
};
type Result = MyPick<{ a: string; b: number; c: number }, "d">; // OK
//type Result = {} // 여기서 속성에 없는 d는 무시되므로 에러가 발생하지않지만, Result의 타입이 {}(null , undefined를 제외한 모든 값)이 되기때문에 의도와 다르게 추론된다.
const result: Result = { a: "이게 되네?" };
```

## Record

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};
type Result = MyRecord<"a" | "b", string>;
/*
type Result = {
    a: string;
    b: string;
}
*/
```

- `K extends keyof any`를 통해 `K`에 string | number | symbol 로 제약을 걸었을 때 제약은 가능하면 엄격하게 거는 것이 좋다
  속성 이름으로 사용할 수 없는 값을 K로 제공하는 실수를 막을 수 있기 때문이다.
  <br>

# 3.2 Exclude , Extract , Omit , NonNullable

- 이 절에서 배우는 타입은 모두 분배법칙을 활용하는 타입이다.

## Exclude

- 어떠한 타입에 지정한 타입을 제거하는 타입

```ts
type MyExclude<T, U> = T extends U ? never : T;
type Result = MyExclude<1 | "2" | 3, string>;
/*
type Result = 1 | 3
*/
```

## Extract

- 어떠한 타입에 지정한 타입만 추출해내는 타입 (Excluded타입과 반대)

```ts
type MyExtract<T, U> = T extends U ? T : never; // 컨디셔널 타입의 참,거짓 부분만 서로 바꾸면 된다.
type Result = MyExtract<1 | "2" | 3, string>;
/*
type Result = "2"
*/
```

## Omit

- 특정 객체에서 지정한 속성을 제거하는 타입(Pick타입과 반대되는 타입이지만 Pick과 Exclude타입을 활용한다.)

```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type Result = MyOmit<{ a: "1"; b: 2; c: true }, "a" | "c">; //a,c 제거
/*
type Result = { b만 남음
    b: 2;
}
*/
```

- 먼저 `Exclude<keyof T, K>`로 지정한 속성을 제거 -> b만 추려짐
- Pick타입을 통해 객체에서 추려진 속성을 선택 -> 최종적으로 b 속성만 객체 타입에 남게됨

## NonNullable

- null과 undefined를 제거하는 NonNullable타입

```ts
type MyNonNullable<T> = T extends null | undefined ? never : T;
type Result = MyNonNullable<string | number | null | undefined>;
/*
type Result = string | number
*/
```

- 이렇게 더 간단히 변경가능

```ts
type MyNonNullable<T> = T & {};
type Result = MyNonNullable<string | number | null | undefined>;
/*
type Result = string | number
*/
```

## Optional ??

- 일부 속성만 옵셔널로 만드는 타입

```ts
type MyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Result = MyOptional<{ a: "hi"; b: 123 }, "a">;

/*

type Result = Omit<{
    a: 'hi';
    b: 123;
}, "a"> & Partial<Pick<{
    a: 'hi';
    b: 123;
}, "a">>
*/
```

<br>

# 3.3 Paramerters , ConstructorParamerters ,ReturnType, InstanceType

이번 절에선 infer를 활용한 타입들을 알아보자.

## Paramerters

```ts
type MyParameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

## ConstructorParamerters

```ts
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
```

## ReturnType

```ts
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

## InstanceType

```ts
type MyInstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;
//new (...args: any) => any는 모든 생성자 함수를 의미하는 타입
// abstract new (...args: any) => any 추상클래스 까지 포함하는 타입
```

<br>

# 3.4 ThisType

- 메서드들에 this를 한방에 주입하는 타입이다.

```ts
type Data = { money: number };
type Methods = {
  addMoney(amount: number): void;
  useMoney(amount: number): void;
};
type Obj = {
  data: Data;
  methods: Methods & ThisType<Data & Methods>; // Methods에 ThisType<Data & Methods를 인터섹션하면 this는 Data & Methods가 된다.
};
const obj: Obj = {
  data: {
    money: 0,
  },
  methods: {
    addMoney(amount) {
      this.money += amount;
    },
    useMoney(amount) {
      this.money -= amount;
    },
  },
};
```

<br>

# 3.5 forEach 만들기

- 콜백 함수를 전달할 때는 각 매개변수의 타입을 명시해야함

```ts
[1, 2, 3].myForEach(() => {});
interface Array<T> {
  myForEach(callback: (v: number, i: number, a: number[]) => void): void;
} // forEach 메서드의 콜백 함수는 매개변수틔 타입을 써줌
[1, 2, 3].myForEach((v, i, a) => {
  console.log(v, i, a);
});
["1", "2", "3"].myForEach((v) => {
  console.log(v.slice(0)); // Error: 매개변수 v와 a가 모두 number 기반으로 고정되어있기 때문에 에러가 발생한다.따라서 number 대신 제네릭 기반으로 타입을 수정해야함
});
```

- number 대신 제네릭을 사용해 콜백 함수의 매개변수 타입을 유연하게 만들어야 한다.

```ts
[1, 2, 3].myForEach(() => {});
interface Array<T> {
  myForEach(callback: (v: T, i: number, a: T[]) => void): void;
} // forEach 메서드의 콜백 함수는 매개변수틔 타입을 써줌
[1, 2, 3].myForEach((v, i, a) => {
  console.log(v, i, a);
});
["1", "2", "3"].myForEach((v) => {
  console.log(v.slice(0)); //OK
});
```

```ts
[1, 2, 3].myForEach(() => {});
interface Array<T> {
  myForEach(callback: (v: T, i: number, a: T[]) => void, thisArg?: any): void;
}
//thisArg?: any라는 두 번째 매개변수
// 실제로 실행시 this의 타입이 number로 추론되지 않았기 때문에 에러가 발생한다.
[1, 2, 3].forEach(function () {
  console.log(this); // Error: 'this' implicitly has type 'any' because it does not have a type annotation.
});
```

<br>

# 3.6 map 만들기

- 반환값이 어떤 타입이 될지 미리 알 수 없기 때문에 제네릭 타입 매개변수로 선언해야 한다.

```ts
interface Array<T> {
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[];
}
```

<br>

# 3.7 filter 만들기

- 반환값의 타입이 배열의 타입과 달라지게 되므로 새로운 타입 매개변수가 필요하기 때문에
  `myFilter<S extends T>`로 선언한다.
  `S extends T`인 이유는 새로운 타입 매개변수는 배열 요소의 타입에 대입할 수 있어야 하기 때문이다.

```ts
interface Array<T> {
  myForEach(callback: (v: T, i: number, a: T[]) => void): void;
  myMap<U>(callback: (value: T, index: number, array: T[]) => U): U[];
  myFilter<S extends T>(
    callback: (v: T, i: number, a: T[]) => v is S,
    thisArg?: any
  ): S[];
  myFilter(callback: (v: T, i: number, a: T[]) => boolean, thisArg?: any): T[];
}
```

- `(v: T, i: number, a: T[]) => boolean `
  - 배열의 각 요소를 평가하여 boolean을 반환한다.
- `(v: T, i: number, a: T[]) => v is S`
  - 타입 가드를 사용하여 배열의 각 요소를 평가한다.
  - 반환값 부분에 `is 연산자`로 콜백 함수가 참을 반환할 때 해당 요소를 타입 S로 캐스팅할 수 있는지 확인한다.
