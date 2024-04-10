# 스터디 13주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 13주차 스터디 목차

- [8. Node.js 타입 분석하기](#8-nodejs-타입-분석하기)
  - [http 모듈의 createServer 타입분석](#http-모듈의-createserver-타입분석)
  - [fs 모듈의 readFile 타입 분석](#fs-모듈의-readfile-타입-분석)
  - [path 모듈의 join 타입 분석](#path-모듈의-join-타입-분석)
  - [listen 메서드 타입 분석](#listen-메서드-타입-분석)
- [8.1 Node.js 직접 타이핑하기](#81-nodejs-직접-타이핑하기)
  - [8.1.1 http 모듈 타이핑](#811-http-모듈-타이핑)
  - [8.1.2 fs, path 모듈 타이핑](#812-fs-path-모듈-타이핑)
  - [8.1.3 타입 선언 부분과 실제 코드 분리](#813-타입-선언-부분과-실제-코드-분리)
  - [8.1.4 .d.ts 파일이 이동하면 타입을 인식하는 이유](#814-dts-파일이-이동하면-타입을-인식하는-이유)

<br>

# 8. Node.js 타입 분석하기

Node.js는 자바스크립트 런타임이므로 여기서는 Node.js가 기본으로 제공하는 내장 모듈을 활용한 코드에 대한 타입을 분석합니다.
test.ts

```ts
import fs from "fs";
// 'fs' 모듈 또는 해당 형식 선언을 찾을 수 없습니다.ts(2307)
import http from "http";
// 'http' 모듈 또는 해당 형식 선언을 찾을 수 없습니다.ts(2307)
import path from "path";
// 'path' 모듈 또는 해당 형식 선언을 찾을 수 없습니다.ts(2307)

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

fs, http, path 모듈은 Node.js가 기본적으로 제공하는 모듈입니다. 현재 에러가 발생하는 이유는 타입스크립트가 이 모듈에 대한 타입 정의를 갖고 있지 않아, fs, http, path 모듈을 모르기 때문입니다.

Node.js 모듈을 위한 타입은 @types/node 패키지에 있습니다.

```shell
npm i @types/node@18.15.3
```

index.d.ts

```ts
/// <reference path="fs.d.ts" />
/// <reference path="http.d.ts" />
/// <reference path="path.d.ts" />
```

`<reference path />` 의 각각의 .d.ts 파일은 Node.js 모듈과 대응됩니다.

test.ts에서는 fs, http, path 모듈을 사용하므로 fs.d.ts, http.d.ts, path.d.ts 파일을 살펴보겠습니다.

fs.d.ts

```ts
declare module "fs" {}
declare module "node:fs" {
  export * from "fs";
}
```

http.d.ts

```ts
declare module "http" {}
declare module "node:http" {
  export * from "http";
}
```

path.d.ts

```ts
declare module "path/posix" {
  import path = require("path");
  export = path;
}
declare module "path/win32" {
  import path = require("path");
  export = path;
}
declare module "path" {}
declare module "node:path" {
  import path = require("path");
  export = path;
}
declare module "node:path/posix" {
  import path = require("path/posix");
  export = path;
}
declare module "node:path/win32" {
  import path = require("path/win32");
  export = path;
}
```

공통적으로 `declare module '모듈명'`, `declare module 'node:모듈명'` 이 있습니다

declare module은 타입스크립트에게 해당 모듈이 있다는 걸 알리고, 헤당 모듈에 대한 타입 선언도 이 블록 안에 있음을 알립니다. 예를 들어 declare module 'http'는 타입스크립트에 http 모듈이 있음을 알립니다. 그래서 import http from 'http'를 한 경우, 타입스크립트는 http 모듈에 대한 타입을 declare module 'http' 블록에서 확인합니다.

그리고 declare module 'node:모듈명' 처럼 앞에 node: 가 붙은 모듈 선언이 각 패키지별로 있습니다. Node.js에서 권장하는 내장 모듈 import 방식입니다. 아래처럼 import부분을 수정해도 기존과 동일하게 작동합니다.

test.ts

```ts
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
```

`declare module node:` 부분만 모아서 보겠습니다.

```ts
// fs
declare module "node:fs" {
  export * from "fs";
}

// http
declare module "node:http" {
  export * from "http";
}

// path
declare module "node:path" {
  import path = require("path");
  export = path;
}
```

fs, http는 export \* from '모듈명'으로 타이핑되어 있습니다. 해당 모듈의 모든 것을 import한 뒤에 다시 현재 모듈에서 export 한다는 것입니다. 따라서 `node:'모듈명'` 모듈은 모듈과 동일한 것을 export 하게 됩니다.

path 모듈 코드도 하는 역할은 비슷합니다. path의 모든 것을 import하고, 그것을 다시 export = path로 export 합니다. path 모듈에서만 다른 이유는 fs,http 와 다른 방식으로 타이핑되어 있기 때문입니다.

<br>

이제 test.ts 코드를 분석해봅시다.

```ts
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

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

### http 모듈의 createServer 타입분석

```ts
declare module "http" {
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
}
```

매개변수 1개, 매개변수 2개, 총 2개의 오버로딩이 있습니다. test.ts에서는 1개만 사용하므로 첫 번째 오버로딩입니다. 매개변수 타입에 해당하는 `RequestListener`의 타입을 보겠습니다.

```ts
type RequestListener<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse
> = (
  req: InstanceType<Request>,
  res: InstanceType<Response> & { req: InstanceType<Request> }
) => void;
```

RequestListener 타입이 (req, res) => {} 함수 부분잉라는 것을 알 수 있습니다. IncomingMessage, ServerResponse는 모두 클래스이므로 req, res는 각 클래스의 인스턴스입니다. 따라서 req, res에 어떤 속성이 있는지 확인하려면 각 클래스의 속성을 확인하면 됩니다.

<br>

이번에는 res의 속성인 writeHead, end의 타입을 보겠습니다.

```ts
declare module "http" {
  class ServerResponse<
    Request extends IncomingMessage = IncomingMessage
  > extends OutgoingMessage<Request> {
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
}
```

writeHead 메서드는 ServerResponse 클래스의 메서드입니다.

```ts
declare modeul 'stream' {
  namespace internal {
    class Writable extends Stream implements NodeJS.WritableStram {
      end(cb?: () => void): this;
      end(chunk: any, cb?: () => void): this;
      end(chunk: any, encoding: BufferEncoding, cb?: () => void): this;
		}
	}
}
```

end 메서드는 stream.d.ts 파일에서 열립니다. 왜 stream.d.ts 파일이 열렸는지 추적하려면 ServerResponse에서 부터 부모 클래스의 타입을 확인해야 합니다.

```ts
declare module "http" {
  import * as stream from "node:strean";
  class OutgoingMessage<
    Request extends IncomingMessage = IncomingMessage
  > extends stream.Writable {}
  class ServerResponse<
    Request extends IncomingMessage = IncomingMessage
  > extends OutgoingMessage<Request> {}
}
```

ServerResponse의 부모 클래스가 OutgoingMessage이고, OutgoingMessage의 부모 클래스가 stream.Writable 입니다. stream 모듈에는 중간에 namespace internal이 있는데 stream.Writable 로 접근할 수 있는 이유는 stream.d.ts의 타입 선언을 보면 알 수 있습니다.

```ts
declare module "stream" {
  export = internal;
}
declare module "node:stream" {
  import stream = require("stream");
  export = stream;
}
```

node:stream 모듈은 stream 모듈의 타입을 import한 후 다시 export하는데, import 하는 stream 타입이 internal 네임스페이스입니다. node:stream 자체가 internal 네임스페이스이므로 stream이 internal 네입스페이스입니다.

### fs 모듈의 readFile 타입 분석

fs.d.ts

```ts
declare module "fs" {
  import { URL } from "node:url";
  export type PathLike = string | Buffer | URL;
  export type PathOrFileDescriptor = PathLike | number;
  export function readFile(
    path: PathOrFileDescriptor,
    options:
      | ({
          encoding?: null | undefined;
          flag?: string | undefined;
        } & Abortable)
      | undefined
      | null,
    callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void;
  export function readFile(
    path: PathOrFileDescriptor,
    options:
      | ({
          encoding: BufferEncoding;
          flag?: string | undefined;
        } & Abortable)
      | BufferEncoding,
    callback: (err: NodeJS.ErrnoException | null, data: string) => void
  ): void;
  export function readFile(
    path: PathOrFileDescriptor,
    options:
      | (ObjectEncodingOptions & {
          flag?: string | undefined;
        } & Abortable)
      | BufferEncoding
      | undefined
      | null,
    callback: (err: NodeJS.ErrnoException | null, data: string | Buffer) => void
  ): void;
  export function readFile(
    path: PathOrFileDescriptor,
    callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void;
}
```

4개의 오버로딩중 마지막에 해당합니다.

마지막 오버로딩인 readFile 에서는 path, callback 2개의 매개변수를 가집니다. path는 `PathOrFileDescriptor`, callback은 `(err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void;` 콜백함수입니다.

PathOrFileDescriptor는 `string | Buffer | URL | number` 입니다. <br>
URL은 url 모듈의 URL 인스턴스입니다. <br>
Buffer는 buffer.d.ts에 있는 Buffer 인터페이스입니다.

```ts
declare module "buffer" {
  global {
    interface Buffer extends Uint8Array {}
  }
}
```

<br>

### path 모듈의 join 타입 분석

```ts
declare module 'path' {
	namespace path {
		interface PlatformPath {
			join(...paths: string[]): string;
		}
	}
	cosnt path: path.PlatformPath;
	export = path;
}
```

join 메서드는 문자열들을 매개변수로 받고, 문자열을 반환합니다. 중간에 namespace path, interface PlatfromPath가 있지만 path.PlatfromPath를 export 하고 있으므로 import path 하면 바로 path.join을 사용할 수 있습니다.

<br>

### listen 메서드 타입 분석

net.d.ts

```ts
declare module "net" {
  class Server extends EventEmitter {
    constructor(connectionListener?: (socket: Socket) => void);
    constructor(
      options?: ServerOpts,
      connectionListener?: (socket: Socket) => void
    );
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
}
```

net.d.ts로 이동합니다. createServer의 반환값 타입이 `Server<Request, Response>`이고 Server 클래스는 NetServer를 extends 하고 있꼬, NetServer는 net.d.ts의 Server listen 메서드를 가지고 있습니다.

```ts
declare module 'http' {
	import { TcpSocketConnectOpts, Socket, Server as NetServer, LookupFunction } from 'node:net';
	class Server<
        Request extends typeof IncomingMessage = typeof IncomingMessage,
        Response extends typeof ServerResponse = typeof ServerResponse,
    > extends NetServer {
        constructor(requestListener?: RequestListener<Request, Response>);
        constructor(options: ServerOptions<Request, Response>, requestListener?: RequestListener<Request, Response>);
}
```

test.ts의 listen에 해당하는 오버로딩은 아래와 같습니다.

```ts
declare module "net" {
  class Server extends EventEmitter {
    listen(port?: number, listeningListener?: () => void): this;
  }
}
```

<br>

이번에는 fs/promises 모듈을 사용해보겠습니다.

promise.ts

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
    } catch (error) {
      console.error(err);
    }
  })
  .listen(8000, () => {
    console.log("서버 시작됨");
  });
```

fs/promises 모듈은 다음 파일에 있습니다.
node_modules/@types/node/fs/promises.d.ts

```ts
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

3개의 readFile 오버로딩중 3번쨰에 해당합니다.

첫 번쨰 매개변수인 path는 `PathLike`나 `FileHandle` 인터페이스를 받습니다. 반환값의 타입은 `Promise<string | Buffer>;` 입니다.

fs.d.tsd의 readFile은 콜백함수를 통해 Buffer 데이터를 받았다면 promises.d.ts의 readFile은 프로미스를 resolve하면 Buffer를 받을 수 있씁니다

## 8.1 Node.js 직접 타이핑하기

Node.js 내장 모듈을 직접 타이핑해보는 연습을 해보겠습니다.

znode.ts

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

### 8.1.1 http 모듈 타이핑

http 모듈부터 타이핑하겠습니다. createServer와 req, res를 타이핑해야 합니다.

먼저 Http 인터페이스에 createServer 함수를 타이핑합니다.

- createServer는 콜백함수를 매개변수로 가지고, Server 객체를 반환합니다.

```ts
interface Http {
  createServer(callback: (req, res) => void): Server;
}
```

req, res는 각각 Request 타입, Response 타입입니다.

```ts
interface Http {
  createServer(callback: (req: Request, res: Response) => void): Server;
}
```

Server는 listen 함수를 가지고 있어야 합니다.

- listen 함수는 현재 코드에서 반환값이 없고, 매개변수로 포트번호와 콜백함수를 가집니다.
- 콜백함수는 매개변수가 없고 아무값도 반환하지 않습니다.

```ts
interface Server {
  listen(port: number, callback: () => void): void;
}
interface Http {
  createServer(callback: (req: Request, res: Response) => void): Server;
}
```

res의 타입인 Responses는 writeHead, end 함수를 가집니다.

- writeHead는 status값을 받고 반환값이 없습니다.
- end는 data를 받고 반환값이 없습니다. data의 타입은 Buffer로 합니다.

```ts
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
```

<br>

### 8.1.2 fs, path 모듈 타이핑

Fs 인터페이스 먼저 타이핑하겠습니다.

- Fs는 readFile이 있습니다. readFile은 콜백함수를 받는 오버로딩과 프로미스를 반환하는 오버로딩 총 2개의 오버로딩이 있습니다
- 콜백함수를 사용하는 오버로딩은 path, callback을 매개변수로 하고, 반환값이 없습니다. 이때 콜백함수는 err,과 data를 매개변수로하고 반환값이 없습니다.
- fs.promises 도 fs처럼 Fs 인터페이스를 사용합니다.

```ts
interface Fs {
  readFile(path: string, callback: (err: unknown, data: Buffer) => void): void;
  readFile(path: string): Promise<Buffer>;
  promises: Fs;
}
declare const fs: Fs;
interface Path {}
declare const path: Path;
```

Path 인터페이스를 타이핑하겠습니다.

- Path는 join 메서드가 있습니다.
- join 메서드는 경로들을 받는 paths 매개변수가 있고 문자열을 반환합니다.

```ts
interface Fs {
  readFile(path: string, callback: (err: unknown, data: Buffer) => void): void;
  readFile(path: string): Promise<Buffer>;
  promises: Fs;
}
declare const fs: Fs;
interface Path {
  join(...paths: string[]): string;
}
declare const path: Path;
```

이렇게 타입을 작성하면 에러는 모두 사라집니다.

하지만 Fs인터페이스에는 문제가 있습니다. promises 속성을 재귀 타입으로 만들었기 때문에 fs.promises.promises.promises 같은 코드가 가능해집니다. 그리고 fs.promise.readFile이 아닌 fs.readFule도 프로미스를 반환하는 문제가 발생할 수 있습니다.

이를 위해 Fs와 FsPromises 인터페이스로 각각 나눠줍니다.

```ts
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
```

이렇게 나눠주면 fs.promises로 접근하면 FsPromises 인터페이스를 사용하기 때문에 promises가 여러번 붙고, 잘못된 오버로딩을 방지할 수 있습니다.

### 8.1.3 타입 선언 부분과 실제 코드 분리

현재 znode.ts에 declare 부분과 실제 코드가 같이 있어 코드양이 많습니다. 타입 선언 부분을 타입 선언 파일로 옮기겠습니다.

znode.d.ts 파일을 만들어 타입 부분만 옮깁니다.

znode.d.ts

```ts
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
```

znode.ts

```ts
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

타입 선언 부분을 옮기면 znode.ts에서 인식을 하지 못합니다. node 폴더안에 typings 폴더를 만들고 znode.d.ts를 옮깁니다.

### 8.1.4 .d.ts 파일이 이동하면 타입을 인식하는 이유

znode.ts와 znode.d.ts처럼 같은 폴더 내에 파일명이 znode로 같을 때 타입스크립트는 znode.ts만 인식하기 때문입니다.

이 문제를 해결하기 위해서는 .d.ts 파일이름을 ts파일과 다른 이름으로 지정하던가 아니면, .d.ts 파일을 다른 폴더로 옮겨야 합니다. 다른 폴더로 옮겼을 때는 둘 다 인식합니다. 따라서 같은 폴더 내에서 같은 파일명으로 ts파일과 .d.ts파일을 동시에 만들면 안 됩니다.

znode.ts의 이름을 znodeType.d.ts로 바꾸고 다시 znode.ts 파일이 있는 폴더로 이동하면 znode.ts가 타입을 인식합니다.
