const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const router = express.Router();
const dotenv = require('dotenv');

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({
  path: "./data/config.env"
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, re) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/30efb08666";
  const options = {
    method: "POST",
    auth: `prathamesh1:${process.env.MAILCHIMP_API_KEY}`
  };

  const request = https.request(url, options, function (response) {
    
    if(response.statusCode === 200){
        re.sendFile(__dirname + "/success.html");
    }else{
        re.sendFile(__dirname + "/failure.html");
    }
    
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

//redirecting to home by pressing try again butn of failure page
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server is working at port 3000");
})
