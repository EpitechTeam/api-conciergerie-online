let User = require('./../../models/User')
const freelanceService = require('../algolia/freelance');
const ownerService = require('../algolia/owner')

let createUser = async (req, res) => {
    try {
        const user = new User({payed : {status: false},...req.body});
        await user.save();
        const token = await user.generateAuthToken();
        if (req.body.type === "freelance")
            freelanceService.insertFreelance({body: user}, undefined);
        else
            ownerService.insertOwner({body: user}, undefined)
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
}

let login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Votre email ou mot de passe est erroné.'})
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send({error: "Votre email ou mot de passe est erroné.", info: error})
    }
}

let getUser = async (req, res) => {
    try {
        console.log("show: ",req.params);
        const user = await User.findOne({_id: req.params._id});
        if (!user) {
            throw new Error()
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: error})
    }
};


let me = async (req, res) => {
    // View logged in user profile
    res.send(req.user)
};

let logout = async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

let logoutall = async (req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

let modifyEmail = async (req, res) => {
    try {
        const modified = await User.updateOne({_id: req.body.id}, {$set: {email: req.body.email}})
        res.status(200).send()
    } catch (error) {
        console.log(error);
        res.status(403).send({'error': 'Unprocessable entity'})
    }
}

let modifyPhone = async (req, res) => {
    try {
        const modified = await User.updateOne({_id: req.body.id}, {$set: {email: req.body.phone}})
        res.status(200).send(modified)
    } catch (error) {
        console.log(error)
        res.status(403).send({'error': 'Unprocessable entity'})
    }
}

let edit = async (req, res) => {
    let obj = Object.create(req.body);
    console.log(req.user._id, obj);
    delete obj._id;
    try {
        const modified = await User.findOneAndUpdate({_id: req.user._id}, {$set: obj});
        if (req.body.type === "freelance")
            freelanceService.insertFreelance({body:{ ...req.user, ...obj}}, undefined);
        else
            ownerService.insertOwner({body:{ ...req.user, ...obj}}, undefined);
        res.status(200).send(modified)
    } catch (error) {
        console.log(error);
        res.status(403).send({'error': 'Unprocessable entity', error})
    }
}

module.exports = {
    getUser,
    edit,
    createUser,
    login,
    me,
    logout,
    logoutall,
    modifyEmail,
    modifyPhone,
};