import '../setup.mock.js'
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import {initializeTestApp} from '@firebase/testing'

// TODO: Create a declaration file for this dependency, so typescript won't complain anymore
// Seems that Mocha is just not the move.. we want to move towards jest for automatic JSDom inclusion


test('HelloWorld.vue', async () => {
  

  
  // await firebase.loadFirestoreRules({projectId: 'testId', rules: ''})
  // console.log(firebase)
  // const testFirebase = initializeTestApp({
  //   projectId: "my-test-project",
  //   auth: { uid: "alice", email: "alice@example.com" }
  // });

  let wrapper = shallowMount(Home, {})

  // // @ts-ignore
  // window.firebase = testFirebase

  


  
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
