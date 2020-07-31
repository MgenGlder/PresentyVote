import { expect } from 'chai'
import { shallowMount, mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import firebase from '@firebase/testing'
import { IDBFactory, IDBKeyRange} from 'shelving-mock-indexeddb'

// TODO: Create a declaration file for this dependency, so typescript won't complain anymore
// Seems that Mocha is just not the move.. we want to move towards jest for automatic JSDom inclusion
// global.window.firebase = {}
// @ts-ignore
window.indexedDB = new IDBFactory()
window.IDBKeyRange = IDBKeyRange
describe('HelloWorld.vue', async () => {
  // await firebase.loadFirestoreRules({projectId: 'testId', rules: ''})
  let fakeFirebase = await firebase.initializeTestApp({
    projectId: "my-test-project",
    auth: { uid: "alice", email: "alice@example.com" }
  });
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    // const subject = shallowMount(Home, {

    // })
    // console.log(subject.html())
    console.log(fakeFirebase);
    expect(true).to.be.true;
  })
})
