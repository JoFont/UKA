// Route Guard Middleware
// This piece of middleware is going to check if a user is authenticated
// If not, it sends the request to the custom error handler with a message
module.exports = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/auth/sign-in");
    }
};