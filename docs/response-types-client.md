# @prequest/response-types-client

Restful-API 响应的 JSON 数据的 TypeScript 类型生成器

## 安装

```bash
npm install @prequest/response-types-client
```

## 前言

在前端项目中，没有 fs 等 API，导致不能在运行时，动态生成 Restful-API 响应的 JSON 数据的类型文件。

因而我尝试开发了 [@prequest/response-types-generator](https://github.com/xdoer/PreQuest/tree/main/packages/response-types-generator)，它根据配置，可以发起请求和解析响应，最后生成类型文件。但缺点也很明显，需要将要项目中请求的接口一个一个配置到配置文件中。普通的 Get 请求还好说，但对于 Post 请求，一些复杂的传参，也不是很好处理。

本项目解决了上述问题。原理非常简单，首先开启一个 Http Server，然后在前端项目的请求库中间件中，将请求的参数和响应结果，通过一个新的请求实例，发送到 Http Server 中，Http Server 根据传参，利用 fs API 向指定目录生成类型文件即可。

项目分为两部分 [@prequest/response-types-server](https://github.com/xdoer/PreQuest/blob/main/packages/response-types-server) 与 [@prequest/response-types-client](https://github.com/xdoer/PreQuest/blob/main/packages/response-types-client)

## 使用

原项目在每次发起 HTTP 请求时，中间件会向 `@prequest/response-types-server` 发起生成类型文件的请求

```ts
import { create, prequest, Request, Response } from '@prequest/xhr'
import generatorMiddleware from '@prequest/response-types-client'

const middleware = generatorMiddlewareWrapper<Request, Response>({
  enable: process.env.NODE_ENV === 'development',
  httpAgent: create({ path: 'http://localhost:10010/' }),
  requestId(opt) {
    return defaultOutPutFileName(opt)
  },
  parseResponse(res) {
    return res as any
  },
  typesGeneratorConfig(req, res) {
    const outputName = defaultOutPutFileName(req)
    const rootInterfaceName = defaultRootInterfaceName(req)

    return {
      data: res.data,
      outPutPath: `/Users/luckyhh/Desktop/project/prequest2/examples/web/src/types/${outputName}.ts`,
      rootInterfaceName: rootInterfaceName,
      overwrite: false,
    }
  },
})

prequest.use(middleware)
```

## 配置

### 中间件参数

| 参数                 | 类型                          | 必填 | 含义                                    |
| -------------------- | ----------------------------- | ---- | --------------------------------------- |
| enable               | boolean                       | 否   | 开启中间件                              |
| outPutDir            | string                        | 是   | 类型文件输出目录                        |
| httpAgent            | PreQuestInstance              | 是   | 发起请求                                |
| parseResponse        | (res) => CommonObj            | 否   | 解析 httpAgent 响应，需要返回接口响应值 |
| typesGeneratorConfig | (req, res) => GeneratorConfig | 是   | json-types-generator 工具的参数         |

### GeneratorConfig

| 参数          | 类型    | 必填 | 含义              |
| ------------- | ------- | ---- | ----------------- |
| data          | Json    | 是   | 要生成类型的 JSON |
| outPutName    | string  | 是   | 类型文件名称      |
| interfaceName | string  | 是   | 导出的接口名称    |
| overwrite     | boolean | 是   | 类型文件可复写    |