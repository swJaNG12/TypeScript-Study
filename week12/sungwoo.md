# 스터디 12주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 12주차 스터디 목차

- [7.2 JSX 타입 이해하기](#72-jsx-타입-이해하기)
- [7.3 React 직접 타이핑하기](#73-react-직접-타이핑하기)
  - [7.3.1 useState, useRef 타이핑](#731-usestate-useref-타이핑)
    - [useState 타이핑](#usestate-타이핑)
    - [useRef 타이핑](#useref-타이핑)
  - [7.3.2 useEffect, useCallback 타이핑](#732-useeffect-usecallback-타이핑)
    - [useEffect 타이핑](#useeffect-타이핑)
    - [useCallback 타이핑](#usecallback-타이핑)
  - [7.3.3 ChangeEvent, FormEvent 타이핑](#733-changeevent-formevent-타이핑)
    - [ChangeEvent 타이핑](#changeevent-타이핑)
    - [FormEvent 타이핑](#formevent-타이핑)

<br>

# 7.2 JSX 타입 이해하기

JSX, HTMLFormElement, HTMLInputElement 타입을 알아봅니다.

```ts
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
    interface IntrinsicElements {
      // HTML
      a: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      form: React.DetailedHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >;
      input: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      // SVG
      svg: React.SVGProps<SVGSVGElement>;
    }
  }
}
```

jsx 문법에서 사용한 form은 JSX.IntrinsicElements.form 이고, input은 JSX.IntrinsicElements.input 임을 알 수 있습니다.<br>

React.DetailedHTMLProps를 확인해보겠습니다.

```ts
declare namepsace React {
	type DetailedHTMLProps<E extends HTMLArrtibutes<T>, T> = ClassAttributes<T> & E;

	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// React-specific Attributes
		defaultChecked?: boolean | undefined;
		defaultValue?: string | number | ReadonlyArray<string> | undefined;
		suppressContentEditableWarning?: boolean | undefined;
		suppressHydrationWarning?: boolean | undefined;
	}

	interface Attributes {
		key?: Key | null | undefined;
	}
	interface RefAttributes<T> extends Attributes {
		ref?: Ref<T> | undefined;
	}
	interface ClassAttributes<T> extends Attributes {
		ref?: LegacyRef<T> | undefined;
	}
}
```

HTMLAttributes에는 HTML에서 사용할 수 있는 속성이 모여 있습니다.<br>
children, dangerouslySetInnerHTML 같은 React 전용 속성과 onChange, onSubmit 같은 DOM 이벤트를 담고 있는 DOMAttrubutes를 상속하고 있습니다.

React.DetailedHTMLProps는 HTMLAttributes를 제약으로 두고 있는 E와 ClassAtributes의 인터섹션이므로 E가 무엇이냐에 따라서 form과 input의 속성이 정해집니다.

- JSX.IntrinsicElements.form의 E는 `FormHTMLAttributes<HTMLFormElement>`
- JSX.IntrinsicElements.input의 E는 `React.InputHTMLAttributes<HTMLInputElement>`

```ts
interface HTMLFormElement extends HTMLElement {}
interface HTMLInputElement extends HTMLElement {}

declare namespace React {
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    acceptCharset?: string | undefined;
    action?: string | undefined;
    autoComplete?: string | undefined;
    encType?: string | undefined;
    method?: string | undefined;
    name?: string | undefined;
    noValidate?: boolean | undefined;
    target?: string | undefined;
    rel?: string | undefined;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string | undefined;
    alt?: string | undefined;

    onChange?: ChangeEventHandler<T> | undefined;
  }
}
```

FormHTMLAttributes, InputHTMLAttributes 모두 HTMLAttributes를 상속하고, form, input 태그에만 사용할 수 있는 속성을 모아두고 있습니다.

HTMLFromElement, HTMLInputElement는 인터페이스 선언만 있고 속성은 없습니다. 이러한 경우는 다른 곳에 선언된 인터페이스와 합쳐지는 걸 의도했다고 생각할 수 있습니다.

lib.dom.d.ts 파일은 lib.es5.d.ts 파일처럼 타입스크립트에서 기본으로 제공하는 타입 선언 파일입니다. 브라우저의 DOM과 관련한 타입만 모아둔 파일입니다.(따로 import 하지 않아도 전역으로 사용 가능)

lib.dom.d.ts

```ts
interface HTMLFormElement extends HTMLElement {
  acceptCharset: string;
  action: string;
  autocomplete: string;
  readonly elements: HTMLFormControlsCollection;
  encoding: string;
  enctype: string;
  readonly length: number;
  method: string;
  name: string;
  noValidate: boolean;
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

HTMLFormElement는 DOM API에서 접근할 수 있는 form의 속성과 메서드를 갖고 있습니다.

다음 같은 경우 직접 사용합니다.

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

preventDefault, currentTarget을 보겠습니다.

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

interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

interface FormEvent<T = Element> extends SyntheticEvent<T> {}

interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}
```

currentTarget이 타입 매개변수 C입니다.

BaseSyntheticEvent는 SyntheticEvent의 부모이고, SyntheticEvent는 ChangeEvent의 부모입니다. `ChangeEvent<HTMLInputElement>`인 경우 SyntheticEvent와 BaseSyntheticEvent는 어떻게 되는지 알아봅시다.

ChangeEvent의 T가 HTMLInputElement 이므로, SyntheticEvent는 `SyntheticEvent<HTMLInputElement>`입니다. SyntheticEvent에 타입 매개변수 E를 제공하지 않았으므로 E는 Event가 되어 `SyntheticEvent<HTMLInputElement, Event>`가 됩니다. 따라서 BaseSyntheticEvent의 타입 매개변수는 순서대로, Event, EventTarget & HTMLInputElement, EventTarget이 들어갑니다.

따라서 C는 EventTarget & HTMLInputElement 입니다.

## 7.2.1 컴포넌트 타입

컴포넌트 타입에 대해서 알아보겠습니다.

test.tsx

```tsx
const WordRelay = () => {};
// const WordRelay: () => JSX.Element

export default WordRelay;
```

WordRelay 변수의 타입은 () => JSX.Element 함수입니다. 리액트에서 컴포넌트를 가리키는 타입이기도 하지만, 컴포넌트에 대한 정확한 타입은 아닙니다. 다른 컴포넌트를 JSX로 사용하는 경우를 확인하기 위해 test.tsx에 Form 컴포넌트를 추가합니다.

```tsx
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  FormEventHandler,
  ChangeEventHandler,
} from "react";

const Form = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

const WordRelay = () => {
  return (
    <>
      <div>{word}</div>
      <Form onSubmit={onSubmitForm}>
        <input type="text" ref={inputEl} value={value} onChange={onChange} />
        <button>입력</button>
      </Form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

Form 컴포넌트는 children과 onSubmit을 prop으로 받는 컴포넌트입니다. children과 onSubmit prop부분에서 noImplicitAny 에러가 발생하므로 prop을 타이핑해야 합니다. 이때 Prop객체를 구조분해 할당한 것이므로 interface로 타이핑할 수 있습니다.

```tsx
interface Props {
  children: () => JSX.Element;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const Form = ({ children, onSubmit }: Props) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};
// '() => Element' 형식은 'ReactNode' 형식에 할당할 수 없습니다.ts(2322)
```

() => Element는 () => JSX.Element를 의미합니다. 따라서 에러메시지는 () => JSX.Element 타입은 ReactNode 타입에 대입할 수 없다는 것입니다. children의 타입을 ReactNode 타입으로 변경하면 에러가 사라집니다.

```tsx
interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const Form = ({ children, onSubmit }: Props) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};
```

children 처럼 다른 컴포넌트가 들어오는 부분은 ReactNode 타입을 사용해야 합니다. <br>
ReactNode가 어떤 타입인지 알아봅시다.

```ts
declare namespace React {
  interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> =
      | string
      | JSXElementContructor<any>
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
  type ReactFragment = Iterable<ReactNode>;
  type ReactNode =
    | ReactElement
    | string
    | number
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;
}
```

ReactNode에는 string, number 같은 자료형, ReactElement, ReactPortal, ReactFragment 같은 타입도 들어갈 수 있습니다. ReactFragment 는 `Iterable<ReactNode>` 타입이기 때문에 여러 ReactNode가 들어올 수 있습니다.

prop에 타입을 할당하는 대신 다음과 같이 컴포넌트 변수에 타이핑할 수도 있습니다.

```tsx
interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const Form: FunctionComponent<Props> = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};
```

Form에 타이핑한 FunctionComponent 타입은 타입 매개변수로 prop의 타입을 받습니다. `FunctionComponent<Props>`하면 prop이 Props로 타이핑됩니다.

FunctionComponent의 타입을 확인해봅시다.

```ts
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

# 7.3 React 직접 타이핑하기

React 패키지를 직접 타이핑해보겠습니다.

```tsx
declare namespace Zeact {
  const useState: () => void;
  const useRef: () => void;
  const useEffect: (callback: Function) => void;
  const useCallback: (callback: Function) => void;
  interface FunctionComponent<P> {}
  interface FormEvent<T> {}
  interface ChangeEvent<T> {}
  type ReactNode = unknown;
}
```

## 7.3.1 useState, useRef 타이핑

### useState 타이핑

useState는 초기값 initial을 받습니다. 그리고 상태값과, set 함수를 반환합니다. 그리고 상태에는 여러 타입이 올 수 있기 떄문에 제네릭을 사용해 더 범용적으로 사용할 수 있게 해야합니다.

```tsx
declare namespace Zeact {
  const useState: <T>(initial: T) => [T, (value: T) => void];
}
```

### useRef 타이핑

useRef도 초기값을 받습니다. 그리고 current룰 사용해야 합니다.

```tsx
declare namespace Zeact {
  const useRef: <T>(initial: T | null) => { current: T | null };
}
```

## 7.3.2 useEffect, useCallback 타이핑

### useEffect 타이핑

```tsx
declare namespace Zeact {
  const useEffect: (callback: Function, unknown[]) => void;
}
```

두 번째 매개변수 deps 배열을 추가했습니다.

### useCallback 타이핑

```tsx
declare namespace Zeact {
  const useCallback: <T extends Fucntion>(callback: T, deps: unknown[]) => T;
}
```

useCallback의 callback 매개변수의 타입은 타입 매개변수 T를 사용하고, Function타입으로 제약을 걸어 함수 이외의 타입은 들어오지 못하게 합니다. 반환값 타입도 함수로 제한합니다. 추가로 두 번쨰 매개변수 deps 배열을 추가합니다.

## 7.3.3 ChangeEvent, FormEvent 타이핑

### ChangeEvent 타이핑

```tsx
declare namespace Zeact {
  interface ChangeEvent<T> {
    currentTarget: T;
  }
}
```

### FormEvent 타이핑

```tsx
declare namespace Zeact {
  interface FormEvent<T> {
    preventDefault(): void;
  }
}
```

# 7.4 js 파일 생성하기
