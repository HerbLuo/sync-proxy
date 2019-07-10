# sync-proxy
`[sync-proxy]` 将异步链的写法改为同步链的写法.

`[sync-proxy]` 具有一流的 `typescript` 支持. 

-----

### 1. Usages

##### install 

`yarn add @o2v/sync-proxy`  

`npm i @o2v/sync-proxy --save`

File `index.js`:
```javascript
import { syncProxy } from '@o2v/sync-proxy'
import task from './task.js'

const taskSync = syncProxy(task)

taskSync
  .task 
  .taskPromise       // taskPromise 原本是一个Promise对象
  .getTaskPromise()  // getTaskPromise 原本返回一个Promise
  .getSuccess()
  .then(console.log) // print 'success'

```

File `task.js`:
```javascript
class Task {
  constructor () {
    this.task = this
    this.taskPromise = Promise.resolve(this)
    this.getTaskPromise = () => this.taskPromise
    this.success = 'success'
    this.successPromise = Promise.resolve(this.success)
    this.getSuccess = () => this.success
    this.getSuccessPromise = () => this.successPromise
  }
}

const task = new Task()
export default task

```

如果不使用 syncProxy, 你可能需要这样写代码:
```javascript
import { syncProxy } from '@o2v/sync-proxy'
import task from './task.js'

const getSuccess = async () => {
  const task2 = await taskSync
    .task
    .taskPromise
  
  const task3 = await task2
    .getTaskPromise()
  
  const result = task3
    .getSuccess()

  console.log(result) // print 'success'
}

getSuccess()

```

##### Edit in RunKit + npm
```javascript
var { syncProxy } = require('@o2v/sync-proxy')

class Task {
  constructor () {
    this.task = this
    this.taskPromise = Promise.resolve(this)
    this.getTaskPromise = () => this.taskPromise
    this.success = 'success'
    this.successPromise = Promise.resolve(this.success)
    this.getSuccess = () => this.success
    this.getSuccessPromise = () => this.successPromise
  }
}

const task = new Task()
const taskSync = syncProxy(task)

taskSync
  .getTaskPromise()
  .success
  .then(console.log) // print 'success'

taskSync
  .task
  .taskPromise
  .getTaskPromise()
  .getSuccess()
  .then(console.log) // print 'success'
  
taskSync
  .getTaskPromise()
  .getTaskPromise()
  .taskPromise
  .task
  .task
  // any sync and async properties or calls ....
  .getSuccessPromise()
  .then(console.log) // print 'success'
```

### 2. 这是目前发现的唯一的坑

##### 1. 如果被`ayncProxy`封装的对象是一个代理，或者他的某个属性或方法返回一个代理，务必在代理中处理`then`（使该代理逃避`isPromise`的检测）.
```javascript
class Task {
  proxyReturningFunc() {
    return new Proxy({}, {
      get(_, key, receiver) {
        if (key === 'then') { // it's important
          return undefined
        }
        return (...args) => {}
      }
    })
  }
}
```
