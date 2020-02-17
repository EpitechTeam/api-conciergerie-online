const admin = async (req, res, next) => {
    if (!req.user || req.user.type != 'admin') {
	    res.status(403).send({error: 'Not authorized to access this resource'});
	    return;
    }
    next();
}

module.exports = admin
