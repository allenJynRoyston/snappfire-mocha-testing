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
  describe("Login using test account", function() {
    let data, user, token;

    before(async () => {
      let res = await axios.post(urlAPI + "/account/login/demoaccount");          
      data = res.data  
      user = res.data.user; 
      token = res.data.token      
    })

    it("Signing in as a demo account works.", function() {
      data.success.should.equal(true);
    });
    
    it("Signing in returns a valid token", function() {
      assert.isString(token)
    });    

  });
  //---------------------------------------------------------------------
}