import '../setup.mock.js'
import { expect } from 'chai'
import { shallowMount, Wrapper } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import { VProgressLinear } from 'vuetify/lib'


// TODO: Create a declaration file for this dependency, so typescript won't complain anymore
// Seems that Mocha is just not the move.. we want to move towards jest for automatic JSDom inclusion

// await firebase.loadFirestoreRules({projectId: 'testId', rules: ''})
  // console.log(firebase)
  // const testFirebase = initializeTestApp({
  //   projectId: "my-test-project",
  //   auth: { uid: "alice", email: "alice@example.com" }
  // })

describe('HelloWorld', () => {
  let subject: Wrapper<Home>;
  beforeEach(() => {
    subject = shallowMount(Home, {});
  })
  test('Should have "start-loading" transition', () => {
    expect(subject.get('[name=start-loading]').exists()).to.equal(true)
  });
  
  test('Should display waiting test when the app has not been initialized yet', () => {
    expect(subject.get('[name=start-loading] .start-loading').text()).to.equal('Please wait.. Loading. Voting will begin shortly.')
  });

  test('Should show progress linear bar when the app has not been initialized yet', () => {
    expect(subject.findComponent(VProgressLinear).exists()).to.equal(true)
  });
})

  

  

  
