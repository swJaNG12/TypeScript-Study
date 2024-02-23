# 스터디 7주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 7주차 스터디 목차

- [3.1 Partial, Required, Readonly, Pick, Record](#31-partial-required-readonly-pick-record)
  - [1. Partial](#1-partial)
  - [2. Required](#2-required)
  - [3. Readonly](#3-readonly)
  - [4. Pick](#4-pick)
  - [5. Record](#5-record)
- [3.2 Exclude, Extract, Omit, NonNullable](#32-exclude-extract-omit-nonnullable)
  - [1. Exclude](#1-exclude)
  - [2. Extract](#2-extract)
  - [3. Omit](#3-omit)
  - [4. NonNullable](#4-nonnullable)
- [3.3 Parameters, ConstructorParameters, ReturnType, InstanceType](#33-parameters-constructorparameters-returntype-instancetype)
  - [1. Parameters](#1-parameters)
  - [2. ConstructorParameters](#2-constructorparameters)
  - [3. ReturnType](#3-returntype)
  - [4. InstanceType](#4-instancetype)
- [3.4 ThisType](#34-thistype)
- [3.5 forEach 만들기](#35-foreach-만들기)
- [3.6 map 만들기](#36-map-만들기)
- [3.7 filter 만들기](#37-filter-만들기)

---

<br>

## 3.1 Partial, Required, Readonly, Pick, Record

---

Partial, Required, Readonly, Pick, Record는 타입스크립트 공식 사이트의 Reference 중 Utility Types에서 매핑된 객체 타입을 사용하는 것만 추린 것입니다.

<br>

### 1. Partial

Partial 함수는 기존 객체의 속성을 전부 옵셔널로 만듭니다.
타입스크립트에서도 기본 Partial를 제공합니다.

```ts
interface Address {
  email: string;
  address: string;
}

const you: Partial<Address> = { email: "abc12@abc.com" };
// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }
const add: Address = { email: "abc12@abc.com", address: "jn" };
```

you 의 타입인 `Partial<Address>` 타입은 Address 타입의 속성을 전부 옵셔널로 만들기 때문에 you에서 address 속성이 없어도 됩니다.

### 2. Required

타입의 속성중에 ?(옵셔널)로 있어도 되고 없어도 되는 속성이 있을 때, 이 속성이 꼭 필요할 때 Required를 붙이면 필수 타입으로 바뀌게 됩니다.

```ts
interface User {
  firstName: string;
  lastName?: string;
}

const firstUser: User = {
  firstName: "j",
};

// type Required<T> = { [P in keyof T]-?: T[P]; }
const secondUser: Required<User> = {
  firstName: "jj",
};
// Property 'lastName' is missing in type '{ firstName: string; }' but required in type 'Required<User>'.(2741)
```

secondUser 객체에는 lastName 속성이 필수가 됩니다.

### 3. Readonly

Readonly<>로 모든 속성을 readonly로 만들 수 있습니다.

```ts
interface User {
  firstName: string;
  lastName: string;
}

// type Readonly<T> = { readonly [P in keyof T]: T[P]; }
type Result = Readonly<User>;
/*
type result = {
	readonly firstName: string;
	readonly lastName: string;
}
*/
```

### 4. Pick

Pick<>으로 특정 타입에서 몇 개의 속성을 선택해서 타입을 정의할 수 있습니다.

```ts
interface Todo {
  title: string;
  desc: string;
  completed: boolean;
}

const todo: Partial<Todo> = {
  title: "clean room",
  completed: false,
};
```

Partial로 todo의 타입을 만들 수도 있습니다. Pick을 사용하면 title, completed 속성만 선택한 타입을 만들 수 있습니다.

```ts
interface Todo {
  title: string;
  desc: string;
  completed: boolean;
}

type TodoPick = Pick<Todo, "title" | "completed">;

const todo: TodoPick = {
  title: "clean room",
  completed: false,
};
/*

type TodoPick = {
	title: string;
	completed: boolean;
}
*/
```

### 5. Record

`Record<Keys, Type>`로 타입에서 속성 키가 Keys이고, 속성 값이 Type인 객체 타입을 만들 수 있습니다.

```ts
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 1, breed: "cat1" },
  boris: { age: 1, breed: "cat2" },
  mordred: { age: 1, breed: "cat3" },
};
```

<br>

## 3.2 Exclude, Extract, Omit, NonNullable

---

### 1. Exclude

Exclude 타입으로 유니언으로된 타입에서 지정한 타입을 제거한 타입을 만들 수 있습니다.

```ts
type MyUnionType = "apple" | "lemon" | "banana" | "grape";

// type MyUnionType = "apple" | "lemon" | "banana" | "grape"
let lemon: MyUnionType = "lemon";

// type Exclude<T, U> = T extends U ? never : T

let noLemon: Exclude<MyUnionType, "lemon"> = "apple";
// let noLemon: "apple" | "banana" | "grape"

let onlyApple: Exclude<MyUnionType, "lemon" | "banana" | "grape"> = "apple";
// let onlyApple: "apple"
```

### 2. Extract

`Extract<Type1, Type2>` <br>
유니언 Type1과 유니언 type2에서 일치하는 부분만 추출한 타입을 만들 수 있습니다.

```ts
type Type1 = string | number | object | null;
type Type2 = number | boolean;

// type Extract_Type = number
type Extract_Type = Extract<Type1, Type2>;
```

### 3. Omit

`Omit<Type, Key>` <br>
타입에서 특정 속성만 제거한 타입을 만들 수 있습니다.

```ts
interface Todo {
  title: string;
  desc: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "desc">;

const todo: TodoPreview = {
  title: "clean room",
  completed: false,
  createdAt: 123123,
};
/**
type TodoPreview = {
	title: string;
	completed: boolean;
	createdAt: number;
}
 */
```

### 4. NonNullable

`NonNullable<T>` <br>
유니언 타입에서 null과 undefined를 제외한 타입을 반환

```ts
type Type1 = string | number | object | null;
type Type2 = number | undefined;

type NonNullable_Type1 = NonNullable<Type1>;
// type NonNullable_Type1 = string | number | object

type NonNullable_Type2 = NonNullable<Type2>;
// type NonNullable_Type2 = number
```

<br>

## 3.3 Parameters, ConstructorParameters, ReturnType, InstanceType

---

### 1. Parameters

`Parameters<T>`는 함수를 제네릭으로 받아, `함수의 매개변수 타입을 튜플 타입으로 반환`합니다.

```ts
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any? P : never;

type FuncReturnType = {x: number; y: string; z: boolean};
function func(x: number, y: string, z: boolean}: FuncReturnType {
	return { x, y, z };
}

type Params = MyParameters<typeof func>;
// type Params = [x: number, y: string, z: boolean]
```

### 2. ConstructorParameters

`ConstructorParameters<T>` 클래스를 제네릭으로 받아, `클래스 생성자의 매개변수 타입을 튜플 타입으로 반환`합니다.

```ts
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

class User {
  constructor(public name: string, public age: number) {}
}
// type consParams = [name: string, age: number]
type consParams = MyConstructorParameters<typeof User>;
```

### 3. ReturnType

`ReturnType<T>` 함수를 제네릭으로 받아, 함수의 return 타입을 반환

```ts
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

function func(x: string): number {
  return parseInt(x);
}
// type Result = number
type Result = MyReturnType<typeof func>;
```

### 4. InstanceType

`InstanceType<T>` 클래스를 제네릭으로 받아, 클래스의 생성될 클래스의 인스턴스를 타입으로 반환합니다.

```ts
type MyInstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;

class User {
  constructor(public name: string, age: number) {}
}

/*
type Result = {
	name: string,
	age: number
}
*/
type Result = MyInstanceType<typeof User>;
```

<br>

## 3.4 ThisType

---

`ThisType<T>`은 메서드들의 this 한 번에 주입할 수 있습니다.

```ts
type Data = {
  money: number;
};

type Methods = {
  addMoney(this: Data & Methods, amount: number): void;
  useMoney(this: Data & Methods, amount: number): void;
};
type Obj = {
  data: Data;
  methods: Methods;
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

위 코드에서 Methods 안에서 메서드들의 this를 일일이 타이핑하고 있습니다.<br>
이렇게 작성하면 메서드를 추가할 때마다 `this:Data & Methods`를 추가해야 합니다.<br>

이를 ThisType으로 해결할 수 있습니다.

```ts
type Data = {
  money: number;
};
type Methods = {
  addMoney(amount: number): void;
  useMoney(amount: number): void;
};
type Obj = {
  data: Data;
  methods: Methods & ThisType<Data & Methods>;
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

메서드를 담고 있는 객체 타입인 Methods에 `ThisType<Data & Methods>`를 인터세션 합니다.<br>
이렇게 하면 this는 Data & Methods가 됩니다.

<br>

다음 절 부터는 배열의 메서드를 직접 타이핑하며 스스로 타입을 만드는 연습을 합니다.<br>
그전에 알아둬야 할 것은 100% 정확하게 타이핑하는 것은 어려운 일이니 적당히 쓸 만하게 타이핑하는 것이 중요합니다.<br>
사용하다가 에러가 발생하는 테스트 사례가 나오면 그때 고치면 됩니다.

## 3.5 forEach 만들기

---

배열의 forEach 메서드를 직접 타이핑 합니다.<br>

1.  먼저 lib.es5.d.ts에 에 있는 Array 인터페이스에 이번에 만들 myForEach를 병합시킵니다.
    ```ts
    interface Array<T> {
      // 1
      myForEach(): void;
    }
    ```
2.  myForEach 함수에 인수를 넣을 수 있게 매개변수를 타이핑합니다.
    ```ts
    interface Array<T> {
      myForEach(callback: () => void): void;
    }
    ```
3.  이제 테스트 사례를 사용해 에러가 발생하는지 확인해 보겠습니다.

    ```ts
    [1, 2, 3].myForEach((v, i, a) => {
      console.log(v, i, a);
    });
    // Argument of type '(v: any, i: any, a: any) => void' is not assignable to parameter of type '() => void'.

    [1, 2, 3].myForEach((v, i) => {
      console.log(v);
    });
    // Argument of type '(v: any, i: any) => void' is not assignable to parameter of type '() => void'.

    [1, 2, 3].myForEach((v) => 3);
    // Parameter 'v' implicitly has an 'any' type.(7006)
    // Type 'number' is not assignable to type 'void'.(2322)
    ```

4.  myForEach 함수의 callback 함수의 매개변수를 타이핑 해봅니다.

    ```ts
    interface Array<T> {
      myForEach(callback: (v: number, i: number, a: number[]) => void): void;
    }
    [1, 2, 3].myForEach((v, i, a) => {
      console.log(v, i, a);
    });
    [1, 2, 3].myForEach((v, i) => {
      console.log(v);
    });
    [1, 2, 3].myForEach((v) => 3);
    ```

    에러가 전부 사라졌습니다.

5.  또 다른 테스트 사례를 추가해 보겠습니다.

    ```ts
    interface Array<T> {
      myForEach(callback: (v: number, i: number, a: number[]) => void): void;
    }
    [1, 2, 3].myForEach((v, i, a) => {
      console.log(v, i, a);
    });
    [1, 2, 3].myForEach((v, i) => {
      console.log(v);
    });
    [1, 2, 3].myForEach((v) => 3);

    ["1", "2", "3"].myForEach((v) => {
      console.log(v.slice(0));
    });
    // Property 'slice' does not exist on type 'number'.(2339)

    [true, 2, "3"].myForEach((v) => {
      if (typeof v === "string") {
        v.slice(0);
      } else {
        v.toFixed();
      }
    });
    // Property 'slice' does not exist on type 'never'.(2339)
    ```

6.  현재 문제는 원본 배열의 타입인 매개변수 v와 a가 모두 number로 고정되어 있기 떄문에 발생합니다.<br>
    따라서 number 대신 제네릭 기반으로 타입을 수정해 볼 수 있습니다.

    ````ts
    interface Array<T> {
    myForEach(callback: (v: T, i: number, a: T[]) => void): void;
    }

        ['1','2','3'].myForEach((v) => {
        	console.log(v.slice(0));
        });

        [true, 2, '3'].myForEach((v) => {
        	if(typeof v === 'string') {
        		v.slice(0);
        	} else {
        		v.toFixed();
        	}
        });
        // Property 'toFixed' does not exist on type 'number | boolean'. Property 'toFixed' does not exist on type 'false'.(2339)
        ```

    ````

7.  이제 lib.es5.d.ts에서 타이핑한 forEach 메서드를 확인해봅시다.
    ```ts
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    ```
    원래 forEach 메서드에 있는 2번째 매개변수인 thisArg? 가 빠져있는 것을 볼 수 있습니다.
    그리고 lib.es5.d.ts의 타이핑이 완벽하지 않기 때문에 그대로 사용하면 this에서 에러가 발생합니다.<br>
    ```ts
    [1, 2, 3].forEach(function () {
      console.log(this);
    });
    // 'this' implicitly has type 'any' because it does not have a type annotation.(2683)
    ```
8.  제대로 this 타이핑하기<br>
    myForEach에서는 this 타이핑이 제대로 되게 타입을 수정해봅시다.
    `ts
 interface Array<T> {
	 myForEach<K = Window>(callback: (this: K, v: T, i: number, a: T[]) => void, thisArg?: K): void
 }
 `
    기본 forEach 메서드에서 this는 설정해주지 않으면 <br>
    브라우저에서는 Window, <br>
    node.js 에서는 Global, <br>
    strict 모드 에서는 undefined가 됩니다.

         myForEach에서는 `myForEach<K = Window>`로 선언했기에 K는 기본적으로 Window입니다. 다만, 이 타입도 정확한 타입이 아닙니다. Node.js 에서는 global이기 때문입니다.<br>

        lib.es5.d.ts에서 정확하게 타이핑하지 못한 이유도 실행 환경에 따라 this가 변하기 때문입니다.

    <br>

## 3.6 map 만들기

---

실행 환경에 따라 변하는 this를 타이핑하기 어려우니 this와 관련된 테스트없이 진행하겠습니다.

```ts
interface Array<T> {
  myMap(callback: (v: T, i: number, a: T[]) => void): void;
}

const r1 = [1, 2, 3].myMap(() => {});
const r2 = [1, 2, 3].myMap((v, i, a) => v);
const r3 = ["1", "2", "3"].myMap((v) => parseInt(v));
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myMap(function (v) {
  return v.num;
});
```

당장 에러는 없지만 myMap은 반환값이 있기 때문에 반환값의 타입도 추가해야합니다.

```ts
interface Array<T> {
  myMap<R>(callback: (v: T, i: number, a: T[]) => R): R[];
}
```

- 새로운 타입 매개변수 R 추가
- r3을 보면 callback 함수의 반환값 R이 number입니다. map은 배열을 반환하므로 R[]이 됩니다.
  <br>

## 3.7 filter 만들기

---

```ts
interface Array<T> {
  myFilter(callback: (v: T, i: number, a: T[]) => void, thisArg?: any): T[];
}

const r1 = [1, 2, 3].myFilter((v) => v < 2);
const r2 = [1, 2, 3].myFilter((v, i, a) => {});
const r3 = ["1", 2, "3"].myFilter((v) => typeof v === "string");
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myFilter(function (v) {
  return v.num % 2;
});
```

- r2은 myFilter의 콜백함수가 구현되어 있지 않기때문에 never[]이 되어야 합니다.
- r3는 myFilter가 string타입만 반환하기 하기 때문에 string[]이 되어야 합니다.

하지만 지금 r2는 number[], r3는 (string | number)[] 타입입니다.<br>
현재 myFilter는 반환값의 타입과 배열의 타입이 서로 같기 때문입니다. 새로운 타입 매개변수가 필요합니다.

```ts
interface Array<T> {
  myFilter<S extends T>(
    callback: (v: T, i: number, a: T[]) => void,
    thisArg?: any
  ): S[];
}

const r1 = [1, 2, 3].myFilter((v) => v < 2);
const r2 = [1, 2, 3].myFilter((v, i, a) => {});
const r3 = ["1", 2, "3"].myFilter((v) => typeof v === "string");
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myFilter(function (v) {
  return v.num % 2;
});
```

- S extends T 인 이유는 filter 메서드는 기존 요소에서 값을 추리는 것이기 때문에, 기존 타입을 벗어날 수 없습니다. 따라서 S가 T에 대입 가능해야 합니다.
- 하지만 이렇게 작성해도 타입스크립트는 콜백 함수의 반환값과 myFilter 메서드의 반환값 사이의 관계를 이해하지 못하기 때문에 스스로 타입을 추론할 수 없습니다.
- 이때 is 연산자를 사용해 콜백함수가 타입 서술 함수로 만들어 주면됩니다. 이렇게 하면 myFilter의 콜백함수가 타입 서술 함수가 되기 때문에 실제 사용할 때도 콜백함수를 타입 서술 함수로 만들어야 합니다.

- 추가로 타입 서술 함수는 boolean을 반환해야 하기 때문에 이 점도 반영하여 콜백함수를 수정해야 합니다.

```ts
interface Array<T> {
  myFilter<S extends T>(
    callback: (v: T, i: number, a: T[]) => v is S,
    thisArg?: any
  ): S[];
}

const r1 = [1, 2, 3].myFilter((v): v is number => v < 2);
const r2 = [1, 2, 3].myFilter((v, i, a): v is never => false);
const r3 = ["1", 2, "3"].myFilter((v): v is string => typeof v === "string");
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myFilter(function (
  v
): v is { num: number } {
  return v.num % 2 === 1;
});
```

### myFilter 메서드 오버로딩

r1, r4는 타입 서술 함수가 아니어도 추론이 잘 되었습니다. 따라서 저 둘을 타이핑할 때 타입 서술 함수로 작성할 필요가 없습니다. 이때 타입 서술 함수를 활용한 타이핑과, 타입 서술 함수가 없을 때의 타이핑을 모두 사용하고 싶다면 오버로딩을 활용할 수 있습니다.

```ts
interface Array<T> {
  myFilter<S extends T>(
    callback: (v: T, i: number, a: T[]) => v is S,
    thisArg?: any
  ): S[];
  myFilter(callback: (v: T, i: number, a: T[]) => boolean, thisArg?: any): T[];
}

const r1 = [1, 2, 3].myFilter((v) => v < 2);
const r2 = [1, 2, 3].myFilter((v, i, a): v is never => false);
const r3 = ["1", 2, "3"].myFilter((v): v is string => typeof v === "string");
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myFilter(function (v) {
  return v.num % 2 === 1;
});
```
