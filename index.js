var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();
var mysql = require('mysql');
var session = require('express-session');
const { Product, Customer, Cart, CartProduct, Favourite } = require("./models");
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

app.get('/cart', auth.isAuthorized, async function (req, res) {
    const products = await sequelize.query(" SELECT * FROM products, cartProduct WHERE products.product_id = cartProduct.product_id; ")
    res.render('pages/cart', { result: products });
})


app.post('/remove_product', auth.isAuthorized, function (req, res) {

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


app.get('/favourite', async (req, res) => {
    // const favourites = await Favourite.findAll({
    //     where: { customer_id: req.session.customer_id },
    //     include: {
    //         model: Product,
    //         required: true
    //     }
    // });
    const favourites = await sequelize.query("SELECT * FROM `favourite` AS `Favourite` INNER JOIN `products` AS `Product` ON `Favourite`.`product_id` = `Product`.`product_id` WHERE `Favourite`.`customer_id` = " + req.session.customer_id)
    // SELECT * FROM `favourite` AS `Favourite` INNER JOIN `products` AS `Product` ON `Favourite`.`product_id` = `Product`.`product_id` WHERE `Favourite`.`customer_id` = 1;
    // const member = await Member.findOne({ where: { id: req.user.id } });
    // const response = {
    //     favourites: favourites,
    //     memberInfo: {
    //         photo: member.photo,
    //         userName: member.first_name
    //     }
    // }
    console.log(favourites)
    res.render('pages/favourite', { result: favourites });
});

console.log("server running on port 8080");