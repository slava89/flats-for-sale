var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/buy-a-flat')
var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'))
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var sha256 = require('js-sha256');

app.use(session({secret:'this is the secret'}))
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session());

var bodyParser = require('body-parser')

var multer = require('multer')
var upload = multer()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(multer())

// var upload = multer({ dest: './uploads' });




var Schema = mongoose.Schema;

var flatSchema = new Schema({
    title: String,
    description: String,
    comments: Array,
    flatLikes: { type: Number, default: 0 }
});

// var commentSchema = new Schema({
//     comments: [{
//         text: String,
//         postedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref:'UserModel'
//         }
//     }]
// });

// var Comment = mongoose.model('Comment', commentSchema)

var Flat = mongoose.model('Flat', flatSchema)

//User schema---------------------------------------
var userSchema = new Schema({
    username: String,
    password: String,
    roles: [String],
    firstName: String
});

var UserModel = mongoose.model('UserModel', userSchema);

// var admin = new UserModel({ username: 'snoop', password: '1', firstname: 'SnoopyDogg', roles: ['admin'] })
// var commonUser = new UserModel({ username: 'nigga', password: 'nigga', firstname: '50Cent', roles: ['commonUser'] })
//  admin.save();
// commonUser.save();

//===================================================================================================================
// var commentSchema = new Schema({
    
//         text: String,//defines the reference by ObjectId for the postedBy property of the commentSchema
//         postedBy: { type: mongoose.Schema.Types.ObjectId, ref:'UserModel'},
//         // postedIn: { type: mongoose.Schema.Types.ObjectId, ref:'Flat'}
    
// });
// var Comment = mongoose.model('Comment', commentSchema);
// var comment = new Comment ({text: 'Very nice flat!', postedBy: '570699fecbf8f1502cb8dd40'})

// comment.save(function(error){
//     if (!error) {
//         Comment.find({})
//         // .populate('postedBy')
//         .populate('postedBy')
//         .exec(function(error, comments){
//             console.log(JSON.stringify(comments, null, '\t'))
//         })
//     }
// })

//==================================================================================================

// var flatSchema = new Schema({
//     title: String,
//     description: String,    
//     flatLikes: { type: Number, default: 0 },
//     comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]    
// });

// var Flat = mongoose.model('Flat', flatSchema)





// var comment = new Comment({
//     title: "Hello World",
//     postedBy: alex._id,
//     comments: [{
//         text: "Nice post!",
//         postedBy: joe._id
//     }, {
//         text: "Thanks :)",
//         postedBy: alex._id
//     }]
// })


// var userSchema = new Schema({
//     username: String,
//     password: String,
//     roles: [String],
//     firstName: String,
//     comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
// });

// var UserModel = mongoose.model('UserModel', userSchema);



// // comment.save(function(error){
// //     if (!error) {
// //         Comment.find({})
// //         // .populate('postedBy')
// //         .populate('comments.postedBy')
// //         .exec(function(error, comments){
// //             console.log(JSON.stringify(comments, null, '\t'))
// //         })
// //     }
// // })

// var newComment = new Comment(req.body);
//             newUser.roles = ['commonUser'];
//             newUser.save(function(err,user)
//             {
//                 req.login(user, function(err)
//                 {
//                       if(err){return next(err);}
//                       res.json(user);
//                 });
              
                
//             });

// var likeSchema =  new Schema({
//     title: String,
//     description: String,    
//     flatLikes: { type: Number, default: 0 }
    
// });

app.post('/api/flat/:id/comment', function (req, res) {
    Flat.findById(req.params.id, function (err, flat) {
        if (err) return res.status(403).send(err);

        flat.comments.push(req.body.comment);
        flat.save();

        return res.send(flat);
    })
})



//---------------------------------------------------



app.get('/api/flats', function (req, res) {
    Flat.find({}, function (err, data) {
        if (err) return res.status(403).send(err)

        return res.json(data)
    })
})

app.post('/api/flats', function (req, res) {
    var input = req.body

    var flat = new Flat(input)

    flat.save(function (err, data) {
        if (err) return res.status(403).send(err)

        return res.json(data)
    })
})

app.get('/api/flat/:id', function (req, res) {
    Flat.findById(req.params.id, function (err, flat) {
        if (err) return res.status(403).send(err)

        return res.json(flat)
    })
})

