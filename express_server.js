
const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const bodyParser = require("body-parser");
const { request } = require("express");
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

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
  
  console.log(req.cookies.username);
 
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  //pass data to the template
  res.render("urls_index", templateVars);
 
});
app.get("/urls/new", (req, res) => {
  
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new",templateVars);
  
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase.b2xVn2 ,username: req.cookies["username"] };
   
  res.render("urls_show", templateVars);
  console.log('all urls in urldatabase  displayed')
});
//add data to urlDatabase
app.post('/urls', function(request, response){
  const longUrl = request.body.longURL;
  const shortUrl = randomString(6, '0123456789abcdefjASDFG');
  urlDatabase[shortUrl] = longUrl;
  console.log(urlDatabase);
  response.send('new short url created');
});
app.get("/u/:shortURL", (req, res) => {
  console.log(urlDatabase)
  const shortUrl = urlDatabase[req.params.shortURL]
  if(shortUrl){
    const longUrl = urlDatabase[req.params.shortURL]
    res.redirect(longUrl);
  } else {
    res.status(404).send("the page of this url don't exist in our database");
  } 
});
//route that delete a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortUrl = req.params.shortURL;
  delete urlDatabase[shortUrl];
   
});
//route that updates a URL
app.post("/urls/:id", (req, res) => {
  const shortUrl = req.params.id;
  urlDatabase[shortUrl]= req.body.longURL;
  res.redirect("/urls");
   
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
// route login
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username',username);  
  res.redirect("/urls");       
});
// route logout 
app.post("/logout", (req, res) => { 
  res.clearCookie('username')
  res.redirect("/urls");       
});
 
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
