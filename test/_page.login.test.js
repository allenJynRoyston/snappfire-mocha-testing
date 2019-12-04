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

let urlPage = "https://www.snappfire.com/login";

if(true){
  //---------------------------------------------------------------------
  describe("Check for links on /login", function() {
    let $ = '';

    //---------------------------------------------------
    before(async () => {        
      let res = await axios.get(urlPage)            
      $ = cheerio.load(res.data);   
    })
    //---------------------------------------------------    
    
    //---------------------------------------------------
    it("There are 3 links to this page (create an account, login using my pin, i forgot my password):", function() {    
      let links = []
      
      $('a').each((i, ele) => {
        links.push($(ele).text().trim().toLowerCase())
      })  
      
      expect(links.includes('create an account')).to.equal(true);  
      expect(links.includes('login using my pin')).to.equal(true);  
      expect(links.includes('i forgot my password')).to.equal(true);  
            
      expect(links).to.have.lengthOf(3)
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("The title for the page is Login.", function() {  
      let title = $('title')                   
      expect($(title).html()).to.equal('Login');          
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("There are input fields for email/password.", function() {  
      let labels = []
      $('label').each((i, ele) => {        
        labels.push( $(ele).html().trim().toLowerCase() )
      })      
      expect(labels.includes('email')).to.equal(true);  
      expect(labels.includes('password')).to.equal(true);              
    });
    //---------------------------------------------------    
    
    
  })  
  //---------------------------------------------------------------------
  
}