# 스터디 9주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 9주차 스터디 목차

- [5. jQuery 타입 분석하기](#5-jquery-타입-분석하기)
  - [5.1 jQuery 직접 타이핑하기](#51-jquery-직접-타이핑하기)
    - [5.1.1 zQuery 인터페이스 zQueryInstance 인터페이스 작성](#511-zquery-인터페이스-zqueryinstance-인터페이스-작성)
    - [5.1.2 addClass, html 메서드 타이핑](#512-addclasshtml-메서드-타이핑)
      - [5.1.2.1 addClass 오버로드 시그니처 작성](#5121-addclass-오버로드-시그니처-작성)
      - [5.1.2.2 html 오버로드 시그니처 작성](#5122-html-오버로드-시그니처-작성)
    - [5.1.3 z 인터페이스 타이핑](#513-z-인터페이스-타이핑)
  - [5.2 export 타입 이해하기](#52-export--타입-이해하기)
  - [5.3 스크립트 파일과 모듈 파일 이해하기](#53-스크립트-파일과-모듈-파일-이해하기)
  - [5.4 js 파일 생성하기](#54-js-파일-생성하기)

# 5. jQuery 타입 분석하기

이번에는 jQuery 라이브러리를 분석해보겠습니다.

```ts
$("p").removeClass("myClass noClass").addClass("yourClass");

$(["p", "t"]).text("hello");

const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});

$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
```

이 코드 1행에서 $함수를 어떻게 사용할 수 있는지 알아보겠습니다.<br>
misc.d.ts

```ts
declare const jQuery: JQueryStatic;
declare const $: JQueryStatic;
```

declare 예약어로 $와 jQuery 변수가 선언되어 있습니다. 실제로 실행되는 구현부는 없고 타입 선언만 하고 싶을 때 declare 예약어를 사용합니다. 실제 구현부는 node_modules/jquery/dist/jquery.js 또는 node_modules/jquery/dist/jquery.min.js에 있습니다. 헤당 파일에 대한 타입 검사를 하고 싶을 떄 @types/jquery의 .d.ts 파일들이 사용됩니다.

`$`와 `jquery`는 JQueryStatic 인터페이스 입니다.

@types/jquery/JQueryStatic.d.ts

```ts
interface JQueryStatic {
	...
	<TElement extends HTMLElement = HTMLElement>(html: JQuery.htmlString, ownerDocument_attributes?: Document | JQeury.PlainObject): JQuery<TElemnt>;
	...
}
```

### $ 함수 분석

- 매개변수 타입: `JQuery.htmlString`
- 반환값 타입: `JQuery<TElemnt>`

먼저 매개변수 타입인 `JQuery.htmlString`을 보겠습니다.<br>
`htmlString`은 JQuery 네입스페이스에 있습니다.

```ts
declare namespace JQuery {
	...
	type htmlString = string;
	interface PlainObject<T = any> {
		[key: string]: T;
	}
	...
}
```

- htmlString = string을 네임스페이에서 선언한 이유: jquery에 htmlString이라는 타입이 있는데 다른 패키지에도 htmlString이라는 타입이 있다면 충돌이 발생할 수 있기 때문에 충돌을 피하기 위해 네임스페이스를 부여하곤 합니다.
- htmlString = string을 타입 별칭으로 선언한 이유: JQeury.htmlString으로 타이핑 함으로써 문자열이라는 의미뿐 아니라 html 문자열이라는 의미를 추가로 나타낼 수 있기 때문에 구체적으로 타입 별칭을 선언한 것입니다.

<br>

이번엔 반환값 타입인 `JQuery<TElemnt>`를 분석해보겠습니다.<br>
먼저 TElement 제네릭 타입 매개변수를 살펴보겠습니다.
TElement 는 HTMLElement의 서브타입이어야 하며, 기본값은 HTMLElement입니다. HTMLElement를 살펴보겠습니다.

```ts
/** Any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it. */
interface HTMLElement extends Element, DocumentAndElementEventHandlers, ElementCSSInlineStyle, ElementContentEditable, GlobalEventHandlers, HTMLOrSVGElement {...}
```

HTMLElement는 모든 HTML 요소를 나타냅니다.

### JQuery 타입 분석

```ts
interface JQuery<TElment = HTMLElement> extends Iterable<TElement> {
	..
}
```

JQuery는 `Iterable<TElement>`를 상속하는 인터페이스입니다.

<br>

&와 JQuery에 대해서 분석해 봤으니 아래 코드를 다시 보겠습니다.

```ts
$("p").removeClass("myClass noClass").addClass("yourClass");

$(["p", "t"]).text("hello");

const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});

$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
```

`$("p")` 의 반환값은 `JQuery<TElement>` 타입입니다. 근데 TElement를 표시하지 않았기 때문에 기본값인 HTMLElement가 됩니다.
`$("P")` 다음에 메서드 체이닝으로 removeClass를 사용하고 있으니 반환값인 `JQuery<HTMLElement>`에 removeClass가 있는지 확인하겠습니다.

```ts
interface JqQuery<TElement = HTMLElement> extends Iterable<TElement> {
  removeClass(
    className_function?:
      | JQuery.TypeOrArray<string>
      | ((this: TElement, index: number, className: string) => string)
  ): this;
}
```

### removeClass 매개변수 타입

removeClass의 인수의 타입으로는 `JQuery.TypeOrArray<string>` 이거나 `((this: TElement, index: number, className: string) => string)): this` 인 함수 형태입니다. 인수로 전달한 'myClass noClass'는 함수가 아니므로 `JQuery.TypeOrArray<string>` 라는 것을 알 수 있습니다.

```ts
decalre namespace JQuery {
	type TypeOrArray<T> = T | T[];
}
```

'myClass noClass'를 전달했기 떄문에 `TypeOrArray<string> = string | string[]` 입니다. 따라서 removeClass('myClass noClass')도 가능하지만 removeClass(['myClass', 'noClass'])도 가능함을 유추할 수 있습니다. 다만 이 부분은 타입선언 부분이기 때문에 서로 어떻게 동작하는지는 실제 구현부를 보고 파악해야 합니다.

### removeClass 반환값 타입

이번에는 removeClass의 반환값 타입을 확인해보겠습니다. removeClass의 반환값 타입은 this 입니다. 따라서 메서드 체이닝이 가능하므로 .addClass로 사용할 수 있습니다.

```ts
interface JqQuery<TElement = HTMLElement> extends Iterable<TElement> {
  addClass(
    className_function?:
      | JQuery.TypeOrArray<string>
      | ((this: TElement, index: number, className: string) => string)
  ): this;
}
```

이런식으로 각각의 인수와 반환값등 여러 타입 선언을 확인하면서 어떻게 사용해야 하는지에 대한 가이드도 받을 수 있습니다. 어떤 변수가 왜 특정한 타입이 되는 알고 싶다면 이와 같은 방식으로 분석하면 됩니다.
<br>

## 5.1 jQuery 직접 타이핑하기

---

이번에는 JQuery 라이브러리의 타입을 직접 만들어 보겠습니다. 단 이미 JQuery인터페이스와 JQueryStatic 인터페이스를 알고 있으므로, 간단하게 만들어보겠습니다.

```ts
interface zQuery {}

declare const Z: zQuery;
Z("p").removeClass("myClass noClass").addClass("yourClass");

Z(["p", "t"]).text("hello");

const tag2 = Z("ul li").addClass(function (index) {
  return "item-" + index;
});

Z(tag2).html(function () {
  console.log(this);
  return Z(this).data("name") + "입니다.";
});
```

`$`대신 Z 변수를 사용합니다. zQuery 인터페이스에는 아무런 속성이 없으므로 많은 곳에서 에러가 발생합니다. 이제 zQuery 인터페이스를 수정하여 코드에 에러가 없도록 만들면 됩니다.

먼저 Z에 발생하는 에러를 없애 보겠습니다. 애러를 살펴보겠습니다.

### 5.1.1 zQuery 인터페이스, zQueryInstance 인터페이스 작성

```bash
const Z: zQuery
이 식은 호출할 수 없습니다.
'zQuery' 형식에 호출 시그니처가 없습니다.ts(2349)
```

이 에러는 현재 Z가 zQuery 인터페이스 타입인데 함수처럼 사용하고 있기 때문에 이 함수에 해당하는 호출 시그니처가 있어야하는데 이 호출 시그니처를 작성하지 않았기 떄문에 발생합니다. 호출 시그니처를 작성해보겠습니다. 추가로 함수의 반환값 타입도 정해줘야 합니다. 현재 Z는 메서드 체이닝을 통해 removeClass, addClass 등 다양한 메서드를 사용할 수 있어야합니다. 이를위해 zInstance라는 인터페이스를 따로 만들어 주겠습니다.

zInstance 인터페이스에서 메서드들의 타입을 선언할 때 주의할 점은 메서드의 반환값 타입을 this로 작성해야 한다는 점입니다. 여기서 this는 메서드가 호출되는 객체의 타입, 즉 zQueryInstance를 가리킵니다. 객체의 메서드에서 this를 반환하면 메서드 체인을 만들 수 있습니다.

zQueryInstance 인터페이스의 각 메서드가 this를 반환한다면, zQueryInstance 객체에서 메서드를 연속적으로 호출할 수 있습니다.

```ts
interface zQuery {
  (tag: string | string[]): zQueryInstance;
}

interface zQueryInstance {
  remove(param: string): this;
  addClass(param: string): this;
  text(param: string): this;
  html(param: string): this;
  data(param: string): this;
}

declare const Z: zQuery;
Z("p").removeClass("myClass noClass").addClass("yourClass");

Z(["p", "t"]).text("hello");

const tag2 = Z("ul li").addClass(function (index) {
  // const tag2: zQueryInstance
  return "item-" + index;
});

Z(tag2).html(function () {
  console.log(this);
  return Z(this).data("name") + "입니다.";
});
```

addClass의 반환값 타입을 this로 함으로써 tag2 변수의 타입이 zQueryInstance가 되었습니다. 대신 이로인해 Z(tag2), html(function() {}), addClass(function() {}) 부분에서 새로운 에러가 발생합니다.

```bash
addClass(function() {})
'(index: any) => string' 형식의 인수는 'string' 형식의 매개 변수에 할당될 수 없습니다.ts(2345)

Z(tag2)
'(index: any) => string' 형식의 인수는 'string' 형식의 매개 변수에 할당될 수 없습니다.ts(2345)

html(function() { console.log(this) })
'() => string' 형식의 인수는 'string' 형식의 매개 변수에 할당될 수 없습니다.ts(2345)
'this'에는 형식 주석이 없으므로 암시적으로 'any' 형식이 포함됩니다.ts(2683)
```

### 5.1.2 addClass,html 메서드 타이핑

먼저 addClass, html 메서드에 함수 인수를 넣는 부분을 타이핑하겠습니다.

#### 5.1.2.1 addClass 오버로드 시그니처 작성

현재 addClass는 두 가지 방식으로 사용되고 있습니다. 하나는 문자열을 인자로 받는 방식이고, 다른 하나는 함수를 인자로 받는 방식입니다. 이 두 가지 사용 방식을 모두 수용하려면 addClass 메서드를 오버로드 해야 합니다.

오버로드는 같은 이름의 메서드가 다른 매개변수와 반환 타입을 가질 수 있게 하는 기능입니다. 타입스크립트에서 메서드를 오버로드하려면, 여러 개의 시그니처를 선언하고, 이 시그니처들을 모두 처리하는 구현을 제공해야 합니다.

addClass에서는 현재 string을 반환하고 있고 index를 사용하고 있습니다. 따라서 아래처럼 오버로드 시그니처를 작성할 수 있습니다.

```ts
interface zQuery {
  (tag: string | string[]): zQueryInstance;
}

interface zQueryInstance {
  addClass(param: string): this;
  addClass(callback: (index: number) => string): this;
}
```

#### 5.1.2.2 html 오버로드 시그니처 작성

html 메서드는 현재 콜백함수 내에서 this를 사용하고 역시 string을 반환합니다. 이때 this는 zQueryInstance입니다.<br>
따라서 아래처럼 오버로드 시그니처를 작성할 수 있습니다.

```ts
interface zQuery {
  (tag: string | string[]): zQueryInstance;
}

interface zQueryInstance {
  html(param: string): this;
  html(callback: (this: zQueryInstance) => string): this;
}
```

### 5.1.3 Z 인터페이스 타이핑

현재 Z는 string, string[], zQueryInstance를 받고 있습니다. zQueryInstance를 받을 수 있게 타이핑해줍니다.

```ts
interface zQuery {
  (tag: string | string[]): zQueryInstance;
  (tah: zQueryInstance): zQueryInstance;
}
```

<br>

## 5.2 export = 타입 이해하기

---

node_modules/@types/jquery/index.d.ts 파일 마지막에 있는 export = jQuery의 의미에 대해 알아보겠습니다.

node_modules/@types/jquery/index.d.ts

```ts
...
export = jQuery
```

### 5.2.1 jQuery 변수

jQuery 변수는 misc.d.ts에 있는 변수입니다.

```ts
...
declare const jQuery: JQueryStatic;
declare const $: JQueryStatic;
...
```

### 5.2.2 export = 의 의미

export = 의 의미는 무엇일까요?

export = 는 타입스크립트에만 있는 문법입니다. CommonJS 문법을 사용하기 위한 문법입니다.
jquery는 CommonJS 모듈 시스템을 지원하기 때문에 require로 import 해야 하지만 타입스크립트는 require로 import 하지 못합니다.<br>
그래서 아래 처럼 import 할 수 있습니다.

```ts
import $ from "jquery";
```

하지만 import 방식은 tsconfig.json에서 esModuleInterop 옵션이 true로 설정되어 있어야 가능합니다. false라면 에러가 발생합니다.<br>
따라서 타입스크립트에서 CommonJS 모듈을 import 할 수 있던 이유는 esModuleInterop 옵션 덕분입니다. 이 옵션이 true면 타입스크립트 컴파일러는 CommonJS 모듈을 ES6 모듈처럼 사용할 수 있게 해줍니다.

<br>

## 5.3 스크립트 파일과 모듈 파일 이해하기

---

test.ts

```ts
$("p").removeClass("myClass noClass").addClass("yourClass");

$(["p", "t"]).text("hello");

const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});

$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
```

위 코드에서 `import $ from 'jquery' 없이 $를 사용할 수 있는 이유는 타입스크립트에서 misc.d.ts 파일을 스크립트 파일로 인식했기 때문입니다.

- 파일 내부 최상위 스코프에 import, export 예약어가 없으면 스크립트 파일이 됩니다.
- import, export 예약어가 있으면 모듈 파일이 됩니다.

### 5.3.1 스크립트 파일 예시

```ts
declare namespace Example {
  const test: string;
}
```

```ts
declare namespace Example {
  export const test: string;
}
```

<br>

### 5.3.2 모듈 파일 예시

```ts
declare namespace Example {
  const test: string;
}
export {};
```

스크립트 파일은 현재 파일에 있는 타입 정의들을 다른 파일에서 자유롭게 사용할 수 있습니다<br>
모듈인 파일에서도 스크립트 파일의 타입을 자유롭게 가져올 수 있습니다.

<br>

하지만 아래처럼 import 한 `$`와 import 하지 않은 `$`는 차이가 있습니다.

```ts
$("hi");

export {};
```

```ts
import $ from "jquery";

$("hi");

export {};
```

두 `$`는 서로 다른 타입입니다.

node_modules/@types/jquery/misc.d.ts

```ts
// import 한 경우
declare const jQuery: JQueryStatic;
// import 하지 않은 경우
declare const $: JQueryStatic;
```

- import 한 경우: index.d.ts 파일의 export = JQuery를 import 따라서 JQuery 타입 사용
- import 하지 않은 경우: misc.d.ts 스크립트 파일의 $ 변수 선언을 사용하기 때문에 declare const $ 타입을 사용

### 5.3.3 모듈 파일에서는 네임스페이스를 사용할 필요가 없다.

아래처럼 3개의 모듈파일이 있다고 해보겠습니다.

module1.ts

```ts
export interface Test {
  name: string;
}

export default function () {
  console.log("default export");
}
```

module2.ts

```ts
export interface Test {
  name2: string;
}
```

module3.ts

```ts
import * as module1 from "./module1";
import * as module2 from "./module2";

const ex1: module1.Test = {
  name: "hi",
  name2: "error", // error
};

const ex2: module2.Test = {
  name: "error", // error
  name2: "hello",
};

module1.default();
```

모듈 파일은 같은 이름의 네임스페이스, 인터페이스가 있더라고 서로 병합되지 않습니다.<br>
module1.ts에 있는 Test 인터페이스와 module2.ts에 있는 Test 인터페이스가 서로 병합되지 않았기 때문에 에러가 발생합니다.

<br>

#### 5.3.3.1 import \* as 네임스페이스 from 모듈, 문법

module3.ts에서 쓰인 `import * as 네임스페이스 from 모듈` 문법을 보겠습니다.<br>
이 문법은 해당 모듈에 존재하는 모든 export를 지정한 네임스페이스의 멤버로 가져오는 것입니다.

module3.ts에서 module1.ts, module2.ts 에 있는 모든 export를 module1, module2 라는 네임스페이스로 만들어서 사용하고 있습니다.

타입스크립트는 ECMAScript 모듈 문법도 따르고 있기 때문에 아래처럼 불러올 수도 있습니다.

```ts
import { Test } from "./module1";
import { Test as TestAlias } from "./module1";
```

<br>

## 5.4 js 파일 생성하기

---

아래 명령어로 ts 파일을 js 파일로 만들 수 있습니다.

```bash
npx tsc
```

test.ts

```ts
interface zQuery {
  (tag: string | string[]): zQueryInstance;
  (tag: zQueryInstance): zQueryInstance;
}

interface zQueryInstance {
  removeClass(param: string): this;
  addClass(param: string): this;
  addClass(callback: (index: number) => string): this;
  text(param: string): this;
  html(param: string): this;
  html(callback: (this: zQueryInstance) => string): this;
  data(param: string): this;
}

declare const Z: zQuery;
Z("p").removeClass("myClass noClass").addClass("yourClass");

Z(["p", "t"]).text("hello");

const tag2 = Z("ul li").addClass(function (index) {
  return "item-" + index;
});

Z(tag2).html(function () {
  console.log(this);
  return Z(this).data("name") + "입니다.";
});
```

test.js

```js
Z("p").removeClass("myClass noClass").addClass("yourClass");
Z(["p", "t"]).text("hello");
const tag2 = Z("ul li").addClass(function (index) {
  return "item-" + index;
});
Z(tag2).html(function () {
  console.log(this);
  return Z(this).data("name") + "입니다.";
});
```

tsconfig.json에서 declaration: true로 설정하면 타입 선언만 별도의 .d.ts 파일로 분리할 수 있습니다.

test.d.ts

```ts
interface zQuery {
  (tag: string | string[]): zQueryInstance;
  (tag: zQueryInstance): zQueryInstance;
}
interface zQueryInstance {
  removeClass(param: string): this;
  addClass(param: string): this;
  addClass(callback: (index: number) => string): this;
  text(param: string): this;
  html(param: string): this;
  html(callback: (this: zQueryInstance) => string): this;
  data(param: string): this;
}
declare const Z: zQuery;
declare const tag2: zQueryInstance;
```
