# 스터디 15주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 15주차 스터디 목차

- []()

<br>

# 10 패키지 직접 타이핑하기

패키지의 타입을 직접 만들어봅니다. 대부분의 패키지는 자체적으로 타입을 지원하거나 타입스크립트 커뮤니티에서 타입을 지원합니다. 하지만 이 둘 모두에 해당하지 않는 경우(npmjs에서 TS 마크나 DT마크 모두 없는 경우)는 직접 타입 선언을 추가해야 합니다.

## 10.1 타입을 지원하지 않는 패키지 타이핑하기

타입을 지원하지 않는 npm 패키지에 타입 선언을 추가해봅니다.

scroview 패키지를 설치합니다.

```shell
npm i react-native @0.71.4
npm i react-native-keyboard-aware-scrollview@2.1.0
```

tsconfig.json

```
{
	"compilerOptions": {
		...
		"jsx": "react-netive",
		...
	}
}
```

타입이 없는 패키지입니다. 이처럼 타입이 없는 패키지를 사용해야 할 때 지금처럼 직접 타이핑하면 됩니다.

test.ts

```ts
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview"; // error
import { TextInput, StyleSheet } from "react-native/types";

const styles = StyleSheet.create({
  container: {},
  textInput: {},
});
const Component = () => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <TextInput style={styles.textInput} placeholder={"my input"} />
    </KeyboardAwareScrollView>
  );
};

export default Component;
```

error 내용을 보겠습니다.<br>

"모듈 'react-native-keyboard-aware-scrollview'에 대한 선언 파일을 찾을 수 없습니다. '/Users/jangseong-u/Desktop/TypeScript-book/node_modules/react-native-keyboard-aware-scrollview/index.js'에는 암시적으로 'any' 형식이 포함됩니다.
해당 항목이 있는 경우 'npm i --save-dev @types/react-native-keyboard-aware-scrollview'을(를) 시도하거나, 'declare module 'react-native-keyboard-aware-scrollview';'을(를) 포함하는 새 선언(.d.ts) 파일 추가ts(7016)"

모듈에 대한 선언 파일을 찾을 수 없다는 에러가 발생한것을 볼 수 있습니다.
이유는 react-native-keyboard-aware-scrollview에 대한 타입 선언이 없기 때문입니다. 그리고 자체적으로 타입 선언을 제공하지 않기 때문에 해결방법으로 제시한 첫번째 방법인 npm `i --save-dev @types/react-native-keyboard-aware-scrollview` 말고 두 번째 방법인 `'declare module 'react-native-keyboard-aware-scrollview';'을(를) 포함하는 새 선언(.d.ts) 파일 추가`를 하겠습니다.

react-native-keyboard-aware-scrollview.d.ts

```ts
declare module "react-native-keyboard-aware-scrollview";
```

이렇게만 만들어도 test.tsx의 에러가 사라집니다. 가장 간단하게 모듈을 타이핑하는 방법입니다. 하지만 KeyboardAwareScrollView의 타입이 any가 된다는 단점이 있습니다. KeyboardAwareScrollView를 타이핑해봅시다.

우선 TextInput의 타입을 살펴보겠습니다.

```ts
export interface TextInputProps
  extends ViewProps,
    TextInputIOSProps,
    TextInputAndroidProps,
    AccessibilityProps {
  style?: StyleProp<TextStyle> | undefined;
}

/**
 * @see https://reactnative.dev/docs/textinput#methods
 */
declare class TextInputComponent extends React.Component<TextInputProps> {}
declare const TextInputBase: Constructor<NativeMethods> &
  Constructor<TimerMixin> &
  typeof TextInputComponent;
export class TextInput extends TextInputBase {}
```

이 구조를 응용해 KeyboardAwareScrollView 컴포넌트도 타이핑하겠습니다.

```ts
declare module "react-native-keyboard-aware-scrollview" {
  class KeyboardAwareScrollViewComponent extends React.Component {}
  export class KeyboardAwareScrollView extends KeyboardScrollViewComponent {}
}
```

이렇게 타입을 작성해주면 test.ts에서 import 부분에 있던 에러는 사라지고
JSX 부분에서 에러가 발생합니다.

