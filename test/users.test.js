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


    it("Endpoint /api/v2/users/0/1 is successful.", function() {
      data.success.should.equal(true);
    });

    it("Endpoint /api/v2/users/0/1 is an array and should return one item.", function() {
      expect(data.items)
        .to.be.an("array")
        .to.have.lengthOf(1);
    });

    it("User should be an object", function(){
      expect(user).to.be.an("object");
    });


    props.forEach(prop => {
      it("User should have the prop: " + prop, function(){
        assert.isNotNull(user[prop])
      });
    })

    it("Birthdate field has day, month, and year.", function(){
      let {day, month, year} = user.birthdate
      assert.isNotNull(day)
      assert.isNotNull(month)
      assert.isNotNull(year)
    });

    it("Images has a profile and cover properties and are arrays.", function(){
      let user = data.items[0]
      let {profile, cover} = user.images
      assert.isArray(profile)
      assert.isArray(cover)    
    });  

    it("Privacy has searchByName, searchByProfession and searchByCity properties and are Booleans.", function(){
      let {searchByName, searchByProfession, searchByCity} = user.privacy
      assert.isBoolean(searchByName)
      assert.isBoolean(searchByProfession)
      assert.isBoolean(searchByCity)
    });

    it("Permissions has changeEmail and changePassword and are Booleans.", function(){
      let {changeEmail, changePassword} = user.permissions
      assert.isBoolean(changeEmail)
      assert.isBoolean(changeEmail)
    });    

    it("Settings has theme and is a string.", function(){
      let {theme} = user.settings
      assert.isString(theme)
    });  


  });
  //---------------------------------------------------------------------
}