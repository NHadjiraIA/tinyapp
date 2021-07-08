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
const CheckIfEmailAndPasswordExist = (users,email,password)=>{
  let keysOfUsers = Object.keys(users);
  for (let i = 0; i < keysOfUsers.length; i++) { 
    if ( users[keysOfUsers[i]].email === email && users[keysOfUsers[i]].password === password ) {
      return users[keysOfUsers[i]];
      
    }    
   
  }
  return false;
 
}
const urlsForUser = (urlDatabase, id,shortUrl) =>{
  let keysOfUrlDatabase = Object.keys(urlDatabase);
  
  console.log(keysOfUrlDatabase);
  for (let i = 0; i < keysOfUrlDatabase.length; i++){
   if ( urlDatabase[keysOfUrlDatabase[i]].userID === id && keysOfUrlDatabase[i] == shortUrl){
     //result.push(urlDatabase[keysOfUrlDatabase[i]])
     console.log("this is the logurls ",{"shortURL" :keysOfUrlDatabase[i],"longURL": urlDatabase[keysOfUrlDatabase[i]].longURL} )
    return {"shortURL" :keysOfUrlDatabase[i],"longURL": urlDatabase[keysOfUrlDatabase[i]].longURL };
     
  }
   
  }
  return false;
}
module.exports = {getUserByEmail, CheckIfEmailAndPasswordExist, urlsForUser}