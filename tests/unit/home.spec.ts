import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import firebase from '@firebase/testing'

// TODO: Create a declaration file for this dependency, so typescript won't complain anymore
// Seems that Mocha is just not the move.. we want to move towards jest for automatic JSDom inclusion

// @ts-ignore
global.window.firebase = {
  firestore(){}
}

console.log(firebase)

test('HelloWorld.vue', async () => {
  

  
  // await firebase.loadFirestoreRules({projectId: 'testId', rules: ''})
  // console.log(firebase)
  firebase.initializeTestApp({
    projectId: "my-test-project",
    auth: { uid: "alice", email: "alice@example.com" }
  });
  
  // const wrapper = shallowMount(Home, {
  // });
  // expect(wrapper).to.not.be.null;
  // it('renders props.msg when passed', () => {
  //   const msg = 'new message'
  //   // const subject = shallowMount(Home, {

  //   // })
  //   // console.log(subject.html())
  //   console.log(fakeFirebase);
    expect(true).to.be.true;
  })
// })
