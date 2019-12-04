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

let urlPage = "https://www.snappfire.com/team";

if(true){
  //---------------------------------------------------------------------
  describe("Check for links on /team", function() {
    let $ = '';

    //---------------------------------------------------
    before(async () => {        
      let res = await axios.get(urlPage)            
      $ = cheerio.load(res.data);   
    })
    //---------------------------------------------------    
    
    //---------------------------------------------------
    it("There are links to home/blog/about us.", function() {    
      let links = []
      
      $('a').each((i, ele) => {
        links.push($(ele).text().trim().toLowerCase())
      })  
      
      expect(links.includes('home')).to.equal(true);  
      expect(links.includes('blog')).to.equal(true);  
      expect(links.includes('about us')).to.equal(true);       
    });
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("The title for the page is Team.", function() {  
      let title = $('title')                   
      expect($(title).html()).to.equal('Team');          
    });
    //---------------------------------------------------
    
    
  })  
  //---------------------------------------------------------------------
  
}