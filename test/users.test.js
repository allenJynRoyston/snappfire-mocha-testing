/* global describe, it */
const chai = require("chai");
chai.use(require("chai-http")); //For API Testing
const axios = require("axios");
const server = require("../server");
const Chance = require('chance');
const chance = new Chance();


let assert = chai.assert;
let should = chai.should();
let request = chai.request;
let expect = chai.expect;

let urlRoot = "https://snappfire-db.herokuapp.com";
let urlAPI = "https://snappfire-db.herokuapp.com/api/v2";


if(true){
  //---------------------------------------------------------------------
  describe("Check users:", function() {
    let data,
        props = [
          '_id', 'accountType', 'isDeleted', 'emailVerified', 
          'isTest', 'firstname', 'lastname', 'gender', 'email', 
          'slug', 'alias', 'description', 'profession', 'birthdate', 
          'street1', 'street2', 'street3', 'postcode', 'city', 'state',
          'country', 'images', 'socialmedia', 'privacy', 'permissions',
          'settings', 'followers', 'following', 'feed', 'snapps', 'comments',
          'counts', 'version', 'created', 'updated'
        ], 
        user;


    before(async () => {
      let res = await axios.get(urlAPI + "/users/0/1");    
      data = res.data  
      user = res.data.items[0]
    })

    //---------------------------------------------------
    it("Endpoint /api/v2/users/0/1 is successful.", function() {
      data.success.should.equal(true);
    });
    //---------------------------------------------------

    //---------------------------------------------------
    it("Endpoint /api/v2/users/0/1 is an array and should return one item.", function() {
      expect(data.items)
        .to.be.an("array")
        .to.have.lengthOf(1);
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("User should be an object", function(){
      expect(user).to.be.an("object");
    });
    //---------------------------------------------------

    props.forEach(prop => {
      it("User should have the prop: " + prop, function(){
        expect(user).to.have.own.property(prop)
      });
    })
    
    //---------------------------------------------------
    it("Birthdate field has day, month, and year.", function(){
      let {day, month, year} = user.birthdate
      assert.isNotNull(day)
      assert.isNotNull(month)
      assert.isNotNull(year)
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Images has a profile and cover properties and are arrays.", function(){
      let user = data.items[0]
      let {profile, cover} = user.images
      assert.isArray(profile)
      assert.isArray(cover)    
    });  
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Privacy has searchByName, searchByProfession and searchByCity properties and are Booleans.", function(){
      let {searchByName, searchByProfession, searchByCity} = user.privacy
      assert.isBoolean(searchByName)
      assert.isBoolean(searchByProfession)
      assert.isBoolean(searchByCity)
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Permissions has changeEmail and changePassword and are Booleans.", function(){
      let {changeEmail, changePassword} = user.permissions
      assert.isBoolean(changeEmail)
      assert.isBoolean(changeEmail)
    });    
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Settings has theme and is a string.", function(){
      let {theme} = user.settings
      assert.isString(theme)
    });  
    //---------------------------------------------------

  });
  //---------------------------------------------------------------------
}

if(false){
  //---------------------------------------------------------------------
  describe("Check users:", function() {
    let data, user, token, originalUser;

    before(async () => {
      let res = await axios.post(urlAPI + "/account/login/demoaccount");          
      
      data = res.data  
      user = res.data.user 
      token = res.data.token      
            
      originalUser = JSON.parse(JSON.stringify(res.data.user))
    })

    //---------------------------------------------------
    it("Signing in as a demo account works.", function() {
      data.success.should.equal(true);
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Signing in returns a valid token", function() {      
      assert.isString(token)
    });    
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("User can update description, profession, firstname, lastname, gender, street1, street2, street3, postcode, city, state, country, birthdate", async function() {      
      let description = chance.paragraph(),
          profession = chance.profession(),
          firstname = chance.name(),
          lastname = chance.name(),
          gender = chance.word(),
          street1 = chance.address(),
          street2 = chance.address(),
          street3 = chance.address(),
          postcode = chance.postcode(),
          city = chance.city(),
          state = chance.state(),
          country = chance.country(),      
          birthdate = {day: 1, month: 12, year: 1999}
            
      let _user = {
        _id: user._id, 
        description,
        profession,
        firstname,
        lastname,
        gender,
        street1, 
        street2,
        street3,
        postcode, 
        city,
        state,
        country,
        birthdate
      }
      
      let updated = await axios.patch(urlAPI + "/user/patch/userdetails", _user);      
      updated.data.success.should.equal(true);

      let res = await axios.get(urlAPI + "/user/_id/" + user._id);            
      let {success, count, payload} = res.data
 
      payload.description.should.equal(description)
      payload.profession.should.equal(profession)
      payload.firstname.should.equal(firstname)
      payload.lastname.should.equal(lastname)
      payload.gender.should.equal(gender)
      payload.street1.should.equal(street1)
      payload.street2.should.equal(street2)
      payload.street3.should.equal(street3)
      payload.postcode.should.equal(postcode)
      payload.city.should.equal(city)
      payload.state.should.equal(state)
      payload.country.should.equal(country)
      JSON.stringify(payload.birthdate).should.equal(JSON.stringify(birthdate))
    });    
    //---------------------------------------------------  

    //---------------------------------------------------
    it("Restore user to default values", async function() {      
      originalUser.description = 'I am a description.'
      let updated = await axios.patch(urlAPI + "/user/patch/userdetails", originalUser);      
      updated.data.success.should.equal(true);

      let res = await axios.get(urlAPI + "/user/_id/" + user._id);            
      let {success, count, payload} = res.data
      
      let keys = Object.keys(originalUser)
      
      keys.forEach(key => {        
        JSON.stringify(payload[key]).should.equal(JSON.stringify(originalUser[key]));
      })          
    });    
    //---------------------------------------------------      
    
  });
  //---------------------------------------------------------------------
}




