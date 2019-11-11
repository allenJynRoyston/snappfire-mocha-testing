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


//---------------------------------------------------------------------
describe("Check snapps:", function() {
  let data,
      props = [
        '_id'
      ]
  

  before(async () => {
    let res = await axios.get(urlAPI + "/snapps/0/1");    
    data = res.data  
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


});
//---------------------------------------------------------------------
