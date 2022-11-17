var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
var mysql = require('mysql');
var session = require('express-session');
const { Product, Customer, Cart } = require("./models");
const { sequelize, Sequelize } = require("./models/index");
var auth = require('./auth');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "CS157A_project"
})

connection.connect(function (error) {
    if (error) throw error
    else console.log('Connection successfull')
})

var app = express();

app.use(express.static('public'))
app.set('view engine', 'ejs')


app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8080);
app.use(session({ secret: "secret" }))


function isProductInCart(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            return true;
        }
    }
    return false;
}

app.get('/', function (req, res) {
    res.render('pages/login');
})

// Login page
app.post('/', async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    const customers = await Customer.findAll({
        where: {
            username: username,
            password: password
        }
    });

    if (customers.length > 0) {
        req.session.customer_id = customers[0].customer_id;
        res.redirect('/index')
    } else {
        res.redirect('/')
    }
    res.end();

})

app.get('/index', auth.isAuthorized, async function (req, res) {
    const products = await Product.findAll();
    res.render('pages/index.ejs', { result: products });
})

app.post('/add_to_cart', auth.isAuthorized, async function (req, res) {
    var product_id = req.body.id;
    var customer_id = req.session.customer_id;
    var currentCart = await Cart.findAll({
        where: {
            customer_id: customer_id,
            product_id: product_id
        }
    });
    if (currentCart === null) {
        const addProduct = await Cart.create({ customer_id: customer_id, product_id: product_id });
        // add
    }
    res.redirect('/cart');

})

app.get('/cart', auth.isAuthorized, async function (req, res) {
    res.render('pages/cart');

})


app.post('/remove_product', auth.isAuthorized, function (req, res) {
    // var id = req.body.id;
    // var cart = req.session.cart;

    // for (let i = 0; i < cart.length; i++) {
    //     if (cart[i].id == id) {
    //         cart.splice(cart.indexOf(i), i);
    //     }
    // }
    // res.redirect('/cart');
})

app.get('/signUp', function (req, res) {
    res.render('pages/signUp');
})


app.post('/signUp', async function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = req.body.username;
    var password = req.body.password;

    const customers = await Customer.findAll({
        where: {
            username: username,
            password: password
        }
    });

    if (customers.length == 0) {
        const newCustomer = await Customer.create({ first_name: first_name, last_name: last_name, username: username, password: password });
        res.redirect('/index')
    } else {
        res.redirect('/signUp')
    }
    res.end();
})

//Create Listing get request
app.get('/createListing', auth.isAuthorized, async function (req, res) {
    //dasdasd
    res.render('pages/createListing');

})


app.post('/createListing', auth.isAuthorized, async function (req, res) {
    var product_name = req.body.product_name;
    var product_category = req.body.product_category;
    var product_image = req.body.product_image;

    const products = await Product.findAll({
        where: {
            name: product_name
        }
    });

    if (products.length == 0) {
        const newProduct = await Product.create({ name: product_name, category: product_category, image: product_image });
        res.redirect('/index')
    } else {
        res.redirect('/createListing')
    }
    res.end();
})

console.log("server running on port 8080");