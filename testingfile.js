const Chance = require('chance');
const c = new Chance();
const fs = require('fs');
const axios = require('axios')
const chalk = require('chalk');

const apiUrl = `${!process.env.PORT ? 'http://localhost:5000' : 'https://snappfire-db.herokuapp.com'}`

const {s3Bucket} = require('../constants')

//--------------------------------------------
let createSystemDefaults = () => {
  return new Promise( async(resolve) => {
      //------------------------------------- FIRST, CREATE A PROFILE/COVER IMAGE AND GET IMAGE ID
      let profileImageData = {
        tiny: {
          url: `${s3Bucket}/profile/male-50.jpeg`,
          width: null,
          height: null,
          available: true
        },        
        tiny_webp: {
          url: `${s3Bucket}/profile/male-50.webp`,
          width: null,
          height: null,
          available: true
        },
        xs_webp: {
          url: `${s3Bucket}/profile/male-50.jpeg`,
          width: 50,
          height: 50,
          available: true
        },
        xs: {
          url: `${s3Bucket}/profile/male-50.webp`,
          width: 50,
          height: 50,
          available: true
        },            
        sm_webp: {
            url: `${s3Bucket}/profile/male-100.webp`,
            width: 100,
            height: 100,
            available: true
        },
        sm: {
          url: `${s3Bucket}/profile/male-100.jpeg`,
          width: 100,
          height: 100,
          available: true
        },  
        md_webp: {
            url: `${s3Bucket}/profile/male-200.webp`,
            width: 200,
            height: 200,
            available: true
        },
        md: {
          url: `${s3Bucket}/profile/male-200.jpeg`,
          width: 200,
          height: 200,
          available: true
        }
    }          
    
    let profileImage = await axios.post(`${apiUrl}/api/v2/image/create`, {imagedata: profileImageData, isTest: true, ready: true})

    let coverImageData = {
        lg: {
          url: `${s3Bucket}/cover/abstracts/default-lg.jpg`,
          width: 1366,
          height: 768,
          available: true
        },        
        lg_webp: {
          url: `${s3Bucket}/cover/abstracts/default-lg.webp`,
          width: 1366,
          height: 768,
          available: true
        },
        md: {
          url: `${s3Bucket}/cover/abstracts/default-md.jpg`,
          width: 600,
          height: 506,
          available: true
        },
        md_webp: {
          url: `${s3Bucket}/cover/abstracts/default-md.webp`,
          width: 600,
          height: 506,
          available: true
        },            
        sm: {
          url: `${s3Bucket}/cover/abstracts/default-sm.jpg`,
          width: 400,
          height: 255,
          available: true
        },
        sm_webp: {
          url: `${s3Bucket}/cover/abstracts/default-sm.webp`,
          width: 400,
          height: 255,
          available: true
        }
    } 

    let coverImage = await axios.post(`${apiUrl}/api/v2/image/create`, {imagedata: coverImageData, isTest: true, ready: true})
    //-------------------------------------  

    let payload = {
      blankProfileId: profileImage.data.image._id,
      blankCoverId: coverImage.data.image._id
    }

    let defaults = await axios.post(`${apiUrl}/api/v2/systems/setdefaults`, payload)
    resolve()
  })
}
//--------------------------------------------


//--------------------------------------------
let createUsers = async(amount = 1) => {
  return new Promise(resolve => {
    let arr = [];
    let iteration = 0

    //--------------------------
    async function loop(){

      //------------------------------------- REQUIRED FIELDS 
      let firstname = c.first(), 
          lastname = c.last(), 
          gender = c.gender().toLowerCase(),
          alias = c.word(),          
          description = c.paragraph(),
          profession = c.profession(),          
          street1 = c.street({short_suffix: true}),
          street2 = c.street({short_suffix: true}),
          street3 = c.street({short_suffix: true}),
          postcode = c.postcode(),
          city = c.city({full: true}),
          state = c.state({full: true}),
          country = c.country({ full: true }),
          isTest = true;        
          
      let email = `email${iteration}@test.com`,
          password = 'password',
          pin = '1234',
          accountType = iteration === 0 ? 'admin' : 'basic';

      //------------------------------------- 
      
      let res = await axios.post(`${apiUrl}/api/v2/account/create`, {firstname, lastname, gender, alias, email, password, pin, description, profession, street1, street2, street3, postcode, city, state, country, accountType, isTest})
      let {success, user} = res.data
      if(success){
        arr.push(user)
        if(arr.length < amount){
          iteration++
          loop()
        }
        else{
          resolve(arr)
        }
      }
      else{
        console.log("Error in creating users - breaking loop.")
      }          
    }
    //--------------------------

    loop()
  })
}
//--------------------------------------------


