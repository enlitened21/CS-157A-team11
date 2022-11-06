const { Customer } = require("./models");

module.exports.isAuthorized  = async function(req, res, next) {

    const customers = await Customer.findByPk(req.session.customer_id)
    console.log(customers)
    console.log(req.session)
    if (customers === null) {     
        var err = new Error('Not authorized! Go back!');
        err.status = 401;
        return next(err);
    } else {
        return next();
    }
}