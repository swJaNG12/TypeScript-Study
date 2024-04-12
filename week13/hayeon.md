# 스터디 13주차

### 📝 13주차 스터디 목차

<br>

- [8. Node.js 타입 분석하기](#8-nodejs-타입-분석하기)
  - [8.1 Node.js 직접 타이핑하기](#81-nodejs-직접-타이핑하기)
  - [8.2 js 파일 생성하기](#82-js-파일-생성하기)
- [실습 코드](https://github.com/cocorig/TypeScript_Study/tree/main/node)

# 8 Node.js 타입 분석하기

Node.js 가 기본으로 제공하는 내장 모듈을 활용한 코드에 대한 타입을 알아보자.

```ts
import fs from "fs";
// '모듈 '"fs"'에는 기본 내보내기가 없습니다.ts(1192)
import http from "http";
// 모듈 '"http"'에는 기본 내보내기가 없습니다.ts(1192)
import path from "path";
// '"path"' 모듈은 'esModuleInterop' 플래그를 사용하는 가져온 기본값이어야만 합니다.ts(1259)

http
  .createServer((req, res) => {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
// 'req' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.ts(7006)
// 'res' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.ts(7006)
// '__dirname' 이름을 찾을 수 없습니다.ts(2304)
// 'err' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.ts(7006)
// 'data' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.ts(7006)
```

Node.js는 기본적으로 CommonJS 모듈 시스템을 사용하므로 `import fs = require('fs')`를 하는 게 올바른 방식이다. 하지만 tsconfig.json 에서 `esModuleInterop` 옵션이 활성화돠어 있으므로 `import fs from "fs"`도 가능하다.
위의 코드에서 fs,http,path 모듈에서 전부 에러가 발생하는데 이 모듈은 npm 을 통해 설치하지 않아도 Node.js가 기본적으로 제공하는 모듈이다. 다만 타입스크립트는 이 모듈에 대한 타입 정의를 갖고 있지 않아 이 모듈이 무엇인지 알지 못하기 때문에 에러가 발생하는 것이다.
따라서 `@types/node` 패키지를 설치해야 에러가 사라진다.

```bash
npm i @types/node@18.15.3
```

이 패키지의 진입점인 index.d.ts파일부터 살펴보자.

```ts
// index.d.ts
// Reference required types from the default lib:
/// <reference lib="es2020" />
/// <reference lib="esnext.asynciterable" />
/// <reference lib="esnext.intl" />
/// <reference lib="esnext.bigint" />

// Base definitions for all NodeJS modules that are not specific to any version of TypeScript:
/// <reference path="assert.d.ts" />
/// <reference path="assert/strict.d.ts" />
/// <reference path="globals.d.ts" />
/// <reference path="async_hooks.d.ts" />
/// <reference path="buffer.d.ts" />
//....
/// <reference path="globals.global.d.ts" />
```

` <reference lib="" />`은 어떤 lib 파일을 기본적으로 포함할지를 적어둔 것이다.
`<reference path="" />`는 각각 .d.ts파일을 Node.js의 모듈과 대응한다. 이 중
`globals.d.ts`,`globals.global.d.ts`는 전역 객체에 대한 타입을 담당한다.

<br>

다음으로 fs,http,path 모듈을 차례대로 알아보자.

- fs.d.ts

```ts
// fs.d.ts
declare module "fs" {
  //..
}
declare module "node:fs" {
  export * from "fs";
}
```

- http.d.ts

```ts
// http.d.ts

declare module "http" {
  //타입스크립트에게 http 모듈이 있음을 알린다.
  //..
}
declare module "node:http" {
  export * from "http";
}
```

- path.d.ts

```ts
// path.d.ts

declare module "path/posix" {
  import path = require("path");
  export = path;
}
declare module "path/win32" {
  import path = require("path");
  export = path;
}
declare module "path" {
  const path: path.PlatformPath;
  export = path;
}
declare module "node:path" {
  import path = require("path");
  export = path;
}
```

세 파일에는 공통적으로 `declare module "모듈명"`과 `declare module "node:모듈명"` 이 들어있다. `declare module` 은 타입스크립트에게 해당 모듈이 있다는 것을 알리고, 해당 모듈에 대한 타입 선언도 이 블록 안에 있음을 알리는 선언이다. <br/>
한 가지 특이한 점은 `declare module "node:http"`처럼 앞에 `node:` 접두사가 붙은 모듈 선언이 각 패키지별로 있다는 접이다. 이는 Node.js에서 권장하는 내장 모듈 import 방법이다.

<br>

각각 `fs 와 http`에서는 ` export * from "모듈명"`으로 타이핑되어 있다.
이는 해당 모듈의 모든 것을 `import한 뒤에 다시 현재 모듈에서 export한다는 뜻`이다.

`  export * from "http"`는 http모듈의 모든 것을 import한 뒤에 그것을 node:http 모듈에서 export하는 것이다. 그러면 node:http 모듈은 http모듈과 동일한 것을 export하게 된다. 따라서 http 모듈을 import하든, node:http 모듈을 import하든 동일하게 사용할 수 있다.

`path 모듈`의 경우 import, export코드가 다르지만, 그 코드가 하는 역할은 비슷하다. node:path에서는 path의 모든 export를 `import path = require("path")`하고, 그것을 다시 ` export  = path` 를 통해 node:path에서 export하고 있다.
path 모듈만 다르게 import, export하는 이유는 path 모듈 마지막에 export = path가 되어 있기 때문에 fs와 http 모듈은 ECMAScript 모듈 방식으로 타이핑되어 있어서 ` export * from "모듈명"` 을 사용할 수 있었다.

<br>

- ` export * as 네임스페이스 from "모듈명"`
  ` export * from "모듈명"` 도 있지만 ` export * as 네임스페이스 from "모듈명"`도 있다. 모듈로부터 모든 것은 import한 후에 다시 export하는 것은 동일하나 as에 적힌 네임스페이스대로 export한다.

```ts
declare module "node:path" {
  import * as path from "path";
}
```

<br>

## 예제코드 분석

```ts
import fs from "fs";
import http from "http";
import path from "path";

http
  .createServer((req, res) => {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
```

## createServer

```ts
// http.d.ts
declare module "http" {
  //...

  function createServer<
    Request extends typeof IncomingMessage = typeof IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  >(
    requestListener?: RequestListener<Request, Response>
  ): Server<Request, Response>;
  function createServer<
    Request extends typeof IncomingMessage = typeof IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  >(
    options: ServerOptions<Request, Response>,
    requestListener?: RequestListener<Request, Response>
  ): Server<Request, Response>;

  //...
}
```

createServer에는 두 개의 오버로딩이 있고, 현재 한개의 매개변수만 사용하므로 첫 번째 오버로딩에 해당한다.

## RequestListener

```ts
// http.d.ts
declare module "http" {
  //...

  type RequestListener<
    Request extends typeof IncomingMessage = typeof IncomingMessage,
    Response extends typeof ServerResponse = typeof ServerResponse
  > = (
    req: InstanceType<Request>,
    res: InstanceType<Response> & { req: InstanceType<Request> }
  ) => void;

  //...
}
```

RequestListener 타입이 `(req, res) => { } ` 함수 부분이라는 것을 알 수 있다.
`IncomingMessage` 와 `ServerResponse` 는 모두 클래스이므로 req는`IncomingMessage`의 인스턴스, res는 `ServerResponse`의 인스턴스이다.

다시 예제코드로 돌아가서 `writeHead`와 `end`의 타입을 알아보자.

## writeHead

```ts
// http.d.ts
declare module "http" {
  //..
  class ServerResponse<
    Request extends IncomingMessage = IncomingMessage
  > extends OutgoingMessage<Request> {
    //...
    writeHead(
      statusCode: number,
      statusMessage?: string,
      headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]
    ): this;
    writeHead(
      statusCode: number,
      headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]
    ): this;
  }
  //...
}
```

writeHead 메서드는 ServerResponse안에 있는 메서드이다.

## end

```ts
// stream.d.ts

declare module "stream" {
  //..
  namespace internal {
    class Writable extends Stream implements NodeJS.WritableStream {
      end(cb?: () => void): this;
      end(chunk: any, cb?: () => void): this;
      end(chunk: any, encoding: BufferEncoding, cb?: () => void): this;
    }
    //..
  }
  //..
}
```

end 메서드 경우 stream.d.ts파일에서 확인할 수 있다.

## readFile

```ts
// fs.d.ts
declare module "fs" {
  //.
  export function readFile(
    path: PathOrFileDescriptor,
    callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void;
  export namespace readFile {
    function __promisify__(
      path: PathOrFileDescriptor,
      options?: {
        encoding?: null | undefined;
        flag?: string | undefined;
      } | null
    ): Promise<Buffer>;

    function __promisify__(
      path: PathOrFileDescriptor,
      options:
        | {
            encoding: BufferEncoding;
            flag?: string | undefined;
          }
        | BufferEncoding
    ): Promise<string>;

    function __promisify__(
      path: PathOrFileDescriptor,
      options?:
        | (ObjectEncodingOptions & {
            flag?: string | undefined;
          })
        | BufferEncoding
        | null
    ): Promise<string | Buffer>;
  }
}
```

`PathOrFileDescriptor`는 string 또는 Buffer 또는 URL 또는 number이다.
URL은 url모듈의 인스턴스이다.

Buffer 인터페이스의 타입은 다음과 같다.

## Buffer

```ts
// buffer.d.ts
declare module 'buffer' {
  //..
    global {
        //..
       interface BufferConstructor {
          //..
   interface Buffer extends Uint8Array {
        var Buffer: BufferConstructor;
   }
       }
         //..
    }
      //..
}
```

중간에 global은 declare global한 것과 동일하다. Buffer 인터페이스는 declare global 안에 들어 있으므로 따로 import하지 않아도 사용할 수 있다.

<br>
path모듈의 join메서드는 다음과 같다.

## join

```ts
declare module "path" {
  namespace path {
    interface PlatformPath {
      //..
      join(...paths: string[]): string;
      //..
    }
    //..
  }
  //..

  const path: path.PlatformPath;
  export = path;
}
```

join 메서드는 문자열들을 매개변수로 받고, 문자열을 반환하는 간단한 메서드이다. 중간에 path 네임스페이스와 Platform인터페이스가 있지만 `export path.PlatformPath` 를 하고 있으므로 import path하면 바로 `path.join`을 사용할 수 있다.

## listen

```ts
// net.d.ts
declare module "net" {
  //..
  class Server extends EventEmitter {
    constructor(connectionListener?: (socket: Socket) => void);
    constructor(
      options?: ServerOpts,
      connectionListener?: (socket: Socket) => void
    );
    //..
    listen(
      port?: number,
      hostname?: string,
      backlog?: number,
      listeningListener?: () => void
    ): this;
    listen(
      port?: number,
      hostname?: string,
      listeningListener?: () => void
    ): this;
    listen(
      port?: number,
      backlog?: number,
      listeningListener?: () => void
    ): this;
    listen(port?: number, listeningListener?: () => void): this;
    listen(
      path: string,
      backlog?: number,
      listeningListener?: () => void
    ): this;
    listen(path: string, listeningListener?: () => void): this;
    listen(options: ListenOptions, listeningListener?: () => void): this;
    listen(handle: any, backlog?: number, listeningListener?: () => void): this;
    listen(handle: any, listeningListener?: () => void): this;
  }
  //..
}
```

listen 메서드의 여러 오버로딩 중 다음 선언에 해당한다.

```ts
//..
  listen(port?: number, listeningListener?: () => void): this;
//..
```

<br>

이번에는 콜백 대신 프로미스를 사용하는 fs/promise 모듈을 사용해보자.

```ts
import fs from "fs/promises";
import http from "http";
import path from "path";

http
  .createServer(async (req, res) => {
    try {
      const data = await fs.readFile(path.join(__dirname, "index.html"));
      res.writeHead(200);
      res.end(data);
    } catch (err) {
      console.error(err);
    }
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
```

## fs/promise 모듈

```ts
// promise.d.ts


declare module 'fs/promises' {
	import { Abortable } from 'node:events';
	import {
        ObjectEncodingOptions,
        OpenDirOptions,
        OpenMode,
        PathLike,
    } from 'node:fs';
    readFile(
        options?: {
        encoding?: null | undefined;
        flag?: OpenMode | undefined;
    } | null
  ): Promise<Buffer>;
    readFile(
            options:
                | {
                      encoding: BufferEncoding;
                      flag?: OpenMode | undefined;
                  }
                | BufferEncoding
        ): Promise<string>;

        readFile(
            options?:
                | (ObjectEncodingOptions & {
                      flag?: OpenMode | undefined;
                  })
                | BufferEncoding
                | null
        ): Promise<string | Buffer>;
}
declare module 'node:fs/promises' {
    export * from 'fs/promises';
}
```

`declare module   'fs/promises'`으로 되어 있으므로 `import fs from "fs/promises"`가 가능하다.
첫 번째 매개변수인 `path`는 `pathLink`나 `FileHandle` 인터페이스를 받는다.
`fs.d.ts`의 `readFile`은 콜백 함수를 통해 Buffer 데이터를 받았다면 `promise.d.ts`의 `readFile`은 프로미스를 resolve하면 Buffer를 받을 수 있다는 점이 다르다.

# 8.1 Node.js 직접 타이핑하기

Node.js의 내장 모듈을 직접 타이핑해보는 연습을 해보자.

```ts
interface Http {}
declare const http: Http;
interface Fs {}
declare const fs: Fs;
interface Path {}
declare const path: Path;

http
  .createServer(async (req, res) => {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
    try {
      const data = await fs.promises.readFile(
        path.join(__dirname, "index,html")
      );
    } catch (error) {
      console.error(error);
    }
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
```

현재 한 파일에 코드량이 많이 때문에 타입 선언 부분을 zode.d.ts에 옮기자.

## 타입 선언 부분

```ts
// zode.d.ts

// 타입 선언 부분

// http 모듈, createServer와 req, res를 타이핑해야 한다.
interface Request {}
interface Response {
  writeHead(status: number): void;
  end(data: Buffer): void;
}
interface Server {
  listen(port: number, callback: () => void): void;
}
interface Http {
  createServer(callback: (req: Request, res: Response) => void): Server;
}
declare const http: Http;

// fs 와 path 모듈 타이핑
interface FsPromises {
  readFile(path: string): Promise<Buffer>;
}
interface Fs {
  readFile(path: string, callback: (err: unknown, data: Buffer) => void): void;
  promises: FsPromises;
}
declare const fs: Fs;
interface Path {
  join(...paths: string[]): string;
}
declare const path: Path;
/**
 * promise는 재귀를 활용해서 타이핑
 * fs.promise 또한 fs처럼 Fs  인터페이스를 사용
 * readFile의 첫 번째 오버로딩은 콜백을 사용하는 메서드이고, 두 번째는 프로미시를 반횐하는 메서드이다.
 * path.join메서드는 매개변수의 개수가 고정되어 있지 않으므로 spread문법을 사용한다.
 */
```

## 실제 코드

```ts
// zode.ts

http
  .createServer(async (req, res) => {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
    try {
      const data = await fs.promises.readFile(
        path.join(__dirname, "index,html")
      );
    } catch (error) {
      console.error(error);
    }
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
```

하지만 타입 선언 부분을 옮기면 zode.ts에서 인식을 못하기 때문에 `typings 폴더`를 만들고 그 안에 znode.d.ts를 옮기면 다시 타입을 인식하게 된다.
왜 폴더 안으로 `.d.ts`파일을 이동하면 타입을 인식하는 걸까?

> zode.ts와 zode.d.ts 처럼 같은 폴더 내에 파일명이 zode로 같을 때 타입스크립트는 zode.ts만 인식하기 때문에 다른 폴더로 옯겼을 때는 둘 다 인식하게 된다. 따라서 같은 폴더 내에서 같은 파일명으로 ts파일과 .d.ts파일을 동시에 만들면 안된다!
> .d.ts 로 타입을 분리할 때는 같은 폴더 안에 있다면 파일명이 달라야 한다.

여기서 tsconfig.json의 옵션 한 가지를 알아보자.
바로 특정 파일이나 폴더를 타입스크립트가 인식하지 못하게 만드는 `exclude` 옵션이다.
이때 `compilerOptions` 내부가 아니라 `외부`에 선언해야 한다는 것을 주의하자.
반대로 인식할 파일을 지정하는 `include` 옵션도 있다. 기본값은 `**`(현재 폴더의 모든 하위 폴더와 파일을 의미하는 문자열)이므로, 따로 설정하지 않아도 폴더의 모든 파일을 다 포함한다.

# 8.2 js 파일 생성하기

이번에는 예제코드를 js파일로 변환해보자.

먼저 타입스크립트가 어떤 파일을 인식하고 있는지 보려면 compilerOptions안에 "listFiles": true로 설정해야 한다.

이렇게 설정하고 터미널에 ` npx tsc`를 실행하면 타입스크립트가 인식하고 있는 파일 목록이 같이 뜬다.
왜 인식하고 있는지 알고 싶다면 `explainFiles` 를 활성화하면 된다.

Node.js는 ECMAScript 모듈 시스템도 지원하므로 ECMAScript 모듈 시스템을 위해 변환하는 방법도 알아보자.

먼저 예제코드 파일 확장자를 `mts`로 변경하고, tsconfig.json의 module도 NodeNext로 수정한다.

이제 다시 `npx tsx`를 실행하면 변환된 mjs파일이 생성된다.

```js
import fs from "fs";
import http from "http";
import path from "path";
http
  .createServer((req, res) => {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
```

이 mjs파일은 Node.js에서 바로 사용할 수 있는 파일로 Node.js에서 ECMAScript 모듈 시스템을 사용하고 싶을 때는 mts파일에 타입스크립트 코드를 작성한 후 자바스크립트로 변환하면 된다.
