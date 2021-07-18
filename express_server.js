
const express = require("express");

const bcrypt = require("bcrypt");
const {getUserByEmail, urlsOfUser,urlsOfUserExist, CheckIfEmailExist, urlsForUser, CheckIfEmailAndPasswordCorrect}= require("./helpers.js");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const PORT = 8080; // default port 8080
// the urlDatabase

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

//the users
const users = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "1@1.com", 
    password: "1"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "2@2.com", 
    password: "2"
  }
}
//create  an Express JavaScript application 
const app = express();
//Using template engines with Express
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
//Using cookieSession 
app.use(cookieSession({
  name: 'session',
  keys: ['7f69fa85-caec-4xcc-acd7-ehb2ccb368d6', 's13b4b3m-41c8-47d3-93f6-8836do3jd8eb']
}))

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
// inplementation of GET / 
app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    const user = users[userId];
    const result = urlsOfUser(urlDatabase, userId); 
    const templateVars = { urls: result, user: user }   
    res.render("urls_index",templateVars);     
  } else {
    res.redirect("/login");
  }
   
});
// GET /urls/new
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    const user = users[userId];
    const templateVars = { urls: urlDatabase, user: user }; 
    res.render("urls_new",templateVars);
  } else {
    contentError = "you have to login if you had account or register if you had not an acount already";
    const user = users[userId];
    const templateVars = { user: user , errorMessage: contentError};
    res.render("error_message",templateVars);
  }
});

// GET /urls/:id
app.get("/urls/:shortURL", (req, res) => {
 const userId = req.session.user_id;
  if (userId) {
    const user = users[userId];
    const result = urlsForUser(urlDatabase, userId,req.params.shortURL);    
    if (result === "not found") {
      contentError = "this url doesn't exist in our database ";
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    } else if (result === "this url is not for this user"){
      contentError = "this url isn't your own ";
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    } else {
          let templateVars ={
         shortURL: result.shortURL,
         longURL: result.longURL
        }
        templateVars.user = user;
      res.render("urls_show", templateVars);
    }
    
  } else {
    res.redirect("/login");
  }

});

//add data to urlDatabase
app.post('/urls', function(request, response){
  const longUrl = request.body.longURL;;
  const userId = request.session.user_id;
  const shortUrl = randomString(6, '0123456789abcdefjASDFG');  
  if (userId) {   
    urlDatabase[shortUrl] = {longURL: longUrl, userID:userId };
    response.redirect("/urls");
  } else {
    contentError = "you have to login if you had an account or register if you had not an acount already";
    const user = users[userId];
    const templateVars = { user: user , errorMessage: contentError};
    res.render("error_message",templateVars);
  }
  
});
//GET /u/:id
app.get("/u/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user: user }; 
  const shortUrl = urlDatabase[req.params.shortURL]
  if(shortUrl){
    const longUrl = urlDatabase[req.params.shortURL].longURL
    res.redirect(longUrl);
  } else {
    contentError = "this url don't exist in our database";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    
  } 
});
//POST /urls (route that delete a URL)
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.shortURL;
  if (userId) {
    const user = users[userId];
    const result = urlsForUser(urlDatabase, userId,req.params.shortURL);
    if (result === "not found") {
      contentError = "this url don't exist in our database ";
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    } else if (result === "this url is not your own"){
      contentError = "you can not delete an urls that you don't own ";
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    } else {
        urlDatabase[shortUrl]= {longURL: req.body.longURL, userID:userId }
        delete urlDatabase[shortUrl];
        res.redirect("/urls");
    }  
  } else {
    contentError = "you have to login first please if you had account or register if you had not an acount already";
    const user = users[userId];
    const templateVars = { user: user , errorMessage: contentError};
    res.render("error_message",templateVars);
  }
});
// POST /urls/:id (route that updates a URL)
app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const idUrl = req.params.id;
  if (userId) {
    const user = users[userId];
    const shortUrl = req.params.id;
    const urlExistForUser = urlsOfUserExist(urlDatabase, userId,idUrl);
    if (urlExistForUser) {
        urlDatabase[shortUrl]= {longURL: req.body.longURL, userID:userId }
        res.redirect("/urls"); 
    } else {
      contentError = "you can not update an urls that you don't own ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    }    
  } else {
    contentError = "you have to login first if you had an account or you have to register if you don't have an account ";
    const user = users[userId];
    const templateVars = { user: user };
    res.render("error_message",templateVars);
    
  }
});
 
// POST /login  
app.post("/login", (req, res) => {
  const userId = req.session.user_id;
  const password = req.body.password; 
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = req.body.email;;
  const user = CheckIfEmailExist(users,email,password);
  const correctEmailPassword = CheckIfEmailAndPasswordCorrect(users,email,password);
  if ( bcrypt.compareSync(password , hashedPassword) ){
    if (email === '' || password === ''){     
      contentError = "the user or the  password is empty ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
  
    } else if (!user) {      
      contentError = "the user doesn't exist ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
      

    } else if (correctEmailPassword === "incorrect") {
      contentError = "the password is inccorect ";
    const user = users[userId];
    const templateVars = { user: user , errorMessage: contentError};
    res.render("error_message",templateVars);
    
   } else {
      req.session.user_id = user.id;
      res.redirect("urls");
    }
  }    
});
// GET /login  
app.get("/login", (req, res) => {  
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
  }else{
    const user = users[userId];
    const templateVars = { user: user }; 
    res.render("login_form",templateVars);   
  }  
      
});
// POST /logout 
app.post("/logout", (req, res) => { 
  req.session = null;
  res.redirect("/urls" );       
});
// GET /register  
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
  }
  const user = users[userId];
  const templateVars = { user: user };
  res.render("add_user",templateVars);
  
});
//POST /register
app.post("/register", (req, res) => { 
  const userId = req.session.user_id;
  const password = req.body.password;  // found in the req.params object
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = req.body.email;;
  const id = randomString(6, '0123456789abcdefjASDFG');
  let userExist = getUserByEmail(users,email);
  if (bcrypt.compareSync(password, hashedPassword)){
    if (email === '' || password === ''){
      contentError = "the user or the  password is empty ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    } else if (userExist) {
      contentError = "this user is already exist ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      res.render("error_message",templateVars);
    } else {
      users[id] = {id: id, email: email, password: password};
      req.session.user_id = id;
      res.redirect("urls");
    }
  }   
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