//--------------------------------------------
let createSnapps = (userpool, amount = 1) => {
  return new Promise(resolve => {
    let arr = [];
    //--------------------------
    async function loop(){
      //------------------------------------- REQUIRED FIELDS
      let user = userpool[c.integer({ min: 0, max: userpool.length -1 })],
          content = c.paragraph({ sentences: c.integer({ min: 0, max: 4 }) }),
          type = 'root';      
      //-------------------------------------

      let res = await axios.post(`${apiUrl}/api/v2/snapp/create`, {userid: user._id, type, content, isTest: true})
      let {success, snapp} = res.data

      if(success){
        arr.push(snapp)
        if(arr.length < amount){
          loop()
        }
        else{
          resolve(arr)
        }
      }
      else{
        console.log("Error in creating snapps - breaking loop.")
      }  
    }
    //--------------------------

    loop()
  })
}
//--------------------------------------------


//--------------------------------------------
let createComments = (userpool, snappool, amount = 1) => {
  return new Promise(resolve => {
    let arr = [];
    //--------------------------
    async function loop(){
      //------------------------------------- REQUIRED FIELDS
      let user = userpool[c.integer({ min: 0, max: userpool.length -1 })],
          snapp = snappool[c.integer({ min: 0, max: snappool.length -1 })],
          type = 'comment',
          parenttype = 'snapp',
          content = c.paragraph({ sentences: c.integer({ min: 0, max: 4 }) });
      //-------------------------------------

      let res = await axios.post(`${apiUrl}/api/v2/snapp/create/comment`, {userid: user._id, snappid: snapp._id, type, parenttype, content, isTest: true})
      let {success, comment} = res.data

      if(success){
        arr.push(comment)
        if(arr.length < amount){
          loop()
        }
        else{
          resolve(arr)
        }
      }
      else{
        console.log("Error in creating snapps - breaking loop.")
      }  
    }
    //--------------------------

    loop()
  })

}
//--------------------------------------------


//--------------------------------------------
let createReplies = (userpool, commentPool, amount = 1) => {
  return new Promise(resolve => {
    let arr = [];
    //--------------------------
    async function loop(){
      //------------------------------------- REQUIRED FIELDS
      let user = userpool[c.integer({ min: 0, max: userpool.length -1 })],
          reply = commentPool[c.integer({ min: 0, max: commentPool.length -1 })],
          type = 'reply',
          parenttype = 'comment',
          content = c.paragraph({ sentences: c.integer({ min: 0, max: 4 }) });
      //-------------------------------------

      let res = await axios.post(`${apiUrl}/api/v2/snapp/create/comment`, {userid: user._id, snappid: reply._id, type, parenttype, content, isTest: true})
      let {success, comment} = res.data
      if(success){
        arr.push(comment)
        if(arr.length < amount){
          loop()
        }
        else{
          resolve(arr)
        }
      }
      else{
        console.log("Error in creating snapps - breaking loop.")
      }  
    }
    //--------------------------

    loop()
  })

}
//--------------------------------------------





//--------------------------------------------
const init = async() => {  
  //---------------------------------- CLEAR OLD TEST DATA
  console.log( chalk.green("Clearing old test data...")  )
  await axios.get(`${apiUrl}/api/v2/debug/cleartestdata`)
  
  //---------------------------------- CREATE DEFAULT SYSTEM DATA
  console.log( chalk.blue(`Creating default data.`) )
  await createSystemDefaults()

  //---------------------------------- CREATE TEST DATA
  console.log('Creating new test data...')
  let users = await createUsers(3)  
  console.log( chalk.blue(`${users.length} new users created.`) )
  let snapps = await createSnapps(users, 0)
  console.log( chalk.blue(`${snapps.length} new snapps created.`) )
  let comments = await createComments(users, snapps, 0)
  console.log( chalk.blue(`${comments.length} new comments created.`) )
  let replies = await createReplies(users, comments, 0)
  console.log( chalk.blue(`${replies.length} new replies created.`)  )
  //----------------------------------


  //---------------------------------- CREATE JSON FILES
  console.log( chalk.blue('Creating physical files...') )
  let promises = []  
  promises.push(new Promise( async(resolve) => {
    let list = await axios.get(`${apiUrl}/api/v2/users/0/5`)    
    fs.writeFile("./mockdata/__userdata.json", JSON.stringify(list.data.items, null, 4), 'utf8', (err) => {
      if (err) {
        console.log( chalk.red("An error occured while writing JSON Object to File.") )
        return console.log(err);
      }    
      resolve()
    })
  }))
  
  promises.push(new Promise( async(resolve) => {
    let list = await axios.get(`${apiUrl}/api/v2/snapps/0/5`)    
    fs.writeFile("./mockdata/__snappdata.json", JSON.stringify(list.data.items, null, 4), 'utf8', (err) => {
      if (err) {
        console.log( chalk.red("An error occured while writing JSON Object to File.") )
        return console.log(err);
      }
      resolve()
    })
  }))
  //----------------------------------
   
  
  Promise.all(promises).then( async() => {
    console.log( chalk.cyan(`All complete.  Files have been created and uploaded to the database.  Test data created and are in /static/mockdata.'}`) )
  })
  //--------------------------------------------

}


console.log( chalk.green("Waiting for server to start...") )
setTimeout(() => {
  init()
}, 2000)