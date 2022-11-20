var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
var mysql = require('mysql');
var session = require('express-session');
const { Product, Customer, Cart, CartProduct, Favourite, ContactUs } = require("./models");
const { sequelize, Sequelize } = require("./models/index");
var auth = require('./auth');
var alert = require('alert');

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



// display login page
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


// display home page
app.get('/index', auth.isAuthorized, async function (req, res) {
    const products = await Product.findAll();
    res.render('pages/index.ejs', { result: products });
})


// cart post request, add product to cart
app.post('/add_to_cart', auth.isAuthorized, async function (req, res) {
    let cart = await Cart.findOne({ where: { customer_id: req.session.customer_id } });
    if (cart === null) {
        cart = await Cart.create({
            customer_id: req.session.customer_id
        });
    }
    let cartProduct = await CartProduct.findOne({ where: { cart_id: cart.cart_id, product_id: req.body.product_id } });
    if (cartProduct === null) {
        cartProduct = await CartProduct.create({
            cart_id: cart.cart_id,
            product_id: req.body.product_id,
            quantity: req.body.quantity
        });
    } else {
        cartProduct.set({
            quantity: cartProduct.quantity + parseInt(req.body.quantity)
        });
        await cartProduct.save();
    }
})


// display cart page, get request
app.get('/cart', auth.isAuthorized, async function (req, res) {
    const products = await sequelize.query(" SELECT * FROM products, cartProduct WHERE products.product_id = cartProduct.product_id; ")
    res.render('pages/cart', { result: products });
})


// signup get request, display sigUp
app.get('/signUp', function (req, res) {
    res.render('pages/signUp');
})


// signup post request
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
    res.render('pages/createListing');

})


// create listing post request
app.post('/createListing', auth.isAuthorized, async function (req, res) {
    const products = await Product.findAll({
        where: {
            name: req.body.product_name
        }
    });

    if (products.length == 0) {
        const newProduct = await Product.create({
            name: req.body.product_name,
            category_id: req.body.product_category_id,
            image: req.body.product_image,
            quantity: req.body.product_quantity
        });
        res.redirect('/index')
    } else {
        res.redirect('/createListing')
    }
})


// add products to favourite
app.post('/add_to_favourite', async (req, res) => {
    const favourite = await Favourite.findOne({ where: { customer_id: req.session.customer_id, product_id: req.body.product_id } });
    if (favourite === null) {
        //Add a favourite
        await Favourite.create({
            customer_id: req.session.customer_id,
            product_id: req.body.product_id
        });
    } else {
        //Remove from favourite
        await Favourite.destroy({ where: { id: favourite.id } });
    }
    //Return the updated list of favourites
    const favourites = await Favourite.findAll({ where: { customer_id: req.session.customer_id }, attributes: ['product_id'] });
    let favouritedProductIds = [];
    favourites.forEach((favourite) => {
        favouritedProductIds.push(favourite.product_id);
    });
});


// favourites page
app.get('/favourite', async (req, res) => {
    const favourites = await sequelize.query("SELECT * FROM `favourite` AS `Favourite` INNER JOIN `products` AS `Product` ON `Favourite`.`product_id` = `Product`.`product_id` WHERE `Favourite`.`customer_id` = " + req.session.customer_id)
    console.log(favourites)
    res.render('pages/favourite', { result: favourites });
});


// cart remove
app.post('/remove_from_cart', async (req, res) => {
    let cart = await Cart.findOne({ where: { customer_id: req.session.customer_id } });
    if (cart === null) {
        alert("cart is empty");
    }
    let cartProduct = await CartProduct.findOne({ where: { cart_id: cart.cart_id, product_id: req.body.product_id } });
    if (cartProduct === null) {
        alert("This product isn't there inside this member's cart");
    } else {
        await CartProduct.destroy({ where: { cart_id: cart.cart_id, product_id: req.body.product_id } });
        const products = await sequelize.query(" SELECT * FROM products, cartProduct WHERE products.product_id = cartProduct.product_id; ")
        res.render('pages/cart', { result: products });
    }
});

app.post('/contact_us', async (req, res) => {
    await ContactUs.create({
        customer_id: req.session.customer_id,
        phone_number: req.body.phone_number,
        message: req.body.message
    });
    res.redirect("/index");
})


console.log("server running on port 8080");