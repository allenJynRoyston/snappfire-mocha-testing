/* global describe, it */
const chai = require("chai");
chai.use(require("chai-http")); //For API Testing
const axios = require("axios");
const server = require("../server");

let assert = chai.assert;
let should = chai.should();
let request = chai.request;
let expect = chai.expect;

let urlRoot = "https://snappfire-db.herokuapp.com";
let urlAPI = "https://snappfire-db.herokuapp.com/api/v2";


if(false){
  //---------------------------------------------------------------------
  describe("Account creation:", function() {
    let success, user, token;
    
    let firstname = 'Firstname',
        lastname = 'Lastname',
        gender = 'Male',
        alias = 'firstname_lastname',
        description = 'Short description.',
        profession = 'profession description',     
        street1 = '123',
        street2 = 'Fake Street',
        street3 = 'UK',
        postcode = '12345',
        city = 'Glasgow',
        state = 'Scotland',
        country = 'UK',
        isTest = true;        

    let email = `accounttest${Math.random().toString(36).substring(7)}@test.com`,
        password = 'password',
        pin = '1234',
        accountType = 'basic';    

    before(async () => {          
      let res = await axios.post(urlAPI + "/account/create", {firstname, lastname, gender, alias, email, password, pin, description, profession, street1, street2, street3, postcode, city, state, country, accountType, isTest})      
      success = res.data.success
      user = res.data.user      
    })

    it("Creating an account is successful.", function() {
      success.should.equal(true);
    });
    
    it("User has the correct details", function() {     
      user.firstname.should.equal(firstname)
      user.lastname.should.equal(lastname)
      user.gender.should.equal(gender)
      user.alias.should.equal(user.slug)
      user.description.should.equal(description)
      user.profession.should.equal(profession)  
      user.street1.should.equal(street1)  
      user.street2.should.equal(street2)  
      user.street3.should.equal(street3)        
      user.postcode.should.equal(postcode)        
      user.city.should.equal(city) 
      user.state.should.equal(state)
      user.country.should.equal(country)
      user.isTest.should.equal(isTest)
      user.email.should.equal(email)
      user.accountType.should.equal(accountType)
    });   
    
    it("User can login with pin", async function(){      
      let res = await axios.post(urlAPI + "/account/login/pin", {email, pin});     
      let {success, user, token} = res.data
      success.should.equal(true)
      assert.isString(token)
      token = token
    })    
    
    it("User can log in with email", async function(){      
      let res = await axios.post(urlAPI + "/account/login/email", {email, password});      
      let {success, user, token} = res.data
      success.should.equal(true)
      assert.isString(token)
      token = token
    })
    
    // it("User can update their pin", async function(){      
    //   let res = await axios.post(urlAPI + "/account/changepin", {password, newpin: '0987'});      
    //   console.log(res.data)      
    // })
            

    
    it("User shows up in searches, and there should only be one:", async function(){            
      let res = await axios.get(urlAPI + "/user/_id/" + user._id);      
      let {success, count, payload} = res.data
      success.should.equal(true)
      count.should.equal(1)
      payload.firstname.should.equal(firstname)
      payload.lastname.should.equal(lastname)
    })   
    
    it("User shows up in metadata searches.", async function(){      
      let res = await axios.post(urlAPI + "/user/metadata/ids", {ids: [user._id]});      
      let {success, payload} = res.data
      let _user = payload[0]
      success.should.equal(true)
      _user.firstname.should.equal(firstname)
      _user.lastname.should.equal(lastname)
      _user.profession.should.equal(profession)
      _user.city.should.equal(city)
    })   
    
    // it("User can update their alias", async function(){      
    //   let res = await axios.post(urlAPI + "/user/patch/alias", {);      
    //   console.log(res.data)      
    // })
            
        

 
  });
  //---------------------------------------------------------------------
}