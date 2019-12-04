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

if(true){
  //---------------------------------------------------------------------
  describe("Account creation:", function() {
    let success, user, logintoken;
    
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

    let email = 'email_' + Math.random().toString(36)+ '_@test.com',
        password = 'password',
        pin = '1234',
        accountType = 'basic';    
    
    let newslug = 'slug_' + Math.random().toString(36),
        newpassword = 'newpassword'
    
    let createdSnapp;

    //---------------------------------------------------
    before(async () => {        
      let res = await axios.post(urlAPI + "/account/create", {firstname, lastname, gender, alias, email, password, pin, description, profession, street1, street2, street3, postcode, city, state, country, accountType, isTest})      
      success = res.data.success
      user = res.data.user      
    })
    //---------------------------------------------------    
    
    //---------------------------------------------------
    it("Creating an account is successful.", function() {
      success.should.equal(true);
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
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
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("User can login with pin", async function(){      
      let res = await axios.post(urlAPI + "/account/login/pin", {email, pin});     
      let {success, user, token} = res.data
      success.should.equal(true)
      assert.isString(token)
      logintoken = token
    })    
    //---------------------------------------------------        
    
    //---------------------------------------------------
    it("User can update their pin", async function(){      
      let res = await axios.patch(urlAPI + "/account/patch/pin", {email, pin: '0987'});      
      success.should.equal(res.data.success) 
    })
    //---------------------------------------------------
            
    //---------------------------------------------------
    it("User can now login with their new pin", async function(){      
      let res = await axios.post(urlAPI + "/account/login/pin", {email, pin: '0987'});      
      let {success, user, token} = res.data
      success.should.equal(true)
      assert.isString(token)    
    })
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Logging in with old pin should fail.", async function(){      
      let res = await axios.post(urlAPI + "/account/login/pin", {email, pin});      
      let {success, reason} = res.data
      success.should.equal(false)      
    })
    //---------------------------------------------------
                     
    //---------------------------------------------------
    it("User can log in with email", async function(){      
      let res = await axios.post(urlAPI + "/account/login/email", {email, password});      
      let {success, user, token} = res.data
      success.should.equal(true)
      assert.isString(token)
      logintoken = token
    })
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("User can change their password", async function(){      
      let res = await axios.post(urlAPI + "/account/changepassword", {email, password, newpassword});            
      let {success, item } = res.data.success
      success.should.equal(true)
      assert.isObject(item)      
    })
    //---------------------------------------------------
        
    //---------------------------------------------------
    it("User can log in with new password", async function(){      
      let res = await axios.post(urlAPI + "/account/login/email", {email, password: newpassword});      
      let {success, user, token} = res.data
      success.should.equal(true)
      assert.isString(token)
      logintoken = token
    })
    //---------------------------------------------------

    //---------------------------------------------------
    it("Logging in with old password should fail.", async function(){      
      let res = await axios.post(urlAPI + "/account/login/email", {email, password});      
      let {success} = res.data
      success.should.equal(false)
    })  
    //---------------------------------------------------

    //     it("User can change their email.", async function(){      
    //       let newemail = 'email_' + Math.random().toString(36) + '_@test.com'
    //       console.log( {email, newemail, token: logintoken} )
    //       let res = await axios.post(urlAPI + "/account/changeemail", {email, newemail, token: logintoken});      
    //       console.log(res.data)
    //     })  
    //     it("User send recovery email is sent out (manually need to check email)", async function(){      
    //       console.log({email, token: logintoken})
    //       let res = await axios.post(urlAPI + "/account/sendrecoveryemail", {email});      
    //       success.should.equal(res.data.success)
    //       // next step needs to include a change to the server - it needs to return the recovery email token so it can be used to see if it works in the next step
    //     })
    
    //---------------------------------------------------
    it("User shows up in searches, and there should only be one:", async function(){            
      let res = await axios.get(urlAPI + "/user/_id/" + user._id);      
      let {success, count, payload} = res.data
      success.should.equal(true)
      count.should.equal(1)
      payload.firstname.should.equal(firstname)
      payload.lastname.should.equal(lastname)
    })   
    //---------------------------------------------------
    
    //---------------------------------------------------
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
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Changing the slug should fail if it's already taken.", async function(){            
      let res = await axios.patch(urlAPI + "/user/patch/alias", {_id: user._id, alias: user.slug});      
      let {success} = res.data
      success.should.equal(false)
    })     
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("User can change their slug/alias.", async function(){            
      let res = await axios.patch(urlAPI + "/user/patch/alias", {_id: user._id, alias: newslug});      
      let {success} = res.data      
      success.should.equal(true)
    })         
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("New alias should show up in searches:", async function(){            
      let res = await axios.get(urlAPI + "/user/_id/" + user._id);      
      let {success, count, payload} = res.data
      payload.slug.should.equal(newslug)      
    })  
    //---------------------------------------------------
        
    //---------------------------------------------------
    it("Freezing an account works.", async function(){      
      let res = await axios.post(urlAPI + "/account/freeze", {_id: user._id, password: newpassword});      
      let {success} = res.data
      success.should.equal(true)
    })  
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("User can delete their account.", async function(){
      let res = await axios.post(urlAPI + "/account/delete", {_id: user._id, password: newpassword});      
      let {success} = res.data
      success.should.equal(true)
    })
    //---------------------------------------------------
    
    //---------------------------------------------------    
    it("Snapp should no longer show up in searches:", async function(){            
      let res = await axios.get(urlAPI + "/snapp/id/" + createdSnapp._id);      
      let {success, reason} = res.data
      success.should.equal(false)
    })  
    //---------------------------------------------------        
    
    //---------------------------------------------------
    it("User should no longer be able to log in", async function(){      
      let res = await axios.post(urlAPI + "/account/login/email", {email, password: newpassword});      
      let {success, reason} = res.data
      success.should.equal(false)
    })
    //---------------------------------------------------
             
        
  });
  //---------------------------------------------------------------------
}