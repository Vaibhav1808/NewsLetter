const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https=require('https');
const app = express();
require('dotenv').config()


app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static("public"));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
  });


app.post("/", function(req, res) {
  const fname = req.body.first;
  const lname = req.body.last;
  const email = req.body.email;
  console.log(fname, lname, email);

  const data = {
    members: [
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:fname,
          LNAME:lname
        }
      }
    ]
  };
  const jsondata = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/2a0301c120";

  const options={
    method:"POST",
    auth:`vaibhav1:${process.env.API}`
  };

  const request=https.request(url,options,function(response){

    if(response.statusCode===200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsondata);
  request.end();
  });

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(3000, function(){
  console.log("server is running on port 3000");
});



//api key 88130d5d4625d5ed1772340bf71b897e-us21
// list id  2a0301c120.