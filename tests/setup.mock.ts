
import {initializeTestApp} from '@firebase/testing' 
// @ts-ignore
import EventSource from 'eventsourcemock'

const testFirebase = initializeTestApp({
    projectId: "my-test-project",
    auth: { uid: "alice", email: "alice@example.com" }
});

Object.defineProperty(window, 'firebase', {
  writable: true,
  value: testFirebase
});
Object.defineProperty(window, 'EventSource', {
  value: EventSource
})

export {testFirebase as firebase, EventSource as eventSource}
// Doesn't seem to work, setting the innerHTML explicitely
// console.log('setting the app on the body')
// Object.defineProperty(document.body, 'innerHTML', {
//   writable: true,
//   value: "<div id='app'></div>"
// })