let email = '';
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
const getUserByEmail = (users,email)=>{
  let keysOfUsers = Object.keys(users);
  let userId = '';
  for (let i = 0; i < keysOfUsers.length; i++) { 
    if ( users[keysOfUsers[i]].email === email) {
       userId = users[keysOfUsers[i]].id;
       return userId;
    }    
   
  }
  return undefined;
  console.log('this is the ckeck od user id exist',userId)
  // return false;
 
}
//check if the email given existe in our database
const CheckIfEmailExist = (users,email)=>{
  let keysOfUsers = Object.keys(users);
  for (let i = 0; i < keysOfUsers.length; i++) { 
    if ( users[keysOfUsers[i]].email === email  ) {
      return users[keysOfUsers[i]];      
    }     
  }
  return false; 
}
//check if the email and the password given are correct
const CheckIfEmailAndPasswordCorrect = (users,email,password)=>{
  let keysOfUsers = Object.keys(users);
  let status ="incorrect";
  for (let i = 0; i < keysOfUsers.length; i++) { 
     if (users[keysOfUsers[i]].password === password && users[keysOfUsers[i]].email === email ) {
      status = "password correct"
    }
   
  }
  return status;
 
}
//check if the urls is the the url of the user with an UserId is "id"
const urlsForUser = (urlDatabase, id,shortUrl) =>{
  let keysOfUrlDatabase = Object.keys(urlDatabase);
  let status = "not found" 
  for (let i = 0; i < keysOfUrlDatabase.length; i++){
   
   if ( urlDatabase[keysOfUrlDatabase[i]].userID === id && keysOfUrlDatabase[i] === shortUrl){
    let urlsFound = {"shortURL" :keysOfUrlDatabase[i],"longURL": urlDatabase[keysOfUrlDatabase[i]].longURL };
    return urlsFound;     
  } else if ( keysOfUrlDatabase[i] === shortUrl && 
    urlDatabase[keysOfUrlDatabase[i]].userID !== id ) {
    return "this url is not for this user";
  } else if( keysOfUrlDatabase[i] === shortUrl) {
    status = "found";
  } 
   
  }
  return status;
}
//check if the urls of the user with UserId is "id" exist
const urlsOfUserExist = (urlDatabase, id,shortUrl) =>{
  let keysOfUrlDatabase = Object.keys(urlDatabase);
  for (let i = 0; i < keysOfUrlDatabase.length; i++){
   if ( urlDatabase[keysOfUrlDatabase[i]].userID === id && keysOfUrlDatabase[i] === shortUrl){
      return true
  }
   
  }
  return false;
}
// return the urls of the user with UserId is "id"
const urlsOfUser = (urlDatabase, id) =>{
  let keysOfUrlDatabase = Object.keys(urlDatabase);
  let urlsOfUser = {};
  for (let i = 0; i < keysOfUrlDatabase.length; i++){
    if ( urlDatabase[keysOfUrlDatabase[i]].userID === id ){
      urlsOfUser[keysOfUrlDatabase[i]] = urlDatabase[keysOfUrlDatabase[i]];
    }    
  }
  return urlsOfUser; 
   
}
module.exports = {urlsOfUser,urlsOfUserExist, getUserByEmail, CheckIfEmailExist, urlsForUser,CheckIfEmailAndPasswordCorrect}