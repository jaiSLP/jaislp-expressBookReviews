const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
//const regd_users = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;
const { authenticated, isValid, users, authenticatedUser } = require('./router/auth_users.js');
const app = express();
//let users = [];

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Check if the user with the given username and password exists
/*
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}
*/
app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    
    const username = req.body.username; 
    const password = req.body.password;
    console.log("Received username:", username);
    console.log("Received password:", password);
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
//app.use("/customer", regd_users);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
