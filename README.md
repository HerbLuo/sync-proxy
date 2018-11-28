# sync-proxy
[sync-proxy] let you write async task chains using synchronous syntax.

[sync-proxy] has first-class `typescript` support to help build robust applications. 

-----

### 1. Usages

##### install 

`yarn add @o2v/sync-proxy`  

`npm i @o2v/sync-proxy --save`

File `index.js`:
```javascript
import syncProxy from '@o2v/sync-proxy'
import task from './task.js'

const taskSync = syncProxy(task)

taskSync
  .task
  .taskPromise
  .getTaskPromise()
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

Before using syncProxy, u should:
```javascript
import syncProxy from '@o2v/sync-proxy'
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
var syncProxy = require('@o2v/sync-proxy')

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

### 2. Notifications

##### 1. if an async task returning a proxy, make it promise-unlike.
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

### 3. Limitations

##### 1. you will never console.log or serialize a synced object
```javascript
console.log(taskSync.taskPromise) // stack overflow error
console.log(await taskSync.taskPromise) // it may work
```
##### 2. [BUG] promise.then do not return a promise, it will be fixed in the next release.
```javascript
taskSync.taskPromise.getSuccessPromise()
  .then(console.log) // print success
  .then(console.log) // unable run as expected
```
##### 3. typeof do not work
