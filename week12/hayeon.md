# 스터디 12주차

### 📝 12주차 스터디 목차

- [7.2 JSX 타입 이해하기](#72-jsx-타입-이해하기)
  - [7.2.1 JSX](#721-jsx)
  - [7.2.2 DetailedHTMLProp](#722-detailedhtmlprop)
    - [HTMLAttributes](#htmlattributes)
    - [ClassAttributes](#classattributes)
  - [7.2.3 FormHTMLAttributes,InputHTMLAttributes](#723-formhtmlattributesinputhtmlattributes)
  - [7.2.4 HTMLFormElement](#724-htmlformelement)
    - [BaseSyntheticEvent](#basesyntheticevent)
  - [7.2.5 컴포넌트 타입](#725-컴포넌트-타입)
    - [ReactNode](#reactnode)
    - [FunctionComponent](#functioncomponent)
- [7.3 React 직접 타이핑하기](#73-react-직접-타이핑하기)

# 7.2 JSX 타입 이해하기

이번 장에선 JSX 타입에 대해 알아보자. html 태그에 Go to Definition을 하면 아래와 같이 JSX 타입으로 이동한다.

## 7.2.1 JSX

```ts
// node_module/@types/react/index.d.ts

declare global {
  /**
   * @deprecated Use `React.JSX` instead of the global `JSX` namespace.
   */
  namespace JSX {
    type ElementType = string | React.JSXElementConstructor<any>;
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    type LibraryManagedAttributes<C, P> = C extends
      | React.MemoExoticComponent<infer T>
      | React.LazyExoticComponent<infer T>
      ? T extends
          | React.MemoExoticComponent<infer U>
          | React.LazyExoticComponent<infer U>
        ? ReactManagedAttributes<U, P>
        : ReactManagedAttributes<T, P>
      : ReactManagedAttributes<C, P>;

    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
    interface IntrinsicElements {
      // HTML
      a: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      //..
      input: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;

      form: React.DetailedHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >;
    }
  }
}
```

`declare global`은 모듈 파일 안에서 `전역 타입`을 만드는 선언 방식이다. 현재 declare global 안에 `namespace JSX`가 있는데, 이렇게 하면 import 없이도 JSX.Element, JSX.IntrinsicElements 등을 자유롭게 사용할 수 있다. <br>
위의 코드를 보면 form은 `JSX.IntrinsicElements.form`이고, input은 `JSX.IntrinsicElements.input`임을 알 수 있다. 모두 `React.DetailedHTMLProp`로 되어 있는데 더 자세히 확인해 보자.

## 7.2.2 DetailedHTMLProp

```ts
// DetailedHTMLProps
declare namespace React {
  //..
  type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> &
    E;
  //..
}
```

HTMLAttributes, ClassAttributes는 다음과 같다.

### HTMLAttributes

```ts
// HTMLAttributes
interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // React-specific Attributes
  defaultChecked?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  suppressContentEditableWarning?: boolean | undefined;
  suppressHydrationWarning?: boolean | undefined;
  //...
}
```

`HTMLAttributes`에는 HTML에서 사용할 수 있는 속성이 모여있다. `DOMAttributes`를 상속하고 있는데 DOMAttributes는 다음과 같다.

```ts
// DOMAttributes
interface DOMAttributes<T> {
  children?: ReactNode | undefined;
  dangerouslySetInnerHTML?:
    | {
        __html: string | TrustedHTML;
      }
    | undefined;
  //..
  // Form Events
  onChange?: FormEventHandler<T> | undefined;
  onSubmit?: FormEventHandler<T> | undefined;
  //..
}
```

`DOMAttributes`는 `children`과 `dangerouslySetInnerHTML`와 같은 React 전용 속성과 onChange, onSubmit 같은 `DOM 이밴트`를 담고 있다.

<br>

### ClassAttributes

```ts
//ClassAttributes
interface ClassAttributes<T> extends RefAttributes<T> {}

// RefAttributes
interface RefAttributes<T> extends Attributes {
  ref?: LegacyRef<T> | undefined;
}
//Attributes
interface Attributes {
  key?: Key | null | undefined;
}
```

`ClassAttributes`는 React의 컴포넌트라면 속성으로 가질 수 있는 `key`와 `ref`를 갖고 있다.

따라서 `React.DetailedHTMLProps`는 `HTMLAttribute`룰 제약으로 두고 있는 `E`와 `ClassAttributes`의 인터섹션이므로 `E가 정확히 무엇이냐`에 따라 form과 input의 속성이 정해진다.

- 'JSX.IntrinsicElements.form'의 `E`는 `FormHTMLAttributes<HTMLFormElement>`
- 'JSX.IntrinsicElements.input'의 `E`는 `InputHTMLAttributes<HTMLInputElement>`
  따라서 FormHTMLAttributes와 InputHTMLAttributes를 확인해 보자.

## 7.2.3 FormHTMLAttributes,InputHTMLAttributes

- FormHTMLAttributes

```ts
// FormHTMLAttributes
interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
  acceptCharset?: string | undefined;
  action?:
    | string
    | undefined
    | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS];
  autoComplete?: string | undefined;
  encType?: string | undefined;
  method?: string | undefined;
  name?: string | undefined;
  noValidate?: boolean | undefined;
  target?: string | undefined;
}
```

- InputHTMLAttributes

```ts
//InputHTMLAttributes
interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
  accept?: string | undefined;
  alt?: string | undefined;
  //..
  onChange?: ChangeEventHandler<T> | undefined;
}
```

둘 모두 `HTMLAttributes`를 상속하면서 form과 input 태그에만 사용할 수 있는 속성을 따로 모아두었다.

<br>
최종적으로,

- JSX.IntrinsicElements.form은 from 태그에서 사용할 수 있는 속성 전체
- JSX.IntrinsicElements.input은 input 태그에서 사용할 수 있는 속성 전체
  를 갖고 있는 인터페이스이다. <br>
  그렇다면 HTMLFormElement와 HTMLInputElement은 어디서 온 것일까?

<br>

```ts
//global.d.ts
interface HTMLFormElement extends HTMLElement {}
interface HTMLInputElement extends HTMLElement {}
```

인터페이스 선언만 있고 속성은 하나도 없다. 이 경우에는 다른 곳에서 선언된 인터페이스와 합쳐지는 걸 의도했다고 추측할 수 있다.
global.d.ts는 index.d.ts에서 다음과 같이 불러온다.

```ts
// index.d.ts
/// <reference path="global.d.ts" />
```

다시 `HTMLFormElement`를 Go to Definition 하고 lib.dom.d.ts 파일을 선택한다.
이 파일은 타입스크립트에서 기본적으로 제공하는 타입 선언 파일이다. (브라우저의 Dom과 관련한 타입만 모아둠), 여기에 타입은 따로 import 하지 않아도 전역으로 사용할 수 있다.

<br>

## 7.2.4 HTMLFormElement

```ts
//lib.dom.d.ts
interface HTMLFormElement extends HTMLElement {
  acceptCharset: string;

  action: string;

  autocomplete: AutoFillBase;

  readonly elements: HTMLFormControlsCollection;

  encoding: string;

  enctype: string;

  readonly length: number;

  method: string;

  name: string;

  noValidate: boolean;
  rel: string;
  readonly relList: DOMTokenList;

  target: string;

  checkValidity(): boolean;

  reportValidity(): boolean;

  requestSubmit(submitter?: HTMLElement | null): void;

  reset(): void;

  submit(): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLFormElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLFormElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  [index: number]: Element;
  [name: string]: any;
}
```

`HTMLFormElement`는 DOM API에서 직접 접근할 수 있는 form의 속성과 메서드를 갖고 있다.

다음과 같이 react에서 사용할 수 있다.

```tsx
//..
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
//..
```

e.preventDefault, currentTarget 둘 다 Go to Definition 해보자.

### BaseSyntheticEvent

```ts
interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  timeStamp: number;
  type: string;
}
```

둘 모두 `BaseSyntheticEvent` 인터페이스가 있다. `currentTarget`이 타입 매개변수 `C`로 나타난다. `C`가 어떤 타입인지 먼저 파악해야 한다. 파악하기 위해 `BaseSyntheticEvent`를 Go to Definition 해보자.

```ts
// SyntheticEvent
interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

//..
interface FormEvent<T = Element> extends SyntheticEvent<T> {}

interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}
```

`SyntheticEvent`는 `FormEvent`와 `ChangeEvent`에서 사용된다.
`BaseSyntheticEvent`는
`SyntheticEvent`의 부모이고, `SyntheticEvent`는 `ChangeEvent`의 부모이다.

<br>

> BaseSyntheticEvent <: SyntheticEvent <: ChangeEvent

ChangeEvent의 T가 HTMLInputElement이므로 SyntheticEvent도 SyntheticEvent<HTMLInputElement\>이다.

SyntheticEvent에 타입 매개변수 E를 제공하지 않았으므로 E는 Event가 되어 최종적으로 `SyntheticEvent<HTMLInputElement, Event>`가 된다.

```ts
// interface BaseSyntheticEvent <Event, EventTarget & HTMLInputElement , EventTarget>{}
interface BaseSyntheticEvent<E = object, C = any, T = any> {
  //..
}
```

이에 따라 `BaseSyntheticEvent의 타입 매개변수`에는 순서대로 Event, EventTarget & HTMLInputElement , EventTarget이 들어간다.

타입 매개변수 C가 BaseSyntheticEvent의 두 번째 타입 매개변수이므로 C는 EventTarget & HTMLInputElement이다.
`즉 e.currentTarget에서 HTMLInputElement 속성을 사용할 수 있다.`

## 7.2.5 컴포넌트 타입

```ts
const WordRelay = () => {
  //..
};
// const WordRelay: () => JSX.Element
export default WordRelay;
```

WordRelay 변수의 타입은 `() => JSX.Element`라는 함수이다. 이는 리액트에서 컴포넌트를 가리키는 타입이기도 하다. 하지만 컴포넌트에 대한 정확한 타입은 아니다.
다름 컴포넌트를 JSX로 사용하는 경우를 확인하기 위해 다음 코드와 같이 수정해 보자.

```ts
// Form.tsx
import React from "react";

const Form = ({ children, onSubmit }) => {
  // Error
  return <form onSubmit={onSubmit}>{children}</form>;
};

export default Form;
// 바인딩 요소 'children'에 암시적으로 'any' 형식이 있습니다.ts(7031)
//바인딩 요소 'onSubmit'에 암시적으로 'any' 형식이 있습니다.ts(7031)
```

```ts
import Form from "./Form";

const WordRelay = () => {
  //..

  return (
    <>
      <div>{word}</div>
      <Form onSubmit={onSubmitForm}>
        <input ref={inputEl} value={value} onChange={onChange} />
        <button>입력!</button>
      </Form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

children, onSubmit을 prop으로 받는 Form 컴포넌트를 하나 만들었디. 다만 children, onSubmit에서 에러가 발생한다. 따라서 `prop을 타이핑` 해줘야 한다. 매개변수를 구조 분해 할당한 것이니만큼 다음과 같이 타이핑 할수도 있다.

```tsx
import React, { FormEvent } from "react";

interface Props {
  children: () => JSX.Element; // Error
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const Form = ({ children, onSubmit }: Props) => {
  return <form onSubmit={onSubmit}>{children}</form>; //() => Element' 형식은 'ReactNode' 형식에 할당할 수 없습니다.
};

export default Form;
```

children을 ` children: () => JSX.Element` 타입으로 타이핑하니 'ReactNode' 형식에 할당할 수 없다는 에러가 발생한다. 그럼 children을 ReactNode 타입으로 변경해 보면 다음과 같다.

```tsx
import React, { ReactNode, FormEvent } from "react";

interface Props {
  children: ReactNode; // OK
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const Form = ({ children, onSubmit }: Props) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

export default Form;
```

여기서 `다른 컴포넌트가 들어오는 부분을 ReactNode 타입을 사용해야 함`을 알 수 있다. 그럼 ReactNode 타입을 더 자세히 알아보자.

### ReactNode

```ts
type ReactNode =
  | ReactElement
  | string
  | number
  | Iterable<ReactNode>
  | ReactPortal
  | boolean
  | null
  | undefined
  | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES];

interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: string | null;
}
```

`ReactNode`는 다양한 것들의 유니언 타입인 것을 확인할 수 있다.
ReactElement나 ReactPortal, ReactFragment 같은 타입도 들어갈 수 있다.
`ReactFragment` 타입은 'Iterable<ReactNode\>'이다. 이 타입이 유니언에 속해 있기 때문에 children에 여러 ReactNode가 들어올 수 있던 것이다.

`여기서 알아둬야 할 점은 JSX 문법에 들어갈 수 있는 타입은 ReactNode라는 점이다!`

구조 분해 할당에 타이핑하는 대신 다음과 같이 타이핑할 수 있다.

```tsx
import React, { ReactNode, FormEvent, FunctionComponent } from "react";

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const Form: FunctionComponent<Props> = ({ children, onSubmit }) => {
  //FunctionComponent<Props>로 타이핑
  return <form onSubmit={onSubmit}>{children}</form>;
};

export default Form;
```

Form 변수를 FunctionComponent라는 타입으로 표기했다. FunctionComponent 타입은 타입 매개변수로 prop의 타입을 받는다.
`FunctionComponent<Props>`를 하면 prop이 Props로 타이핑 된다.
FunctionComponent 타입을 자세히 알아보자.

### FunctionComponent

```ts
type FC<P = {}> = FunctionComponent<P>;
//..
interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactNode;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

`FunctionComponent`는 props와 context 매개변수로 가지고, ReactNode를 반환하는 타입이다.
그러면서 propTypes, contextTypes, defaultProps, displayName 속성을 추가로 가지고 있다. 또한 `FC`가 FunctionComponent 타입의 별칭으로 선언되었기 때문에 FunctionComponent라고 길게 적는 대신 FC로 간단하게 줄여 다음과 같이 쓸 수도 있다.

```tsx
const Form: FC<Props> = ({ children, onSubmit }) => {//FunctionComponent -> FC 변경
  return <form onSubmit={onSubmit}>{children}</form>;/
};
```

# 7.3 React 직접 타이핑하기

이제 React 패키지를 직접 타이핑해 보자.

```tsx
declare namespace Zeact {
  const useState: <T>(initial: T) => [T, (value: T) => void];
  const useRef: <T>(initial: T | null) => {
    current: T | null;
  };

  const useEffect: (callback: Function, deps: unknown[]) => void;
  const useCallback: <T extends Function>(callback: T, deps: unknown[]) => T;

  // function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
  interface FunctionComponent<P> {
    (props: P): JSX.Element;
  }
  interface FormEvent<T> {
    preventDefault(): void;
  }
  interface ChangeEvent<T> {
    currentTarget: T;
  }
  type ReactNode = React.ReactNode;
}

interface Props {
  children: Zeact.ReactNode;
  onSubmit: (e: Zeact.FormEvent<HTMLFormElement>) => void;
}

const Form: Zeact.FunctionComponent<Props> = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

const WordRelay = () => {
  const [word, setWord] = Zeact.useState("제로초");
  const [value, setValue] = Zeact.useState("");
  const [result, setResult] = Zeact.useState("");
  const inputEl = Zeact.useRef<HTMLInputElement>(null);

  Zeact.useEffect(() => {
    console.log("useEffect");
  }, []);

  const onSubmitForm = Zeact.useCallback(
    (e: Zeact.FormEvent<HTMLFormElement>) => {
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

  const onChange = Zeact.useCallback(
    (e: Zeact.ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
    },
    []
  );

  return (
    <>
      <div>{word}</div>
      <Form onSubmit={onSubmitForm}>
        <input ref={inputEl} value={value} onChange={onChange} />
        <button>입력!</button>
      </Form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

- `useState, useRef`
  범용적으로 사용하려면 제네릭을 사용하는 게 좋다.

  - useState는 initial 매개변수가 string이므로 T도 string이 된다.
  - useRef는 initial이 null이지만 타입 매개변수 T에 HTMLInputElement를 직접 넣었기 때문에 current는 HTMLInputElement | null이 된다.

- `useEffect, useCallback`

  - 둘 다 두 번째 매개변수 deps 배열을 추가하고, useCallback은 추가로 매개변수로 받은 함수를 그대로 반환해야 한다.

  - 두 번째 매개변수 deps에 unknown 배열을 추가하고, useCallback은 타입 매개변수 T를 사용했다. 대신 T에는 Function 제약을 걸어두어 함수 외의 것은 들어오지 못하게 했다.

- `ChangeEvent, FormEvent`

  - 이 두 인터페이스는 제네릭 타입 매개변수가 붙어 있으므로 각각 FormEvent와 ChangeEvent의 target 객체에 대한 유형을 지정한다.

- `FunctionComponent, ReactNode`
  - FunctionComponent도 JSX.Element 타입을 반환하도록 지정하고, children 타입인 ReactNode도 React.ReactNode 타입으로 지정해 준다.
