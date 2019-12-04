/* global describe, it */
const chai = require("chai");
chai.use(require("chai-http")); //For API Testing
const axios = require("axios");
const server = require("../server");
const cheerio = require('cheerio');

let assert = chai.assert;
let should = chai.should();
let request = chai.request;
let expect = chai.expect;

let urlPage = "https://www.snappfire.com/about";

if(true){
  //---------------------------------------------------------------------
  describe("Check for links on /about page", function() {
    let $ = ''

    //---------------------------------------------------
    before(async () => {        
      let res = await axios.get(urlPage)            
      $ = cheerio.load(res.data);
    })
    //---------------------------------------------------    
    
    //---------------------------------------------------
    it("List of links", function() {      
      $('a').each((i, ele) => {
        console.log(i + ': ' +  $(ele).text().trim().toLowerCase() )        
      })
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("There is a link to signup", function() {      
      let link = $('a[href="/"]')      
      expect(link).to.have.lengthOf(1);      
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("There is a link to blog", function() {      
      let link = $('a[href="/blog"]')      
      expect(link).to.have.lengthOf(1);      
    });
    //---------------------------------------------------    
    
    //---------------------------------------------------
    it("There is a link to team", function() {      
      let link = $('a[href="/team"]')      
      expect(link).to.have.lengthOf(1);      
    });
    //---------------------------------------------------    
    
  })  
  //---------------------------------------------------------------------

}