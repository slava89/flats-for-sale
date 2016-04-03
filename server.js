var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/buy-a-flat')

var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    description: String,
    comments: Array,
    // likes: Number
});

var Flat = mongoose.model('Flat', blogSchema)

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
    Flat.findById(req.params.id, function(err, flat) {
        if (err) return res.status(403).send(err);
        
        flat.comments.push(req.body.comment);
        flat.save();
        
        return res.send(flat);
    })
})

app.delete('/api/flat/:id/comment/:index', function (req, res) {
    Flat.findById(req.params.id, function(err, flat) {
        if (err) return res.status(403).send(err);
        
        flat.comments.splice(req.params.index, 1);
        flat.save();
        
        return res.json(flat)
       // return res.send(flat);
    })
})

app.listen(3000)
