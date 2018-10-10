# sync-proxy
[sync-proxy] let you write async task chains using synchronous syntax.

### usage

##### install 

`yarn add @o2v/sync-proxy`  

`npm i @o2v/sync-proxy --save`

##### for module

file: `index.js`:
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

file: `task.js`:
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

##### for RunKit + npm
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
  // any sync or async property or call ....
  .getSuccessPromise()
  .then(console.log) // print 'success'

```