if(false){
  //---------------------------------------------------------------------
  describe("Add new follower ", function() {
    let data, user, token, randomUser;

    before(async () => {
      let res = await axios.post(urlAPI + "/account/login/demoaccount");          
      
        data = res.data  
        user = res.data.user 
        token = res.data.token    
      
      let ran = await axios.get(urlAPI + "/users/6/1");        
        randomUser = ran.data.items[0]      
    })

    //---------------------------------------------------
    it("Changing the following status by following a random user to your following/follower list...", async function() {      
      let user1 = await axios.get(urlAPI + "/user/_id/" + user._id);          
      let following = user1.data.payload.following
    
      let isFollowing = following.filter(x => x === randomUser._id).length > 0
      
           
      let res = await axios.patch(urlAPI + "/user/patch/changefollowingstatus", {_id: user._id, uid: randomUser._id, token});                      
      res.data.success.should.equal(true)
      
      // if already following, should now be unfollowing (and vice versa)
      user1 = await axios.get(urlAPI + "/user/_id/" + user._id);          
      following = user1.data.payload.following
      let count_following = following.filter(x => x === randomUser._id).length      
      count_following.should.equal(isFollowing ? 0 : 1)  
      
      
      let user2 = await axios.get(urlAPI + "/user/_id/" + randomUser._id);   
      let followers = user2.data.payload.followers
      let count_followers = followers.filter(x => x === user._id).length 
      count_followers.should.equal(isFollowing ? 0 : 1)       
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("... and then doing it again should remove/add user from following/follower list.", async function() {      
      let user1 = await axios.get(urlAPI + "/user/_id/" + user._id);          
      let following = user1.data.payload.following
    
      let isFollowing = following.filter(x => x === randomUser._id).length > 0
      
           
      let res = await axios.patch(urlAPI + "/user/patch/changefollowingstatus", {_id: user._id, uid: randomUser._id, token});                      
      res.data.success.should.equal(true)
      
      // if already following, should now be unfollowing (and vice versa)
      user1 = await axios.get(urlAPI + "/user/_id/" + user._id);          
      following = user1.data.payload.following
      let count_following = following.filter(x => x === randomUser._id).length      
      count_following.should.equal(isFollowing ? 0 : 1)  
      
      
      let user2 = await axios.get(urlAPI + "/user/_id/" + randomUser._id);   
      let followers = user2.data.payload.followers
      let count_followers = followers.filter(x => x === user._id).length 
      count_followers.should.equal(isFollowing ? 0 : 1)       
      
    });
    //---------------------------------------------------
    
  });
  //---------------------------------------------------------------------
}


if(false){
  //---------------------------------------------------------------------
  describe("Add new follower ", function() {
    let data, user, token, originalUser;

    before(async () => {
      let res = await axios.post(urlAPI + "/account/login/demoaccount");          
      
      data = res.data  
      user = res.data.user 
      token = res.data.token     

      originalUser = JSON.parse(JSON.stringify(res.data.user))
    })

    //---------------------------------------------------
    it("Trying to PATCH an alias that already exists should fail.", async function() {      
      let res = await axios.patch(urlAPI + "/user/patch/alias", {_id: user._id, alias: user.alias});          
      res.data.success.should.equal(false)
      res.data.reason.should.equal('Alias already in use.')
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Changing the alias should succeed.", async function() {      
      let alias = chance.name()
      let res = await axios.patch(urlAPI + "/user/patch/alias", {_id: user._id, alias});          
      res.data.success.should.equal(true)
      
      let _user = await axios.get(urlAPI + "/user/_id/" + user._id);   
      _user.data.payload.alias.should.equal(`${alias}`.toLowerCase().replace(/ /g,"_"))
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Revert back to original alias should work.", async function() {            
      let res = await axios.patch(urlAPI + "/user/patch/alias", {_id: user._id, alias: originalUser.alias});          
      res.data.success.should.equal(true)
    });
    //---------------------------------------------------    
    
  });
  //---------------------------------------------------------------------
}