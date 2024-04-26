# 스터디 15주차

### 📝 15주차 스터디 목차

- [10장 패키지 직접 타이핑하기](#10장-패키지-직접-타이핑하기)
  - [10.1 타입을 지원하지 않는 패키지 타이핑하기](#101-타입을-지원하지-않는-패키지-타이핑하기)
  - [10.2 js 패키지를 만들고 타입 추가하기](#102-js-패키지를-만들고-타입-추가하기)
  - [10.3 ts 패키지를 만들고 .d.ts 생성하기](#103-ts-패키지를-만들고-dts-생성하기)
  - [10.4 js 프로젝트를 ts로 전환하기](#104-js-프로젝트를-ts로-전환하기)

# 10장 패키지 직접 타이핑하기

대부분의 패키지는 자체적으로 타입을 지원하거나 타입스크립트 커뮤니티에서 타입을 지원한다.
하지만 이 둘 모두에 해당하지 않는 경우 (npmjs에서 TS 마크나 DT 마크 모두 없는 경우)는 직접 타입을 선언을 추가해야 한다. 자신이 직접 패키지를 만들 경우에도 처음부터 ts파일로 만들거나, 직접 타입 선언을 추가해야 한다.

# 10.1 타입을 지원하지 않는 패키지 타이핑하기

먼저 npm 패키지이지만 타입을 지원하지 않는 패키지에 타입 선언을 추가해보자.
패키지가 타입을 지원하지 않거나, 제공하는 타입이 틀렸을 경우에도 이 방법을 사용하면 된다.

<br>

# 10.2 js 패키지를 만들고 타입 추가하기

## js 패키지 만들기

간단하게 계산기 함수들을 모아둔 패키지를 만들어보자.

```bash
mkdir calc-js
cd calc-js
npm init -y
```

패키지로 만들 것이므로 `npm init -y` 명령어로 package.json 파일을 생성해준다.

그 다음 `src 폴더`를 만들고 그 안에 `plus.js, minus.js , multiply.js, divide.js, index.js` 를 만든다.

### plus.js

```js
// src/plus.js

module.exports = (...arg) => arg.reduce((a, c) => a + c);
```

### minus.js

```js
// src/minus.js

module.exports = (a, b) => a ### b;
```

### multiply.js

```js
// src/multiply.js

module.exports = (...arg) => arg.reduce((a, c) => a * c);
```

### divide.js

```js
// src/divide.js

module.exports = (a, b) => a / b;
```

### index.js

```js
// src/index.js

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

현재 패키지는 자바스크립트이기 때문에 타입 선언을 따로 해줘야 한다.
types.d.ts 파일을 만들어 다음과 같이 입력한다.
이때 src 폴더 바깥에 생성하면 된다.

```js
// types.d.ts

declare const plus: (...args: number[]) => number;
declare const minus: (a: number, b: number) => number;
declare const multiply: (...args: number[]) => number;
declare const divide: (a: number, b: number) => number;

export { plus, minus, multiply, divide };
```

그 다음 package.json의 types 속성에 등록해서 해당 파일이 이 패키지를 대표하는 타입 피일임을 알려야 한다.

```json
{
  "name": "calc",
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

`types 속성`에 types.d.ts을 등록해 이 패키지를 대표하는 타입 파일임을 지정하고,
`main 속성`은 src/index.js로 수정하여 src/index.js가 이 패키지를 대표하는 자바스크립트 파일임을 알린다.

## js 패키지 사용하기

이제 다른 패키지에서 사용해보자.

```bash

mkdir use-calc
cd use-calc
npm init -y
npx tsc  --init
```

use-calc폴더에 index.ts 파일을 만들고 다음과 같이 입력한다.

```ts
// index.ts

import calc from "../calc-js";

const a = calc.plus(1, 2, 3, 4);
const b = calc.minus(a, 4);
calc.divide(b, 3);
calc.multiply(1, 2, 3, 4);
console.log(a, b);
```

`../calc-js ` 패키지가 인식되고 Go to Definition해보면 `types 속성`에서 등록한 `types.d.ts` 파일로 이동한다.

이제 제대로 만들어진게 맞는지 확인하려면 index.ts를 실행해보아야 한다. 그 전에 Node.js에서 ts파일은 실행할 수 없으므로 `index.js로 변환 후` 실행해야 한다.
명령어는 다음과 같다.

```bash
npx tsc
node index
```

결과로 `10 6` 이 나오면 성공이다.

그런데 매번 npx tsc를 하고 node index를 하여 실행하는게 불편할 수도 있다.
먼저 use-calc 내부에 index.js를 지우고, 이 두 명령어를 한번에 실행하는 패키지를 설치해 ts파일을 바로 실행해보자.

```bash
npm i ts-node
npx ts-node index
```

index.js가 없는데도 제대로 실행된다.
ts-node패키지가 index.ts를 index.js로 변환한 뒤 실행한 것이다.
이렇게 바로 Node.js에서 ts파일을 바로 실행하고 싶다면 `ts-node `패키지`를 사용하면 된다.

<br>

# 10.3 ts 패키지를 만들고 .d.ts 생성하기

이번엔 아예 처음부터 타입스크립트 패키지로 타이핑해보자.

```bash
mkdir calc-ts
cd calc-ts
npm init -y
npx tsc --init
```

### plus.ts

```ts
// src/plus.ts

export default (...arg: number[]) => arg.reduce((a, c) => a + c);
```

### minus.ts

```ts
// src/minus.ts

export default (a: number, b: number) => a - b;
```

### multiply.ts

```ts
// src/multiply.ts

export default (...arg: number[]) => arg.reduce((a, c) => a * c);
```

### divide.ts

```ts
// src/divide.ts

export default (a: number, b: number) => a / b;
```

### index.ts

```ts
// src/index.ts

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

### package.json

```json
{
  "name": "calc",
  "version": "1.0.0",
  "types": "src/index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

## 사용하기

### index2.ts

```ts
// use-calc/index2.ts
import calc from "../calc-ts";

const a = calc.plus(1, 2, 3, 4);
const b = calc.minus(a, 4);
calc.divide(b, 3);
calc.multiply(1, 2, 3, 4);
console.log(a, b);
```

use calc 폴더에서 ts-node로 index2를 실행하면 에러가 발생한다. 그 이유는 index.js 파일이 없기 때문에 발생하는 에러이다. 결국 Node.js가 실행하는건 자바스크립트 파일이므로 calc-ts도 자바스크립트 파일을 갖고 있어야 한다.

다만 js 파일을 src 폴더에 생성되지 않고, ts 파일과 js파일을 분리하기 위해 `dist 폴더`에 생성되게 만들어야 한다.

calc-ts 의 tsconfig.json에서 다음 세 옵션을 주석 해제하고 다음과 같이 수정한다.

### tsconfig.json

```json
{
  "declaration": true,
  "outDir": "dist",
  "declarationDir": "types"
}
```

- `declaration`: `ts`파일로부터 `.d.ts`파일을 만들어낼지 선택하는 옵션이다.
  이 옵션을 활성화하면 ts파일이 js파일로 변환될 때 `.d.ts파일도 같이 생성`된다.
- `outDir` : 결과물을 `어떤 폴더에 저장할지 선택`하는 옵션으로, 따로 지정하지 않으면 ts파일이 있는 곳에 js파일이 생성된다.
- `declarationDir`: `.d.ts`파일이 어디에 생성될지 결정하는 옵션으로, 따로 지정하지 않으면 outDir 경로에 .d.ts 파일이 생성되고, outDir도 없으면 ts 파일이 있는 곳에 .d.ts 파일이 생성된다.

이제 파일을 생성해보자.

```bash
cd ../calc-ts
npx tsc
```

dist와 types 폴더가 생성되고, dist 폴더 안에는 각 파일이 `.js`로 들어 있다.
types 폴더 안에는 divide.d.ts, index.d.ts, 등등 `.d.ts` 파일이 들어 있다.

> 🤔 각 파일들이 src 폴더 내부에 들어 있는데 왜 dist 폴더에는 src 폴더가 생기지 않을까???
> 이와 관련한 옵션이 바로 tsconfig.json 폴더에 `rootDir 옵션`과 관련이 있다.

### rootDir 옵션

따로 설정되어 있지 않으면 타입스크립트는 rootDir를 추론한다.
예를 들어 calc-ts에는 ts 파일이 없으면, 하위 폴더인 dist,src,types 폴더 안에 ts 파일을 찾는데 src 폴더 안에 ts 파일이 위치한다.

따라서 rootDir는 src 폴더로 추론된다. 만약 dist,src,types 폴더 안에도 ts파일이 없다면 다시 한 단계 더 하위 폴더에서 찾는 식이다.

이때 .d.ts 파일은 무시하므로 src폴더가 rootDir이 되는 것이다.

이렇게 추론하는 방법이 있고, 다음과 같이 직접 지정할 수 도 있다.

```json
{
  "rootDir": "."
}
```

이렇게 rootDir를 지정해주면 dist 폴더 안에 src 폴더가 생기고, 그 아래 js파일이 생성된다.

이제 js와 .d.ts 파일이 생성되었으니 package.json에서 main 속성과 types 속성을 다시 입력하면 된다.

```json
{
  "main": "dist/src/index.js",
  "types": "types/index.d.ts"
}
```

그 다음 다시 use-calc 폴더로 이동후 `npx ts-node index2`를 실행 해보면 제대로 실행되는 것을 확인할 수 있다.

이번 절에서는 ts 패키지를 직접 만들어보았다. 먼저 타입스크립트 코드를 작성하고, 원하는 경로에 js파일과 .d.ts 파일을 생성한다. 그러면 자바스크립트 코드와 타입스크립트 코드 모두 직접 만든 ts 패키지에 접근할 수 있다.

## 💫 만든 패키지를 npm에 배포하려면??

npm에 배포하는 명령어는 `npm publish`이다.
이때 package.json의 name이 선점된 이름이 아니어야 하고, npmjs.com에서 미리 같은 이름이 있는 지 확인해야 한다.

<br>

# 10.4 js 프로젝트를 ts로 전환하기

기존에 만든 calc-js 폴더를 복사하고 이름을 js-to-ts로 바꾼다.

그 다음 npx tsc --init을 실행한다.

index.js만 ts로 바꾸고, 다음과 같이 입력한다.

```ts
// src/index.ts

import plus from "./plus";
//모듈 './plus'에 대한 선언 파일을 찾을 수 없습니다. ts(7016)
import minus from "./minus";
//모듈 './minus'에 대한 선언 파일을 찾을 수 없습니다. ts(7016)
import multiply from "./multiply";
//모듈 './multiply'에 대한 선언 파일을 찾을 수 없습니다. ts(7016)
import divide from "./divide";
// /모듈 './divide'에 대한 선언 파일을 찾을 수 없습니다. ts(7016)

export default {
  plus,
  minus,
  multiply,
  divide,
};
/**
 * (property) plus: (...arg: any[]) => any
 * (property) minus: (a: any, b: any) => number
 * (property) multiply: (...arg: any[]) => any
 * (property) divide: (a: any, b: any) => number
 *
 */
```

각 파일이 타입스크립트 파일이 아니라서 any로 추론된다.이는 자바스크립트 파일을 인식하지 못하는 문제로 해결하기 위해 tsconfig.json에서 `allowJs` ,`checkJs` 옵션을 활성화한다.

- `allowJs` : 타입스크립트 프로젝트에서 자바스크립트 파일을 허용하는 옵션
- `checkJs` : 허용한 자바스크립트 파일에서 타입에러를 확인하는 옵션
  이때 checkJs가 true면 allowJs도 true가 된다.

true로 설정 후, `npx tsc`하여 변환해보면 `TS5055`에러가 발생한다.
이 에러는 변환 결과물을 출력하는 폴더가 원본 파일의 위치와 동일해서 발생하는 것이다.

tsconfig.json의 outDir옵션을 `./dist`로 수정하고 다시 `npx tsc`하여 변환하면 dist 폴더 내부에 각 파일이 생성된다.

마지막으로 package.json 의 main 속성을 수정한다. 변환한 index.js의 경로를 지정해주면 된다.

```json
{
  "main": "dist/index.js"
}
```

이때 allowJs 옵션을 활성화하지 않으면 dist 폴더에는 ts로 변환한 index.js만 생성된다.
활성화해야 자바스크립트 파일도 같이 프로젝트에 포함되어 결과물로 생성된다.
