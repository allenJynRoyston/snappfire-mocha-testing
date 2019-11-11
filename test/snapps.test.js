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
  describe("Check snapps:", function() {
    let data,
        props = [
          '_id', 'isTest', 'isDeleted', 'slug', 'content', 'hashes', 'links', 
          'nametags', 'strLength', 'author', 'expiredTimestamp', 'expireId', 'type',
          'parent', 'sharedid', 'emotes', 'attachedTo', 'comments', 'images',
          'version', 'created', 'updated'
        ], 
        snapp;


    before(async () => {
      let res = await axios.get(urlAPI + "/snapps/0/1");    
      data = res.data  
      snapp = res.data.items[0]    
    })


    it("Endpoint /api/v2/users/0/1 is successful.", function() {
      data.success.should.equal(true);
    });

    it("Endpoint /api/v2/users/0/1 is an array and should return one item.", function() {
      expect(data.items)
        .to.be.an("array")
        .to.have.lengthOf(1);
    });

    it("Snapps should be an object", function(){
      let user = data.items[0]
      expect(user).to.be.an("object");
    });


    props.forEach(prop => {
      it("Snapps should have the prop: " + prop, function(){
        let user = data.items[0]
        assert.isNotNull(user[prop])
      });
    })

    it("Author has the property: _id", function(){
      let {author} = snapp
      assert.property(author, '_id')    
    });    

    it("Parent has the properties: type, _id, slug", function(){
      let {parent} = snapp
      assert.property(parent, '_id')    
      assert.property(parent, 'type')    
      assert.property(parent, 'slug')    
    });    

    it("Emotes contain a series emotes: likes and loves", function(){
      let {emotes} = snapp
      assert.property(emotes, 'like')    
      assert.property(emotes, 'love')        
    });    

  });
  //---------------------------------------------------------------------
}