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
    it("Snapps should be an object", function(){
      let user = data.items[0]
      expect(user).to.be.an("object");
    });
    //---------------------------------------------------

    
    props.forEach(prop => {
      it("Snapps should have the prop: " + prop, function(){
        let user = data.items[0]
        assert.isNotNull(user[prop])
      });
    })

    //---------------------------------------------------
    it("Author has the property: _id", function(){
      let {author} = snapp
      assert.property(author, '_id')    
    });    
    //---------------------------------------------------
  
    //---------------------------------------------------
    it("Parent has the properties: type, _id, slug", function(){
      let {parent} = snapp
      assert.property(parent, '_id')    
      assert.property(parent, 'type')    
      assert.property(parent, 'slug')    
    });    
    //---------------------------------------------------
    
    //---------------------------------------------------
    it("Emotes contain a series emotes: likes and loves", function(){
      let {emotes} = snapp
      assert.property(emotes, 'like')    
      assert.property(emotes, 'love')        
    });    
    //---------------------------------------------------

  });
  //---------------------------------------------------------------------
}


if(false){
  //---------------------------------------------------------------------
  describe("Login using test account", function() {
    let data, user, token, createdSnapp, createdComment, createdReply;

    before(async () => {
      let res = await axios.post(urlAPI + "/account/login/demoaccount");          
      data = res.data  
      user = res.data.user; 
      token = res.data.token      
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
    it("User can create a snapp:", async function(){      
      let data = {
        userid: user._id, 
        type: 'root', 
        content: 'I am a test snapp!', 
        isTest: true
      }
      let res = await axios.post(urlAPI + "/snapp/create" , data);      
      let {success, snapp} = res.data
      
      expect(snapp.author._id).to.equal(user._id)      
      expect(snapp.content).to.equal(data.content)     
      
      createdSnapp = snapp 
    })  
    //---------------------------------------------------    
    
    //---------------------------------------------------    
    it("Snapp should now be in the users snapp array as the first entry.", async function(){      
      let res = await axios.get(urlAPI + "/user/_id/" + user._id);            
      let {success, count, payload} = res.data
      expect(createdSnapp._id).to.equal(payload.snapps[0])      
    })  
    //---------------------------------------------------        
    
    //---------------------------------------------------    
    it("User can create a comment and add it to a snapp.", async function(){      
      let data = {
        userid: user._id,
        snappid: createdSnapp._id,
        type: 'comment', 
        content: 'I am a test snapp comment!'
      }
      let res = await axios.post(urlAPI + "/snapp/create/comment" , data);      
      let {success, comment} = res.data
      
      expect(comment.author._id).to.equal(user._id)      
      expect(comment.content).to.equal(data.content)     
      
      createdComment = comment 
      
    })  
    //---------------------------------------------------        

    //---------------------------------------------------    
    it("Comment should now be in the users comment array as the first entry.", async function(){      
      let res = await axios.get(urlAPI + "/user/_id/" + user._id);            
      let {success, count, payload} = res.data
      
      expect(createdComment._id).to.equal(payload.comments[0])      
    })  
    //---------------------------------------------------          
    
    //---------------------------------------------------    
    it("User can create a reply and add it to a comment.", async function(){      
      let data = {
        userid: user._id,
        snappid: createdComment._id,
        type: 'comment', 
        content: 'I am a test snapp reply!'
      }
      let res = await axios.post(urlAPI + "/snapp/create/comment" , data);      
      let {success, comment} = res.data
      
      expect(comment.author._id).to.equal(user._id)      
      expect(comment.content).to.equal(data.content)     
      
      createdReply = comment 
    })  
    //---------------------------------------------------      
    
    //---------------------------------------------------    
    it("Reply should now be in the users comment array as the first entry.", async function(){      
      let res = await axios.get(urlAPI + "/user/_id/" + user._id);            
      let {success, count, payload} = res.data
      
      expect(createdReply._id).to.equal(payload.comments[0])      
    })  
    //---------------------------------------------------         
    
    //---------------------------------------------------    
    it("Snapp should show up in follower(s) feeds", async function(){    
      if(user.followers.length > 0){
        let res = await axios.get(urlAPI + "/user/_id/" + user.followers[0]); 
        
        let feed = [...res.data.payload.feed]        
        expect(feed.filter( x => x === createdSnapp._id).length).to.equal(1)                   
        
        expect(res.data.payload.feed[0]).to.equal(createdSnapp._id)      
      }
    })  
    //---------------------------------------------------           
      
    
    //---------------------------------------------------    
    it("Snapp should now have a comment in it.", async function(){      

      let res = await axios.get(urlAPI + "/snapp/id/" + createdSnapp._id);      
      let {success, count, payload} = res.data
            
      expect(payload.author._id).to.equal(user._id)      
      expect(payload.comments)
        .to.be.an("array")
        .to.have.lengthOf(1);
      expect(payload.attachedTo)
        .to.be.an("array")
        .to.have.lengthOf([...user.followers, [user._id]].length);      
      
      
      expect(payload.comments[0]).to.equal(createdComment._id)
      
      // first in attached should be first follower
      expect(payload.attachedTo[0]).to.equal(user.followers[0])
      
      // last in attached should be users id
      expect(payload.attachedTo[payload.attachedTo.length - 1]).to.equal(user._id)
            
    })  
    //---------------------------------------------------     
    
    //---------------------------------------------------    
    it("Comment should now have a reply in it.", async function(){      

      let res = await axios.get(urlAPI + "/snapp/id/" + createdComment._id);      
      let {success, count, payload} = res.data
            
      expect(payload.author._id).to.equal(user._id)      
      expect(payload.comments)
        .to.be.an("array")
        .to.have.lengthOf(1);
      expect(payload.attachedTo)
        .to.be.an("array")
        .to.have.lengthOf([...user.followers, [user._id]].length);      
            
      expect(payload.comments[0]).to.equal(createdReply._id)
      
      // first in attached should be first follower
      expect(payload.attachedTo[0]).to.equal(user.followers[0])
      
      // last in attached should be users id
      expect(payload.attachedTo[payload.attachedTo.length - 1]).to.equal(user._id)
            
    })  
    //---------------------------------------------------         
  
    //---------------------------------------------------    
    it("Deleting a reply should work.", async function(){      
      // should be false
      expect(createdReply.isDeleted).to.equal(false)
      
      let reply = await axios.delete(urlAPI + "/snapp/delete/" + `${createdReply._id}/${user._id}/${token}`);            
      expect(reply.data.success).to.equal(true)          
    })  
    //---------------------------------------------------      
    
    //---------------------------------------------------    
    it("Deleted replies should return a string 'This content has been deleted.' and isDeleted should be true.", async function(){                        
      
      let res = await axios.get(urlAPI + "/snapp/id/" + createdReply._id);      
      let {success, count, payload} = res.data
      
      createdReply = res.data;
      
      expect(payload.isDeleted).to.equal(true)      
      expect(payload.content).to.equal('This content has been deleted.');   
    })  
    //---------------------------------------------------          
    
    //---------------------------------------------------    
    it("Deleting a comment should work.", async function(){      
      // should be false
      expect(createdComment.isDeleted).to.equal(false)
      
      let comment = await axios.delete(urlAPI + "/snapp/delete/" + `${createdComment._id}/${user._id}/${token}`);            
      expect(comment.data.success).to.equal(true)          
    })  
    //---------------------------------------------------      
    
    //---------------------------------------------------    
    it("Deleted comments should return a string 'This content has been deleted.' and isDeleted should be true.", async function(){                        
      
      let res = await axios.get(urlAPI + "/snapp/id/" + createdComment._id);      
      let {success, count, payload} = res.data
      
      createdComment = res.data;
      
      expect(payload.isDeleted).to.equal(true)      
      expect(payload.content).to.equal('This content has been deleted.');   
    })  
    //---------------------------------------------------              
    
    
    //---------------------------------------------------    
    it("Deleted comments should return a string 'This content has been deleted.' and isDeleted should be true.", async function(){                        
      // should be false
      expect(createdSnapp.isDeleted).to.equal(false)
      
      let snapp = await axios.delete(urlAPI + "/snapp/delete/" + `${createdSnapp._id}/${user._id}/${token}`);            
      expect(snapp.data.success).to.equal(true)     
    })  
    //---------------------------------------------------   
    
    
    //---------------------------------------------------    
    it("Deleted snapp should no loger show up in searches.", async function(){                              
      let res = await axios.get(urlAPI + "/snapp/id/" + createdSnapp._id);      
      expect(res.data.success).to.equal(false)   
    })  
    //---------------------------------------------------    
    
    //---------------------------------------------------    
    it("Deleted comment should no loger show up in searches.", async function(){                              
      let res = await axios.get(urlAPI + "/snapp/id/" + createdComment._id);      
      expect(res.data.success).to.equal(false)   
    })  
    //---------------------------------------------------        
    
    //---------------------------------------------------    
    it("Deleted reply should no loger show up in searches.", async function(){                              
      let res = await axios.get(urlAPI + "/snapp/id/" + createdReply._id);      
      expect(res.data.success).to.equal(false)   
    })  
    //---------------------------------------------------            
        
    //---------------------------------------------------    
    it("Snapp should be removed from follower feeds", async function(){    
      if(user.followers.length > 0){
        let res = await axios.get(urlAPI + "/user/_id/" + user.followers[0]);            
        let feed = [...res.data.payload.feed]

        expect(feed.filter( x => x === createdSnapp._id).length).to.equal(0)      
      }
    })  
    //---------------------------------------------------        
    
  });
  //---------------------------------------------------------------------
}