```tsx
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview"; // error
import { TextInput, StyleSheet } from "react-native/types";

const styles = StyleSheet.create({
  container: {},
  textInput: {},
});
const Component = () => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <TextInput style={styles.textInput} placeholder={"my input"} />
    </KeyboardAwareScrollView>
  );
};

export default Component;

// (alias) class KeyboardAwareScrollView
// import KeyboardAwareScrollView
// 이 호출과 일치하는 오버로드가 없습니다.
//   오버로드 1/2('(props: {}): KeyboardAwareScrollView')에서 다음 오류가 발생했습니다.
//     '{ children: Element; style: {}; }' 형식은 'IntrinsicAttributes & IntrinsicClassAttributes<KeyboardAwareScrollView> & Readonly<{}>' 형식에 할당할 수 없습니다.
//       'IntrinsicAttributes & IntrinsicClassAttributes<KeyboardAwareScrollView> & Readonly<{}>' 형식에 'children' 속성이 없습니다.
//   오버로드 2/2('(props: {}, context: any): KeyboardAwareScrollView')에서 다음 오류가 발생했습니다.
//     '{ children: Element; style: {}; }' 형식은 'IntrinsicAttributes & IntrinsicClassAttributes<KeyboardAwareScrollView> & Readonly<{}>' 형식에 할당할 수 없습니다.
//       'IntrinsicAttributes & IntrinsicClassAttributes<KeyboardAwareScrollView> & Readonly<{}>' 형식에 'children' 속성이 없습니다.ts(2769)
```

에러 메시지를 확인하면 children과 style props를 가질 수 없다고 나옵니다. props를 가질 수 있게 prop 부분도 타이핑해봅시다. Component 인터페이스의 첫 번째 타입 매개변수가 props 자리입니다.

```ts
declare module "react-native-keyboard-aware-scrollview" {
  import { ViewProps, StyleProp } from "react-native/types";
  import { ReactNode } from "react";
  interface KeyboardAwareScrollViewProps extends ViewProps {
    children: ReactNode;
    style: StyleProp<ViewProps>;
  }
  class KeyboardAwareScrollViewComponent extends React.Component<KeyboardAwareScrollViewProps> {}
  export class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
}
```

### 10.1.1 baseUrl과 paths로 타이핑하기

이전 절처럼 declare module을 하지 않고도 tsconfig.json의 baseUrl, paths 옵션을 사용하는 방법도 있습니다.

react-native-keyboard-aware-scrollview.d.ts

```ts
import { ViewProps, StyleProp } from "react-native/types";
import { ReactNode } from "react";
interface KeyboardAwareScrollViewProps extends ViewProps {
  children: ReactNode;
  style: StyleProp<ViewProps>;
}
class KeyboardAwareScrollViewComponent extends React.Component<KeyboardAwareScrollViewProps> {}
export class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
```

이렇게 수정하고 tsconfig.json에서 baseUrl과 paths 옵션을 아래처럼 수정합니다.

```json
    "baseUrl": "../" /* Specify the base directory to resolve non-relative module names. */,
    "paths": {
      "react-native-keyboard-aware-scrollview": [
        "scrollview/react-native-keyboard-aware-scrollview.d.ts"
      ]
```

baseUrl

- paths의 기준 경로, 현재는 tsconfig.json이 있는 폴더로 지정

paths

- 해당 모듈을 어떤 파일에서 찾을지를 정하는 옵션
- 배열로 만들어서 여러 파일 지정가능

baseUrl을 다른 경로로 바꾼다면 그에 맞춰 paths도 바꿔야 합니다.

```json
    "baseUrl": "./" /* Specify the base directory to resolve non-relative module names. */,
    "paths": {
      "react-native-keyboard-aware-scrollview": [
        "react-native-keyboard-aware-scrollview.d.ts"
      ]
```

## 10.2 js 패키지를 만들고 타입 추가하기

이번에는 패키지를 만듭니다. npm에서 패키지를 설치하는 것이 아니라 직접 npm의 패키지를 개발하는 것입니다.

패키지는 자바스크립트로 개발해서 타입 선언만 따로 붙이는 상황이라고 가정합니다.

계산기 함수들을 모아둔 패키지를 만들어 보겠습니다.

calc-js 폴더를 만들고 그 안에 아래 명령어를 차례로 실행합니다

```shell
npm init -y
mkdir src
cd src
touch plus.js minus.js multiply.js divide.js index.js
```

```js
// plus.js
module.exports = (...arg) => arg.reduce((a, c) => a + c);

// minus.js
module.exports = (a, b) => a - b;

// multiply.js
module.exports = (...arg) => arg.reduce((a, c) => a * c);

// divide.js
module.exports = (a, b) => a / b;

// index.js
const plus = require("./plus");
const minus = require("./minus");
const multiply = require("./multiply");
const divide = require("./divide");

module.exports = {
  plus,
  minus,
  multiply,
  divide,
};
```

