let email = '';
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "1@1.com", 
    password: "1"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "2@2.com", 
    password: "2"
  }
}
const CheckIfEmailExist = (users,email)=>{
  let keysOfUsers = Object.keys(users);
  for (let i = 0; i < keysOfUsers.length; i++) { 
    if ( users[keysOfUsers[i]].email === email) {
  
      return true;
    }    
   
  }
  return false;
 
}
const CheckIfEmailAndPasswordExist = (users,email,password)=>{
  let keysOfUsers = Object.keys(users);
  for (let i = 0; i < keysOfUsers.length; i++) { 
    if ( users[keysOfUsers[i]].email === email && users[keysOfUsers[i]].password === password ) {
      return users[keysOfUsers[i]];
      return true;
    }    
   
  }
  return false;
 
}

module.exports = {CheckIfEmailExist, CheckIfEmailAndPasswordExist}