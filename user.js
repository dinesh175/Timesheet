var express = require('express');
var user = express.Router();
var client = require('../Db/db')
user.post('/', async function (req, res) {
    const response = req.body;
    const JsonFile = JSON.parse(JSON.stringify(response));

    let username = JsonFile["username"];
    let password = JsonFile['password'];
    let phno = JsonFile["phno"];
    let emailid = JsonFile["emailid"];
    let Querycheck = `select username,emailid from timesheet.users
    where emailid='${emailid}'`
    let result1 = await client.query(Querycheck);
    
    
    //console.log(result1.rows[0].emailid);
   
  if(result1.rowCount>0)
  {
    res.status(200).send({message:`emailid already inserted`})
  }
 
  else
  {
    let Queryinsert = `insert into timesheet.users(username,password,phno,emailid)values
    ('${username}','${password}','${phno}','${emailid}')`
    let result2 =  await client.query(Queryinsert);
     console.log(result2.rowCount)
     res.status(200).send({message:`inserted`})
  }

    
  
   
   
});
//export this router to use in our index.js
module.exports = user;