module.exports = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        console.log(`-----You can't be here-----`)
        res.redirect('/auth/login');
    }
}