/*
    Example use case: router.post('/vote, validateLoggedIn, vote);
*/
const validateLoggedIn = (req, res, next)=>{
    if (req.session && req.session.user){
        // User is logged in
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}
module.exports = validateLoggedIn;