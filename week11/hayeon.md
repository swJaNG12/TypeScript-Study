# 스터디 11주차

### 📝 11주차 스터디 목차

- [7.1 React Hooks 분석하기](#71-react-hooks-분석하기)
- [7.1.1 useState](#711-usestate)
- [7.1.2 useRef](#712-useref)
- [7.1.3 useEffect](#713-useeffect)
- [7.1.4 useMemo , useCallback](#714-usememo--usecallback)

<br>

# 7장 React 타입 분석하기

이번 장에선 React 라이브러리의 타입을 분석해 보자. 먼저 React가 타입스크립트를 지원하는지 npmjs.com에서 패키지를 검색해 보면 이름 우측에 DT가 표시되어 있다.
DT(Definitely Typed)는 타입 정의 파일을 모아둔 온라인 저장소이므로, 자체 타입스크립트 지원은 없지만 커뮤니티 타입이 있고,@types/react 패키지를 추가로 설치해서 사용해야 한다.

```json
  "jsx": "react"
```

tsconfig.json에서 jsx 속성은 JSX 문법을 지원할지 결정하는 옵션이다. 속성 값으로 react를 입력하면 웹용 React에서 실행되는 문법으로 변환되고, react-native를 입력하면 JSX 문법이 그대로 유지되어 React-Native 플랫폼에서 실행되는 코드가 된다.

```tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
```

`React`에서 Go to Definition을 해보면 아래와 같이 정확한 타입을 확인할 수 있다.

```ts
// eslint-disable-next-line @definitelytyped/export-just-namespace
export = React;
export as namespace React;

declare namespace React {
  //...
}
```

`export = React`는 CommonJS 모듈 시스템을 따른다는 것을 의미한다. tsconfig.json에서 esModuleInterop 옵션이 활성화되어 있으므로 ECMAScript 모듈 시스템인 것 처럼 작성할 수 있었던 것이다. 이 옵션이 없었다면 다음과 같이 작성해야 한다.

```tsx
import React = require("react");
import { useState, useCallback, useRef, useEffect } from "react";
```

또는 다음 방식도 가능하다.

```tsx
import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
```

`export as namespace React`의 역할은 UMD 모듈을 위한 것으로 UMD 모듈은 스크립트 파일과 모듈 파일에서 모두 사용할 수 있어야 한다.

<br>

```tsx
import React, { useState, useCallback, useRef, useEffect } from "react";

const WordRelay = () => {
  const [word, setWord] = useState("제로초");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef(null);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      const input = inputEl.current;
      if (word[word.length - 1] === value[0]) {
        setResult("딩동댕");
        setWord(value);
        setValue("");
        if (input) {
          input.focus();
        }
      } else {
        setResult("땡");
        setValue("");
        if (input) {
          input.focus();
        }
      }
    },
    [word, value]
  );

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  return (
    <>
      {/* '--jsx' 플래그를 제공하지 않으면 JSX를 사용할 수 없습니다 */}
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input ref={inputEl} value={value} onChange={onChange} />
        <button>입력!</button>
      </form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

이 예제 코드에서 JSX 부분에서도 React는 보이지 않는데 React를 없애면 React 관련한 에러가 발생한다. tsconfig.json의 jsx 속성 값이 react인 경우 JSX문법을 React.createElement로 변경하기 때문에 <div\>는 React.createElement('div')가 되는 셈이다. <br> 즉 실제로는 React를 쓰고 있는 것이다. 이 때문에 React를 import 하지 않으면 JSX 부분에서 에러가 발생하는 것이다.
하지만 React 17버전부터 import React를 작성하지 않아도 에러가 발생하지 않는다. 그 이유는 React.createElement 대신 \_jsx로 코드를 변경하기 때문이다.
그렇다면 이번에는 \_jsx를 import 해야 한다고 추측할 수 있는데 이것은 tsconfig.json에 관련한 속성이 있다.

```json
"jsx": "react-jsx"
```

이렇게 변경하면 타입스크립트에서 알아서 \_jsx를 import 하기 때문에 에러가 발생하지 않는다.

<br>

# 7.1 React Hooks 분석하기

# 7.1.1 useState

useState 타입을 보면 오버로딩이 존재한다. 이 오버로딩은 매개변수의 유무로 구분된다. 매개변수가 있으면 첫 번째 오버로딩에 해당하고, 없다면 두 번째 오버로딩에 해당한다. 먼저 매개변수가 있을 때의 타입을 분석해 보자.

- 매개변수가 있을 때 타입

```ts
function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
```

```tsx
//...
const [word, setWord] = useState("제로초");
const [value, setValue] = useState("");
const [result, setResult] = useState("");
// (alias) useState<string>(initialState: string | (() => string)): [string, React.Dispatch<React.SetStateAction<string>>] (+1 overload)
//...
```

현재 useState는 모두 매개변수가 문자열이므로 S는 string이 되고, value도 string으로 타이핑된다.
setWord, setValue, setResult는 모두 `React.Dispatch<React.SetStateAction<string>>` 타입이다.

## Dispatch

```ts
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
```

` React.Dispatch<React.SetStateAction<string>>`이렇게 같이 쓰면 `(value:string | ((prevState :string)=> string)=>void)`가 된다. <br>
즉 매개변수로 문자열이나, 문자열을 반환하는 함수를 받으므로, `setWord('가나'),setWord((prev)=> prev + '가나')`도 가능한 것이다.

반면, useState의 두 번째 오버로딩은 어떤 경우에 사용할까?

- 매개변수가 없을 때 타입

```ts
function useState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
];
```

```tsx
const [value, setValue] = useState();
```

이 경우 value의 타입이 S의 기본값인 undefined가 되므로 활용하기 어렵기 때문에 아래와 같이 제네릭으로 타입을 표기해야 한다.

```tsx
const [value, setValue] = useState<string>(); //const value: string | undefined
```

이렇게 표기해도 value의 타입은 string | undefined이 되므로 undefined인 경우를 잘 처리해야 한다.

<br>

# 7.1.2 useRef

```ts
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```

useRef 타입도 세 가지 오버로딩이 존재한다. 먼저 MutableRefObject, RefObject 타입부터 알아보자.

## MutableRefObject, RefObject

```ts
interface MutableRefObject<T> {
  // 더 좁은 타입
  current: T;
}

interface RefObject<T> {
  // 더 넓은 타입
  /**
   * The current value of the ref.
   */
  readonly current: T | null;
}
```

`MutableRefObject`는 current 속성을 수정할 수 있고, `RefObject`는 current 속성 값이 null 일 수 있고, 속성 값을 수정할 수 없는(readonly) 객체이다. 이 둘 중 RefObject이 유니언이므로 더 넓은 타입이다. 때문에 T가 서로 같다면 `MutableRefObject<T>`는 `RefObject<T> `에 대입할 수 있다.

```tsx
//..
const inputEl = useRef();
//..
return (
  //..
  <input ref={inputEl} value={value} onChange={onChange} /> // Error
  // 'MutableRefObject<undefined>' 형식은 'LegacyRef<HTMLInputElement> | undefined' 형식에 할당할 수 없습니다.
);
```

useRef의 인수를 제공하지 않으면 inputEl는 MutableRefObject<undefined\>타입이 되고, 에러 메시지를 통해 ref 속성에는 `LegacyRef<HTMLInputElement> | undefined` 타입이 들어와야 알아냈다. <br> 즉 `MutableRefObject<undefined>`를 `LegacyRef<HTMLInputElement>`에 대입할 수 없기 때문에 에러가 발생하는 것이다.
그럼 LegacyRef은 뭘까?

## LegacyRef

```ts
interface RefAttributes<T> extends Attributes {
  ref?: LegacyRef<T> | undefined;
}
```

ref 속성에는 LegacyRef<T/> 또는 undefined 타입이 들어와야 한다.

```ts
type RefCallback<T> = {
  bivarianceHack(instance: T | null): void;
}["bivarianceHack"];

type Ref<T> = RefCallback<T> | RefObject<T> | null;
type LegacyRef<T> = string | Ref<T>;
```

`LegacyRef`는 string이거나 Ref이고, `Ref`는 다시 RefCallback<T> 이거나 RefObject<T> 이거나 null이다. `RefCallback`은 ["bivarianceHack"]이 붙었으므로 인덱스 접근 타입이다.
즉, (instance: T | null): void 함수 타입이다.

```tsx
//..
const inputEl = useRef(null); //inputEl: React.MutableRefObject<null>
//..
return (
  //..
  <input ref={inputEl} value={value} onChange={onChange} /> // Ok
);
```

useRef(null)은 MutableRefObject<null\>이므로 RefObject<HTMLInputElement\> 에도 대입할 수 있고, LegacyRef<HTMLInputElement\>에도 대입할 수 있기 때문에 에러가 발생하지 않는다. 이때 MutableRefObject<null\>으로 첫 번째 오버로딩에 해당하는 이유는 오버로딩에 해당할 수 있다면 순서 대로 제일 먼저 나온 오버로딩에 해당하기 때문이다.
두 번째 오버로딩에 해당하고 싶다면 다음과 같이 타이핑해야 한다.

```tsx
const inputEl = useRef<HTMLInputElement>(null);
// React.RefObject<HTMLInputElement>

const input = inputEl.current;

if (input) {
  input.focus();
}
```

이렇게 하면 T는 HTMLInputElement으로 initialValue가 null이므로 첫 번째 오버로딩에 해당할 수 없다. 따라서 두 번째 오버로딩에 해당하기 때문에 inputEl의 타입은
RefObject<HTMLInputElement\>이 된다.

따라서 input은 inputEl.current가 된다. 그냥 useRef(null)만 하면 inputEl.current가 null이 되어 input.focus()에 에러가 발생했지만, useRef<HTMLInputElement\>(null); 이렇게 바꾸면 inputEl.current는 HTMLInputElement 또는 null이 된다.
또한, input을 if 을 통해 타입 좁히기가 되어 null이 아니므로 HTMLInputElement가 되고, focus 메서드를 사용할 수 있게 된 것이다.

<br>

# 7.1.3 useEffect

```ts
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

## EffectCallback, DependencyList

```ts
type DependencyList = readonly unknown[];
type EffectCallback = () => void | Destructor;
```

EffectCallback은 void나 Destructor을 반환하는 함수이고, DependencyList는 unknown 요소인 readonly 배열이다.

## Destructor

```ts
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
```

`Destructor`은 void나 { [UNDEFINED_VOID_ONLY]: never }를 반환하는 함수이다.
`UNDEFINED_VOID_ONLY`는 unique symbol 타입으로 const나 클래스의 static readonly 속성에 symbol을 대입한 경우 저절로 unique symbol이 된다.

Destructor 함수(useEffect의 return에 있는 함수)는 void나 undefined만 반환해야 한다.

```tsx
useEffect(() => {
  //'() => string' 형식은 'void | Destructor' 형식에 할당할 수 없습니다.
  console.log("useEffect");
  return () => {
    return "no";
  };
}, []);
```

이렇게 문자열을 반환하는 경우 에러가 발생한다.
하지만 () => void | { [UNDEFINED_VOID_ONLY]: never }이렇게 한 이유는 바로 strictNullChecks 옵션을 사용하지 않는 경우를 대비하기 위해서이다.
strictNullChecks 옵션을 비활성화하면 그냥 void와 같아진다. 그럼 반환값의 무시하고, 어떠한 값이든 반환값으로 사용할 수 있게 되므로 () => void | { [UNDEFINED_VOID_ONLY]: never }를 사용하는 것이다. <br>
즉, 모든 경우에서 void와 undefined를 제외한 값을 반환값으로 쓰지 못하게 하는 기법이다.

<br>

# 7.1.4 useMemo , useCallback

```ts
function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
function useMemo<T>(factory: () => T, deps: DependencyList): T;
```

useCallback의 첫 번째 매개변수는 함수이고, 두 번째 매개변수는 DependencyList이다.
DependencyList는 앞에서 봤던 useEffect의 DependencyList와 동일한 타입이다.
`T extends Function`으로 제약을 두면 매개변수의 타입을 지정하지 않으면 any로 추론되므로 noImplicitAny 에러가 발생한다. 따라서 직접 타이핑해야 하는 매개변수이다.
예제 코드에서도 T extends Function이므로 useCallback에서 에러가 발생한다.
onSubmitForm, onChange와 같이 변수 값이 함수인 경우 변수 자체에 타이핑하는 것이 조금 더 좋은 방법일 수 있다. 매개변수와 반환값의 한 번에 타이핑할 수 있기 때문이다.
어떤 타입을 표기해야 하는지 알기 위해 onSubmit과 onChange 속성의 타입을 확인해야 한다.

```ts
  onSubmit?: FormEventHandler<T> | undefined;
  onChange?: ChangeEventHandler<T> | undefined;
```

그럼 다음과 같이 `변수 자체`에 타입을 지정할 수 있다.

```tsx
const onSubmitForm: FormEventHandler<HTMLFormElement> = useCallback((e) => {
  e.preventDefault();
  //..
});

const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
  setValue(e.currentTarget.value);
}, []);
```

이번에는 `매개변수만 타이핑`하는 방식을 알아보자.
다만, FormEventHandler,ChangeEventHandler의 매개변수가 무엇인지 알아야 한다.

```ts
type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
```

`EventHandler<FormEvent<T>`를 조합하면 `(event : FormEvent<T>) : void`가 되고, ` EventHandler<ChangeEvent<T>`를 조합하면 `(event : ChangeEvent<T>) : void`가 된다.
마지막으로 useCallback은 callback으로 받은 T 함수를 그대로 반환하기 때문에 다음과 같이 타입을 지정해 줄 수 있다.

```tsx
const onSubmitForm = useCallback((e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  //..
});

const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.currentTarget.value);
}, []);
```

onSubmitForm 변수는 useCallback을 거쳐도 ` EventHandler<FormEvent<HTMLFormElement>>`이므로 `FormEventHandler<HTMLFormElement>`가 되어 form의 onSubmit 속성에 대입할 수 있다. onChange 변수도 마찬가지로 `EventHandler<ChangeEvent<HTMLInputElement>>`이므로 `FormEventHandler<HTMLInputElement>`가 되어 input의 onChange 속성에 대입할 수 있다.
