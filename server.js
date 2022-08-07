const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Add sessions
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//Initialize passport
app.use(session({
    secret: "MyLittleSecretThatIdontWantOthersToKnow",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/carDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
            minlength: 0
        },
        password: {
            type: String,
            require: true,
            minLength: 5,
        },
        confirm: {
            type: String,
            require: true,
            minLength: 5,
        },
        fullname: {
            type: String,
            require: true,
        },
        profile: {
            type: String,
        },
        brand: {
            type: String,
            require: true,
        },
        likes:{
            stock_num: String,
            make: String,
            model: String,
            year: Number,
            color: String,
            url: String,
            price: Number,
        }

    }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/get_current_user', function (req, res) {
    if (req.isAuthenticated()) {
        res.send({
            message: "success",
            data: req.user
        })
    } else {
        res.send({
            message: "user not found",
            data: {}
        })
    }
});

app.get('/login', function (req, res) {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

app.post('/login', function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            res.redirect('/login?error=Database error');
        } else {
            const authenticate = passport.authenticate('local', {
                successRedirect: "/",
                failureRedirect: "login?error=user name or password do not match"
            })
            authenticate(req, res);
        }
    })
});

app.get('/register', function (req, res) {
    if (req.query.error) {
        res.redirect("/register.html?error=" + req.query.error);
    } else {
        res.redirect("/register.html");
    }
});

app.post('/register', function (req, res) {
    const newUser = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password,
        confirm: req.body.confirm,
        profile: req.body.profile,
        brand: req.body.brand,
    }
    if(req.body.username === ""){
        const error = "Email cannot be empty";
        res.redirect('/register.html?error=' + error  + '&input=' + JSON.stringify(newUser));
    }
    else if(req.body.password === ""){
        const error = "Password cannot be empty";
        res.redirect('/register.html?error=' + error  + '&input=' + JSON.stringify(newUser));
    }
    else if(req.body.password !== req.body.confirm){
        const error = "Passwords do not match";
        res.redirect('/register.html?error=' + error  + '&input=' + JSON.stringify(newUser));
    }
    else if(req.body.fullname === ""){
        const error = "Full name cannot be empty";
        res.redirect('/register.html?error=' + error  + '&input=' + JSON.stringify(newUser));
    }
    else if(req.body.brand === ""){
        const error = "Favorite brand cannot be empty";
        res.redirect('/register.html?error=' + error  + '&input=' + JSON.stringify(newUser));
    }
    else if(req.body.password.length < 5){
        const error = "Password must have at least 5 characters";
        res.redirect('/register.html?error=' + error  + '&input=' + JSON.stringify(newUser));
    }
    else {
        User.register(newUser, req.body.password, function(err, user){
            if (err) {
                console.log(err);
                res.redirect("/register.html?error=" + err["message"] + "&input=" + JSON.stringify(newUser));
            } else {
                console.log(user);
                const authenticate = passport.authenticate('local');
                authenticate(req, res, () => {
                    res.redirect('/')
                })
            }
        });
    }
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/")
});

app.get('/account', (req, res) => {
    res.sendFile(__dirname + "/src/account.html");
});

app.post('/like_car', (req, res) => {
    //Users need to login to like a car
    if (req.isAuthenticated()) {
        //save car to the user
        const car = req.body.car;
        const user = {
            username: req.user.username,
            fullname: req.user.fullname,
            userId: req.user._id
        }
        console.log(car.stock_num);
        console.log(user);
        User.updateOne(
            {
                _id: user.userId,
                'likes.stock_num': {$ne: car.stock_num}
            },
            {
                $push: {
                    likes: car
                }
            },
            (err) => {
                if (err) {
                    res.send({
                        message: "database error"
                    })
                } else {
                    res.send({
                        message: "success"
                    })
                }
            }
        )
    } else {
        //navigate to the login page
        res.send({
            message: "login required",
            redr: "/login"
        })
    }
});