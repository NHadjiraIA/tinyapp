
const express = require("express");
const {CheckIfEmailExist, CheckIfEmailAndPasswordExist, urlsForUser }= require("./helper.js");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080
app.set("view engine", "ejs")
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

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

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

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
    const user = users[userId];
    const templateVars = { urls: urlDatabase, user: user }; 
    res.render("urls_index",templateVars);
  } else {
    res.redirect("/login");
  }
   
});
app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
    const user = users[userId];
    const templateVars = { urls: urlDatabase, user: user }; 
    res.render("urls_new",templateVars);
  } else {
    res.redirect("/login");
  }
 
});
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
  const user = users[userId];
  let templateVars = urlsForUser(urlDatabase, userId,req.params.shortURL);
  templateVars.user = user;
  console.log('this is the templateVars',templateVars);
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,user: user };
   
  res.render("urls_show", templateVars);
  console.log('all urls in urldatabase  displayed')
  } else {
    res.redirect("/login");
  }
});
//add data to urlDatabase
app.post('/urls', function(request, response){
  const longUrl = request.body.longURL;
  const userId = request.cookies.user_id;
  const shortUrl = randomString(6, '0123456789abcdefjASDFG');
  urlDatabase[shortUrl] = {longURL: longUrl, userID:userId };
  response.redirect("/urls");
  // console.log(urlDatabase);
  // response.send('new short url created');
});
app.get("/u/:shortURL", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user: user }; 
  const shortUrl = urlDatabase[req.params.shortURL]
  if(shortUrl){
    const longUrl = urlDatabase[req.params.shortURL].longURL
    res.redirect(longUrl);
  } else {
    res.status(404).send("the page of this url don't exist in our database");
  } 
});
//route that delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
  const shortUrl = req.params.shortURL;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
  } else {
    res.render("error_message");
  }
});
//route that updates a URL
app.post("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
  const shortUrl = req.params.id;
  urlDatabase[shortUrl]= {longURL: req.body.longURL, userID:userId }
  res.redirect("/urls");
  } else {
    res.render("error_message");
  }
   
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
// route login
app.post("/login", (req, res) => {
  // const userId = req.cookies.user_id;
  // const user = users[userId];
  const email = req.body.email;
  const password = req.body.password;
  const user = CheckIfEmailAndPasswordExist(users,email,password);
  if (email === '' || password === ''){
    res.status(400).send("the email or the password is empty");

  } else if (!user) {
    res.send("the user doesn't exist");
  } else {
    res.cookie('user_id',user.id); 
    res.redirect("urls");
  }
       
});
//route login
app.get("/login", (req, res) => {   
  res.render("login_form");       
});
// route logout 
app.post("/logout", (req, res) => { 
  res.clearCookie('user_id');
  res.redirect("/urls" );       
});
// add user 
app.get("/register", (req, res) => {
 const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { user: user };
  res.render("add_user",templateVars);

});
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = randomString(6, '0123456789abcdefjASDFG');
  if (email === '' || password === ''){
    res.status(400).send("the email or the password is empty");

  } else if (CheckIfEmailExist(users,email)) {
    res.send("this is already exist");
  } else {
    users[id] = {id: id, email: email, password: password};
    res.cookie('user_id',id);
    res.redirect("urls")
    console.log(users);
  }

   
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
