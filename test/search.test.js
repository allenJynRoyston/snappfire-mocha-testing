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
  describe("Check if search/hashtag is successful:", function() {
    let data, results;

    before(async () => {
      let res = await axios.get(urlAPI + "/search/hashtags/2019/0/1");    
      data = res.data  
      results = res.data.results.data        
    })

    it("Endpoint /api/v2/search/hashtags/:hashtag/:skip/:limit is successful", function() {
      data.success.should.equal(true);
    });

  });
  //---------------------------------------------------------------------


  //---------------------------------------------------------------------
  describe("Check if search/content is successful:", function() {
    let data, results;

    before(async () => {
      let res = await axios.get(urlAPI + "/search/content/a/0/1");    
      data = res.data  
      results = res.data.results.data
    })

    it("Endpoint /api/v2/search/content/:content/:skip/:limit is successful", function() {
      data.success.should.equal(true);
    });

    it("Search result is valid", function() {    
      if(results.length > 0){
        let item = results[0]
        assert.isString(item.content)
      }
    });


  });
  //---------------------------------------------------------------------
}