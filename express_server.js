
const express = require("express");

const bcrypt = require("bcrypt");
const {getUserByEmail, urlsOfUser, CheckIfEmailAndPasswordExist, urlsForUser }= require("./helpers.js");
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
  },
  i3BGr: {
    longURL: "https://www.youtube.com",
    userID: "user2RandomID"
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
    const user = users[userId];
    const templateVars = { urls: urlDatabase, user: user }; 
    res.render("urls_index",templateVars);
  } else {
    res.redirect("/login");
  }
});
// GET /urls
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    const user = users[userId];
    const result = urlsOfUser(urlDatabase, userId);   
    console.log(urlDatabase);
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
    res.redirect("/login");
  }

});
// GET /urls/:id
app.get("/urls/:shortURL", (req, res) => {

 const userId = req.session.user_id;
  if (userId) {
    const user = users[userId];
    const result = urlsForUser(urlDatabase, userId,req.params.shortURL);
    let templateVars ={
     shortURL: result.shortURL,
     longURL: result.longURL
    }
    templateVars.user = user;
    if (templateVars) {
      res.render("urls_show", templateVars);
    } else{
      res.status(404).send("the page of this url don't exist in our database");
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
    console.log("we are in 128"); 
    urlDatabase[shortUrl] = {longURL: longUrl, userID:userId };
    response.redirect("/urls");
  } else {
    console.log("we are in 132"); 
    response.redirect("/login");
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
    contentError = "the page of this url don't exist in our database";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      console.log(templateVars)
      res.render("error_message",templateVars);
    
  } 
});
//POST /urls (route that delete a URL)
app.post("/urls/:shortURL/delete", (req, res) => {;
  const userId = req.session.user_id;
  if (userId) {
    const shortUrl = req.params.shortURL;
    delete urlDatabase[shortUrl];
    res.redirect("/urls");
  } else {
    res.render("error_message");
  }
});
// POST /urls/:id (route that updates a URL)
app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  
  if (userId) {
    const shortUrl = req.params.id;
    urlDatabase[shortUrl]= {longURL: req.body.longURL, userID:userId }
    res.redirect("/urls");
  } else {
    const user = users[userId];
    const templateVars = { user: user };
    res.render("error_message",templateVars);
    
  }
});
 
// POST /login  
app.post("/login", (req, res) => {
  const userId = req.session.user_id;
  const password = req.body.password; // found in the req.params object
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = req.body.email;;
  const user = CheckIfEmailAndPasswordExist(users,email,password);
  console.log(users.email)
  if ( bcrypt.compareSync(password , hashedPassword) ){
    if (email === '' || password === ''){     
      contentError = "the user or the  password is empty ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      console.log(templateVars)
      res.render("error_message",templateVars);
  
    } else if (!user) {
      
      contentError = "the user doesn't exist ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      console.log(templateVars)
      res.render("error_message",templateVars);
      

    } else if (email !== user.email || password !== user.password) {
       contentError = "the email or password is incorrect  ";
     const user = users[userId];
     const templateVars = { user: user , errorMessage: contentError};
     console.log(templateVars)
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
  const user = users[userId];
  const templateVars = { user: user }; 
  res.render("login_form",templateVars);       
});
// POST /logout 
app.post("/logout", (req, res) => { 
  req.session = null;
  res.redirect("/urls" );       
});
// GET /register  
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
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
      console.log(templateVars)
      res.render("error_message",templateVars);
    } else if (userExist) {
      contentError = "this user is already exist ";
      const user = users[userId];
      const templateVars = { user: user , errorMessage: contentError};
      console.log(templateVars)
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