app.delete('/api/flat/:id', function (req, res) {
    Flat.findOneAndRemove({ _id: req.params.id }, function (err, status) {
        if (err) return res.status(403).send(err)

        return res.json(status)
    })
    
})

// app.post('/api/flat/:id', function (req, res) {
    
//         Flat.findById(req.params.id, function (err, status) {
//         if (err) return res.status(403).send(err)
//         var likes = flat.likes;
//         likes += 1;
//         flat.save();
//         return res.json(status)
//     })
// })

app.post('/api/flat/:id/comment', function (req, res) {
    Flat.findById(req.params.id, function (err, flat) {
        if (err) return res.status(403).send(err);

        flat.comments.push(req.body.comment);
        flat.save();

        return res.send(flat);
    })
})

// app.post('/api/flat/:id/comment', function (req, res) {
//     Flat.findById(req.params.id, function (err, flat) {
//         if (err) return res.status(403).send(err);

//         flat.comments.push(req.body.comment);
//         flat.save();

//         return res.send(flat);
//     })
// })


// var newComment = new Comment(req.body);
// // newUser.roles = ['commonUser'];
// comment.save(function (error) {
//     if (!error) {
//         Comment.find({})
//         // .populate('postedBy')
//             .populate('comments.postedBy')
//             .exec(function (error, comments) {
//                 console.log(JSON.stringify(comments, null, '\t'))
//             })
//     }
// })
//             // newComment.save(function(err,comment)
//             // {                
//             //           if(err){return next(err)}
//             //           res.json(comment);             
                            
//             // });

app.post('/api/flat/:id/flatLikes', function (req, res) {
    Flat.findById(req.params.id, function (err, flat) {
        if (err) return res.status(403).send(err);

        flat.flatLikes = flat.flatLikes + 1;
        flat.save();

        return res.send(flat);
    })
})

app.delete('/api/flat/:id/comment/:index', function (req, res) {
    Flat.findById(req.params.id, function (err, flat) {
        if (err) return res.status(403).send(err);

        flat.comments.splice(req.params.index, 1);
        flat.save();

        return res.json(flat)
        // return res.send(flat);
    })
})

passport.use(new LocalStrategy(

    function (username, password, done) {
        UserModel.findOne({ username: username, password: password },
            function (err, user, info) {
                // if (err) {return done(err);} //not needed
              
                if (user) {
                    return done(null, user)
                }
                return done(null, false, { message: 'Unable to login' });
            });  
        
    }
    ));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//, {failureFlash: true }

// app.use(function (req, res, next) {
//   console.log(req.isAuthenticated());
//   console.log(req.user);
//   next();
// });


app.post('/login', passport.authenticate('local'), function (req, res, info) {
    // if (err || !user){
    //     res.status(400).send(info)
    // }
    // else {
    //         res.send(req.user);
    //         // res.send(req.message);
// }
    console.log('Login successfull!')
    console.log(req.user);
    res.send(req.user);
    res.send(req.message);
    // res.json(req.user);
})//res.redirect('/users/' + req.user.username);  ADD LATER!!!!!!!!!!!!!

app.post('/logout', function(req, res)
{//passportJS has property logout
    req.logOut();
    res.send(200);
})

app.get('/loggedin', function (req, res) {
    // console.log('/login')
    // console.log(req.user);
    // res.send(req.user);
    
   // Passport's method isAuthenticated to check if user was already logged in
    res.send(req.isAuthenticated() ? req.user : '0');
})

var auth = function(req, res, next)
{
    if(!req.isAuthenticated())
    {
        res.send(401);
    }
    else
    {
        next();     
    }    
            
}

app.get('/rest/user', auth, function(req, res)
{
   UserModel.find(function(err, users) {
       res.json(users);
   })
});

app.post('/registration', function (req,res) {
    UserModel.findOne({username: req.body.username}, function(err, user) {
        if(user)
        {
            res.json(null);    
        }
        else
        {
            var newUser = new UserModel(req.body);
            newUser.roles = ['commonUser'];
            newUser.save(function(err,user)
            {
                req.login(user, function(err)
                {
                      if(err){return next(err);}
                      res.json(user);
                });
              
                
            });
        }
    })
    var newUser = req.body;
    console.log(newUser);
    // res.send(200);
})

app.post('/isloggedin', function(req, res){
    if(req.isAuthenticated())
    {
        res.send({state: 'success', user: req.user});
    }
    else
    {
        res.send({state: 'failure', user: null});
    }
});

app.listen(3000)