만들어진 패키지는 자바스크립트 패키지이므로 타입 선언을 따로 해야 합니다.

src 폴더 바깥에 types.d.ts 파일을 만들어 아래 코드를 입력합니다.

```ts
declare const plus: (...args: number[]) => number;
declare const minus: (a: number, b: number) => number;
declare const multiply: (...args: number[]) => number;
declare const divide: (a: number, b: number) => number;

export default {
  plus,
  minus,
  multiply,
  divide,
};
```

package.json의 types 속성에 타입 선언을 등록하고 index.js가 이 패키지를 대표하는 자바스크립트 파일임을 알립니다.

package.json

```json
{
  "name": "calc-js",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "types": "types.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

use-calc 폴더에 index.ts 파일을 만들고 동작을 확인합니다.

```ts
import calc from "../calc-js";

const a = calc.plus(1, 2, 3, 4);
const b = calc.minus(a, 4);
```

## 10.3 ts 패키지를 만들고 d.ts 생성하기

이번에는 처음부터 타입스크립트 패키지로 타이핑하겠습니다.

calc-ts 폴더를 만들고 그 안에 패키지를 만듭니다.

```shell
mkdir calc-ts
cd calc-ts
npm init -y
npx tsc --init
mkdir src
cd src
touch plus.ts minus.ts multiply.ts divide.ts index.ts
```

```ts
// plus.ts
export default (...arg: number[]) => arg.reduce((a, c) => a + c);

// minus.ts
export default (a: number, b: number) => a - b;

// multiply.ts
export default (...arg: number[]) => arg.reduce((a, c) => a * c);

// divide.ts
export default (a: number, b: number) => a / b;

// index.ts
import plus from "./plus";
import minus from "./minus";
import multiply from "./multiply";
import divide from "./divide";

export default {
  plus,
  minus,
  multiply,
  divide,
};
```

package.json에 패키지를 대표할 타입 파일로 src/index.ts를 설정합니다.

```json
"types": "src/index.ts"
```

use-calc 폴더에 index2.ts를 만들고 동작을 확인합니다.

```ts
import calc from "../calc-ts";

const a = calc.plus(1, 2, 3, 4);
```

use-calc 에서 ts-node로 index2.ts 를 실행하면 에러가 발생합니다.

```shell
cd use-calc
npx ts-node index2

Error: Cannot find module '/Users/jangseong-u/Desktop/TypeScript-book/src/calc-ts/index.js'. Please verify that the package.json has a valid "main" entry
```

calc-ts에 index.js 파일없다는 에러가 발생합니다. Node.js가 실행하는 것은 결국 자바스크립트 파일이기 때문에 calc-ts도 자바스크립트 파일이 있어야 합니다.

calc-ts의 src/index.ts로부터 js 파일을 만들겠습니다. 다만 js 파일이 src 폴더에 생성되지 않고 dist 폴더에 생성되게 만들겠습니다.

calc-ts의 tsconfig.json에서 3가지 옵션을 설정합니다

```json
	"declaration": true,
	"outDir": "dist",
	"declarationDir": "types",
	"rootDir": "."
