var express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');

//const config = require("./mysqlconfig.js");
const config = require("./db-config.json");

const crypto = require("crypto");

//var  config = require('./dbconfig');
const  mysql = require('mysql2');

const __public_dirname = __dirname + "/public";

var app = express();

app.use(express.json());
app.use(express.static(__public_dirname));

const connection = mysql.createConnection(config);


function validateDaysVar(value) {
   return value >= 0 && value < 128;
}

connection.connect(function (err) {
   if (err) {
      console.log("there had been an error when connecting");
      return console.log(err.message);
   }

   console.log("connected to the database");
})

// returns the page for the webclient to request items for a specified user
// the client doesn't need identification to do this

/*
app.get('/webclient', function (req, res) {

   res.sendFile( __public_dirname + "/" + "index.html" );

});
*/

function fetchUsers(callback) {
   connection.query("SELECT * FROM user;", (err, result)=>{
      if (err) {
         console.log("there was an error querying the database");
      }
      console.log("this ran2");
      callback(result,err);
   });
   console.log("this ran1");
}

function userExists(iduser, callback) {
   connection.execute("SELECT * FROM user WHERE iduser=?;",
   [iduser],
   (err, result)=>{
      if (err) {
         console.log("there was an error querying the database");
      }
      console.log("this ran2");
      callback(result.length > 0, err);
      
   });
   console.log("this ran1");
}

function fetchItems(iduser, callback) {
   connection.execute("SELECT * FROM item WHERE iduser=?;",
   [iduser],
   (err, result)=>{
      if (err) {
         console.log("there was an error querying the database");
      }
      console.log("this ran2");
      callback(result,err);
   });
   console.log("this ran1");
}



function createUser(name, callback) {
   connection.query(
      "INSERT INTO user (username) VALUES (?);",
      [name],
      (err, rows) => {
         console.log("gknsgossdjbdfkjs");
         connection.query(
            "SELECT MAX(iduser) as newId FROM user;",
            [],
            (err, result) => {
               console.log("gknsgossdjbdfkjs");
               console.log("result: " + result);
               callback(result);
            }
          );
      }
    );
}

function createItem(itemDesc, itemDays, iduser, callback) {

   let id = crypto.createHash("sha1").update(itemDesc + itemDays + iduser).digest("hex").substring(0, 20);

   connection.execute(
      "INSERT INTO item (iditem, itemdesc, itemdays, iduser) VALUES (?, ?, ?, ?);",
      [id, itemDesc, itemDays, iduser],
      (result) => {
        callback(result, id);
      }
    );
}

function deleteItem(iduser, iditem, callback) {
   connection.execute(
      "DELETE FROM item WHERE iduser=? AND iditem=?;",
      [iduser, iditem],
      (result) => {
        callback(result);
      }
    );
}

function updateItem(iditem, itemDesc, itemDays, iduser, callback) {
   connection.execute(
      "UPDATE item SET itemDesc=? itemDays=? WHERE iduser=? AND iditem=?;",
      [itemDesc, itemDays, iduser, iditem],
      (result) => {
        if (result) console.log("error when inserting value");
        callback(result);
      }
    );
}

// returns json data containing items for the specified yser  
// response if successful or not - client will reflect this
app.post('/webclient/getitems', function(req, res) {

   // gets the items of the user id specified in the post request

   console.log("recieved post request: " + req);
   console.log(req.body);

   fetchItems(req.body.user, (result)=>{
      console.log("this ran3");
      res.send(JSON.stringify(result));
   });
   //res.sendStatus(200);
});

app.post('/webclient/createuser', function(req, res) {

   // gets the items of the user id specified in the post request

   console.log("recieved post request: " + req);
   console.log(req.body);

   createUser(req.body.username, (result)=>{
      console.log("this ran3");
      console.log(result);
      res.send(JSON.stringify(result));
   });
   //res.sendStatus(200);
});

app.post('/webclient/deleteitem', function(req, res) {
   
   console.log("recieved delete request: " + req.body);

   deleteItem(req.body.user, req.body.item, (result)=>{
      console.log("delete result:" + result);
      res.send(JSON.stringify(result));
   });
});

app.post('/webclient/updateitem', function(req, res) {
   
   console.log("recieved update request: " + req.body);

   updateItem(req.body.item, req.body.desc, req.body.days, req.body.user, (result)=>{
      res.send(JSON.stringify(result));
   });

   //res.sendStatus(200);
});

app.post('/webclient/createitem', function(req, res) {
   
   console.log("recieved create request: " + req.body);

   userExists(req.body.user, (result, err)=>{
      console.log("result of errors follow!!");
      console.log(result + err);
      if (!result) {
         res.send(400);
         return;
      }
      createItem(req.body.desc, req.body.days, req.body.user, (result, id)=>{
         console.log(result);
         res.send(JSON.stringify({result: result, id: id}));
      });
   });

   //res.sendStatus(200);
});

/*
app.post('/arduinoclient/getitems', function(req, res) {

   // basically the same as getitems for the webclient

});

*/


var server = app.listen(59561, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("App listening at http://%s:%s", host, port);
})