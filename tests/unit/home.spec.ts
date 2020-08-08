import {firebase, clearFirestoreData} from '../setup.mock'
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

describe('Home', () => {
  let subject: Wrapper<Home>;
  let testFirebase: firebase.firestore.Firestore;
  beforeEach(async () => {
    testFirebase = firebase.firestore()
    // TODO: Figure out why clearing data presents problems.
    // I think it's because of the vue-firestore issue. We need to make a pull request to fix that stuff.
    await clearFirestoreData({projectId: 'test'})
    subject = shallowMount(Home, {});
  })
  test('Should have "start-loading" transition', () => {
    expect(subject.get('[name=start-loading]').exists()).to.equal(true)
  });
  
  test('Should display waiting text when the app has not been initialized yet', () => {
    expect(subject.get('[name=start-loading] .start-loading').text()).to.equal('Please wait.. Loading. Voting will begin shortly.')
  });

  test('Should show progress linear bar when the app has not been initialized yet', () => {
    expect(subject.findComponent(VProgressLinear).exists()).to.equal(true)
  });

  test('Should not display waiting text when the app has topics chosen', async () => {
    // TODO: Fix Jest async waiting issues w/ test after all tests have finished.
    await testFirebase.collection(new Date().toDateString()).doc('current-ballot').set({name: 'test-ballot'});
    expect(subject.find('[name=start-loading] .start-loading').exists()).to.equal(false)
  });
})

  

  

  
