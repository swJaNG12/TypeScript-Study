# 스터디 11주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 11주차 스터디 목차

- [7 React 타입 분석하기](#7-react-타입-분석하기)
  - [react 모듈 시스템](#react-모듈-시스템)
  - [export as namespace = React](#export-as-namespace--react)
  - [import React from 'react'](#import-react-from-react)
- [7.1 React Hooks 분석하기](#71-react-hooks-분석하기)
  - [7.1.1 useState](#711-usestate)
  - [7.1.2 useRef](#712-useref)
  - [7.1.3 useEffect](#713-useeffect)
  - [7.1.4 useMemo, useCallback](#714-usememo-usecallback)

# 7 React 타입 분석하기

test.tsx

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
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input type="text" ref={ipnutEl} value={value} onChange={onChange} />
        <button>입력</button>
      </form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

'--jsx' 플래그를 제공하지 않으면 JSX를 사용할 수 없습니다.ts(17004)<br>
jsx 부분에서 발생하는 위 에러는 tsconfig.json에서 "jsx" 옵션을 설정하면 해결됩니다.
tsconfig.json

```json
"jsx": "react"
```

<br>

## react 모듈 시스템

node_modules/@types/react/index.d.ts

```ts
export = React
export as namespace = React;
```

`export = React` 이 부분은 React가 CommonJS 모듈 시스템을 따른다는 것을 의미합니다. tsconfig.json에서 exModuleInterop 이 활성화되어 있어 ECMAScript 모듈 시스템 처럼 작성할 수 있습니다.

## export as namespace = React

UMD 모듈을 위한 것입니다. 스크립트 파일에서 사용할 수 있습니다.<br>
<br>
script.ts

```ts
type A = React.ElementType;
```

React 네임스페이스를 바로 사용할 수 있습니다.

## import React from 'react'

test.tsx 에서 React를 사용하고 있지 않은데 import React를 작성하는 이유가 뭘까요? React를 지우면 jsx 부분에서 에러가 발생합니다.

타입스크립트는 tsconfig.json의 jsx 속성 값이 react인 경우 JSX 문법을 React.createElement로 변경합니다. `<div>`는 React.createElement('div')가 되는 셈입니다. 실제로는 React를 쓰고 있으니 없으면 에러가 발생합니다.

<br>

## 7.1 React Hooks 분석하기

useState, useEffect, useCallback, useMemo, useRef 리액트 훅의 타입을 분석합니다.

index.d.ts

```ts
declare namespace React {
  function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ];
  function useRef<T>(initialValue: T): MutableRefObject<T>;
  function useRef<T>(initialValue: T | null): RefObject<T>;
  function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  function useCallback<T extends Function>(
    callback: T,
    deps: DependencyList
  ): T;
}
```

<br>

### 7.1.1 useState

useSatate는 오버로딩이 존재합니다.

```ts
declare namespace React {
  // 매개변수가 있을 경우
  function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];

  // 매개변수가 없을 경우
  function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ];
}
```

test.tsx

```tsx
const [word, setWord] = useState("제로초");
const [value, setValue] = useState("");
const [result, setResult] = useState("");
```

현재 useState에는 전부 문자열 인수가 들어갑니다. 따라서 S는 string입니다.<br>
setWord, setValue, setResult 는 `Dispatch<SetStateAction<S>>` 입니다.

```ts
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
```

`SetStateAction<string> = string | ((prevState: string) => string)` 이고<br>
최종적으로 `(value: string | ((prevState: string) => string)) => void` 가 됩니다.

매개변수로 문자열이나, 문자열을 반환하는 함수를 받으므로 setWord('가나다'), setWord((prev) => prev + '가가') 를 할 수 있습니다.

<br>

### 7.1.2 useRef

```ts
declare namespace React {
  function useRef<T>(initialValue: T): MutableRefObject<T>;
  function useRef<T>(initialValue: T | null): RefObject<T>;
  function useRef<T = undefined>(): MutableObject<T | undefined>;
}
```

useRef타입을 분석하기 위해 MutableRefObject, RefObject도 분석해야 합니다.

```ts
declare namespace React {
  interface MutableRefObject<T> {
    current: T;
  }
  interface RㄷfObject<T> {
    readonly current: T | null;
  }
}
```

- RefObject의 current가 더 넓은 타입
- T가 같다면 `MutableRefObject<T>`는 `RefObject<T>`에 대입할 수 있습니다.

현재 test.tsx에서 useRef(null)로 사용하고 있습니다. null을 제공하지 않으면 에러 메시지가 나옵니다.

```
'MutableRefObject<undefined>' 형식은 'LegacyRef<HTMLInputElement> | undefined' 형식에 할당할 수 없습니다.
  'MutableRefObject<undefined>' 형식은 'RefObject<HTMLInputElement>' 형식에 할당할 수 없습니다.
    'current' 속성의 형식이 호환되지 않습니다.
      'undefined' 형식은 'HTMLInputElement | null' 형식에 할당할 수 없습니다.ts(2322)
```

useRef() 를 하면 inputEl은 `MutableRef<undefined>`이 되고, input 태그의 ref는 `LegacyRef<HTMLInputElement> | undefined` 타입이 들어와야 한다는 것을 알 수 있습니다.

```ts
declare namespace React {
  interface ClassAttributes<T> extends Attributes {
    ref?: LegacyRef<T> | undefined;
  }
}
```

ref 속성은 `LegacyRef<T>` 타입 또는 undefined 타입이 들어와야 합니다.

```ts
declare namespace React {
  type RefCallback<T> = {
    bivarianceHack(instance: T | null): void;
  }["bivarianceHack"];
  type Ref<T> = RefCallback<T> | RefObject<T> | null;
  type LegacyRef<T> = string | Ref<T>;
}
```

LegacyRef는 string 이거나 Ref, Ref는 `RefCallback<T> | RefObject<T> | null` 입니다.

`LegacyRef<HTMLInputElement>` 에는 `RefObject<HTMLInputElement>`가 있습니다. `RefObject<HTMLInputElement>`는
readonly current: HTMLInputElement | null 입니다.<br>
`MutableRefObject<undefined>`의 current는 current: undefined 이므로 대입할 수 없기 때문에 에러가 발생합니다.

```ts
declare namespace React {
  function useRef<T>(initialValue: T): MutableRefObject<T>;
  function useRef<T>(initialValue: T | null): RefObject<T>;
  function useRef<T = undefined>(): MutableObject<T | undefined>;
}
```

useRef(null)을 사용하면 첫번째 오버로딩에 해당합니다. 그래서 currnet 는 null이 되고, const input = inputEl.current; 에서 input은 null 이 되므로 input.focus() 에서 에러가 발생합니다.

이를 해결하려면 두 번째 오버로딩을 사용합니다. `useRef<HTMLInputElement>(null)` 을 사용하면 T는 HTMLInputElement, initialvalue: null 이므로 `RefObject<null>` 이 되고 currnet 는 HTMLInputElement | null 이 됩니다.

<br>

### 7.1.3 useEffect

```ts
declare namespae React {
	function useEffect(effect: EffectCallback, deps?: DependencyList): void;
}
```

```ts
declare namespace React {
  type DependencyList = ReadonlyArray<unknown>;

  type EffectCallback = () => void | Destructor;
}
```

```ts
declare const UNDEFINED_VOID_ONLY: unique symbol;
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
```

- EffectCallback 는 void나 Destructor를 반환하는 함수,
- DependencyList 는 readonly 배열
- Destructor 는 void나 { [UNDEFINED_VOID_ONLY]: never }를 반환하는 함수
- UNDEFINED_VOID_ONLY 는 unique symbol

{ [UNDEFINED_VOID_ONLY]: never }는 무슨 의미일까요?

Destructor 함수는 void나 undefined만 반환해야 합니다.

```ts
() => void | { [UNDEFINED_VOID_ONLY] : never }
```

이렇게 작성하면 반환값이 void와 undefined로 제한됩니다.

```ts
() => void | undefined
```

이렇게 작성하지 않은 이유는 strictNullChecks 옵션을 사용하지 않는 경우를 대비하기 위해서입니다. 타입스크립트에서 strictNullChecks 옵션을 비활성화하면 null과 undefined 타입이 다른 모든 타입에 자동으로 포함됩니다. 즉, strictNullChecks가 비활성화되어 있을 때는 모든 타입이 암묵적으로 null 또는 undefined를 값으로 가질 수 있게 되어, null과 undefined를 명시적으로 타입에 포함시킬 필요가 없어집니다. 따라서, strictNullChecks를 비활성화하면 void | undefined의 조합이 의미가 없어지며, 이는 단순히 void로 취급됩니다.

<br>

### 7.1.4 useMeMo, useCallback

```ts
declare namespace React {
  function useCallback<T extends Function>(
    callback: T,
    deps: DependencyList
  ): T;
  function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
}
```

1. useCallback

- 첫 번째 매개변수 : 함수
- 두 번째 매개변수 : DependencyList 배열

T extends Function 으로 제약을 둔 이유

```ts
type DependencyList = ReadonlyArray<unknown>;

declare function useArrowFunctionCallback<
  T extends (...args: unknown[]) => unknown
>(callback: T, deps: DependencyList): T;
declare function useFunctionCallback<T extends Function>(
  callback: T,
  deps: DependencyList
): T;

const functionCallback = useFunctionCallback((test) => {
  // Error
  console.log(test);
}, []);

const arrowFunctionCallabck = useArrowFunctionCallback((test) => {
  console.log(test);
}, []);
```

T extends Fuction 이 아니라 T extends (...args: unknown[]) => unknown 로 작성하면 매개변수에서 에러가 발생하지 않습니다. 그 이유는 매개변수가 unknown으로 추론이 되기 때문에 직접 타이핑해야 하는 매개변수 부분에서 에러가 발생하지 않기 때문입니다.
<br>

2. useMemo

- 첫 번째 매개변수 : 함수
- 두 번째 매개변수 : deps: DependencyList 배열 | undefined
  - useMemo를 사용할 때 두 번째 매개변수를 빼먹는 실수를 방지하기 위해 의도적으로 옵셔널로 만들지 않았습니다. 의도적으로 생략하려면 undefined를 사용하도록 유도한 것입니다.

```tsx
import React, { useState, useCallback, useRef, useEffect } from "react";

const WordRelay = () => {
  const [word, setWord] = useState("제로초");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef<HTMLInputElement>(null);

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
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input type="text" ref={inputEl} value={value} onChange={onChange} />
        <button>입력</button>
      </form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

현재 코드의 useCallback에서 에러가 발생하는 이유는 T extends Fucntion 때문입니다. e에 타이핑해야 합니다.

변수의 값이 함수인 경우 변수 자체에 타이핑하는 것이 매개변수와 반환값을 한 번에 타이핑할 수 있기 때문에 조금 더 좋을 수 있습니다.

```tsx
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
```

```ts
onChange?: FormEventHandler<T> | undefined;
onSubmit?: FormEventHandler<T> | undefined;
```

```ts
declare namespace React {
  interface InputHTMLatrributes<T> extends HTMLAttributes<T> {
    onChange?: ChangeEventHandler<T> | undefined;
  }
}
```

onChange와 onSubmit은 각각 input과 form의 속성이므로 T는 HTMLInputElement, HTMLFormElement 입니다.

```tsx
const onSubmitForm: FormEventHandler<HTMLFormElement> = useCallback(
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

const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
  setValue(e.currentTarget.value);
}, []);
```

<br>

매개변수만 타이핑하는 방법

매개변수 e에 타이핑하려면 FormEventHandler, ChangeEventHandler의 매개변수가 무엇인지 알아야합니다.

```ts
declare namespae React {
	type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];
	type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
  type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
}
```

(event: FormEvent): void, (event: ChangeEvent)L void 입니다.

```tsx
const onSubmitForm = useCallback(
  (e: FormEvent<HTMLFormElement>) => {
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

const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.currentTarget.value);
}, []);
```
