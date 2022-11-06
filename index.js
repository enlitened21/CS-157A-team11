var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
const encoder = bodyParser.urlencoded();
var mysql = require('mysql')
var session = require('express-session');
//const { Member, Flight, Gate, Baggage } = require("./models");
const { sequelize, Sequelize } = require("./models/index");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"CS157A_project"
})

connection.connect(function(error){
    if (error) throw error
    else console.log('Connection successfull')
})

var app = express();

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.listen(8080);
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"secret"}))


function isProductInCart(cart, id){
    for (let i = 0; i < cart.length; i ++){
        if (cart[i].id == id){
            return true;
        }
    } 
    return false;
}

app.get('/', function(req, res){
    res.render('pages/login');
})

// Login page
app.post('/', encoder, function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    connection.query("select * from customer where username = ? and password = ?",[username, password], function(error, results, fields){
        if (results.length > 0) {
            res.redirect('/index')
        } else {
            res.redirect('/')
        }
        res.end();
    })
})

app.get('/index', function(req, res){
    connection.query("SELECT * FROM products", (err, result) => {
        res.render('pages/index.ejs', {result:result})
    });
})

app.post('/add_to_cart', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var category = req.body.category;
    var image = req.body.image;
    var product = {id:id, name:name, category:category, image:image}

    if(req.session.cart){
        var cart = req.session.cart;

        if (!isProductInCart(cart, id)){
            cart.push(product)
        } 
    } else{
        req.session.cart = [product];
        var cart = req.session.cart;
    }
     
    res.redirect('/cart');
})

app.get('/cart', function(req, res){
    var cart = req.session.cart;
    
    res.render('pages/cart', {cart:cart});

})


app.post('/remove_product', function(req, res){
    var id = req.body.id;
    var cart = req.session.cart;
    
    for(let i = 0; i < cart.length; i ++){
        if (cart[i].id == id){
            cart.splice(cart.indexOf(i), i);
        }
    }
    res.redirect('/cart');
})




console.log("server running on port 8080");