```

- `declaration` :
  1.  ts 파일로부터 .d.ts 파일을 만들어낼지 선택하는 옵션
  2.  이 옵션을 활성화하면 ts 파일이 js 파일로 변환될 때 .d.ts 파일도 같이 생성
- `outDir` :
  1.  옵션은 결과물을 어떤 폴더에 저장할지 선택하는 옵션
  2.  따로 지정하지 않으면 ts 파일이 있는 곳에 js 파일이 생성
- `declarationDir` :
  1.  .d.ts 파일이 어디에 생성될지 결정하는 옵션
  2.  따로 지정하지 않으면 outDir 경로에 .d.ts 파일이 생성
  3.  outDir도 없으면 ts 파일이 있는 곳에 .d.ts 파일이 생성

```shell
cd calc-ts
npx tsc
```

dist, types 폴더안에 src 폴더가 생성되고 dist 폴더안에는 src 폴더가 있고 그 안에 js파일이, types 폴더안에 src 폴더가 있고 그 안에 .d.ts 파일이 생성됩니다.

js와 .d.ts 파일이 생성되었으니 package.json에서 main과 types 속성을 다시 입력합니다

```json
{
  "name": "calc-ts",
  "version": "1.0.0",
  "description": "",
  "main": "dist/src/index.js",
  "types": "types/index.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

다시 use-calc 로 가서 실행을 확인합니다

```shell
npx ts-node index2
```

## 10.4 js 프로젝트를 ts로 전환하기

이번에는 자바스크립트 프로젝트를 타입스크립트로 전환해보겠습니다. 프로젝트의 규모가 커서 모든 파일을 타입스크립트로 바꾸지 못하고 조금씩 바꾸는 상황을 가정합니다.

calc-js 폴더를 복사하고 js-to-ts 로 이름을 바꿉니다.
`npx tsc --init`으로 tsconfig.json 파일을 만듭니다.

그리고 index.js만 ts 확장자로 변경하고 코드를 아래처럼 변경합니다.

```ts
import plus from "./plus";
// 모듈 './plus'에 대한 선언 파일을 찾을 수 없습니다. '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/plus.js'에는 암시적으로 'any' 형식이 포함됩니다.ts(7016)
import minus from "./minus";
// 모듈 './minus'에 대한 선언 파일을 찾을 수 없습니다. '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/minus.js'에는 암시적으로 'any' 형식이 포함됩니다.ts(7016)
import multiply from "./multiply";
// 모듈 './multiply'에 대한 선언 파일을 찾을 수 없습니다. '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/multiply.js'에는 암시적으로 'any' 형식이 포함됩니다.ts(7016)
import divide from "./divide";
// 모듈 './divide'에 대한 선언 파일을 찾을 수 없습니다. '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/divide.js'에는 암시적으로 'any' 형식이 포함됩니다.ts(7016)

export default {
  plus,
  minus,
  multiply,
  divide,
};
```

각각이 타입스크립트 파일이 아니기 때문에 에러가 발생합니다. 또한 plus, minus, multiply, divide는 any로 추론됩니다.

자바스크립트 파일을 인식하지 못하는 문제를 해결하기 위해 tsconfig.json에서 allowJs, checkJs 옵션을 활성화합니다

```json
	"allowJs": true,
	"checkJs": true,
```

- allowJs
  - 타입스크립트 프로젝트에서 자바스크립트 파일을 허용하는 옵션
- checkJs
  - 허용한 자바스크립트 파일에서 타입에러를 확인하는 옵션입니다.
  - true로 설정하면 자동으로 allowJs도 true로 설정됩니다.

npx tsc하여 변환하면 에러가 발생합니다.

```shell
error TS5055: Cannot write file '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/divide.js' because it would overwrite input file.

error TS5055: Cannot write file '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/minus.js' because it would overwrite input file.

error TS5055: Cannot write file '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/multiply.js' because it would overwrite input file.

error TS5055: Cannot write file '/Users/jangseong-u/Desktop/TypeScript-book/src/js-to-ts/src/plus.js' because it would overwrite input file.
```

TS5055 에러

- 변환 결과물을 출력하는 폴더가 원본 파일의 위치와 동일해서 발생하는 문제입니다.

outDir 옵션을 ./dist로 수정하고 다시 변환하면 TS5055 에러는 사라지고 타입에러가 출력됩니다.

```shell
npx tsc

(base) jangseong-u@jangseong-uui-MacBookAir js-to-ts % npx tsc
src/divide.js:1:19 - error TS7006: Parameter 'a' implicitly has an 'any' type.

1 module.exports = (a, b) => a / b;
                    ~

src/divide.js:1:22 - error TS7006: Parameter 'b' implicitly has an 'any' type.

1 module.exports = (a, b) => a / b;
                       ~

src/minus.js:1:19 - error TS7006: Parameter 'a' implicitly has an 'any' type.

1 module.exports = (a, b) => a - b;
                    ~

src/minus.js:1:22 - error TS7006: Parameter 'b' implicitly has an 'any' type.

1 module.exports = (a, b) => a - b;
                       ~

src/multiply.js:1:19 - error TS7019: Rest parameter 'arg' implicitly has an 'any[]' type.

1 module.exports = (...arg) => arg.reduce((a, c) => a * c);
                    ~~~~~~

src/plus.js:1:19 - error TS7019: Rest parameter 'arg' implicitly has an 'any[]' type.

1 module.exports = (...arg) => arg.reduce((a, c) => a + c);
                    ~
```

이 타입에서는 allowJs 옵션을 활성화해서 발생하는 에러입니다. 활성화하지 않으면 dist 폴더에 js 파일이 생성되지 않고 index.js만 생성됩니다. allowJs 옵션을 활성해야 자바스크립트 파이도 같이 프로젝트 결과물로 생성됩니다.

마지막으로 package.json 의 main 속성을 수정합니다.

```json
{
  "name": "calc-js",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "types": "types.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
