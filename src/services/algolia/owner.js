const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex('owner');

// ObjectID field required
const insertOwner = async (req, res) => {
    const freelance = req.body;
    freelance.objectID = req.body._id;
    freelance.url = "user/"+req.body._id;
    index
        .saveObjects([freelance])
        .then((object) => {
            console.log("SAVE id", object);
            if (res)
                res.status(200).send(object)
        })
        .catch(err => {
            console.log("SAVE error", err);
            if (res)
                res.status(400).send(err)
        });
}
const findOwnerByCity = async (req, res) => {
    const {city} = req.body;
    index
        .search(city)
        .then(({hits}) => {
            console.log("HITS ", hits);
            res.status(200).send(hits)
        })
        .catch(err => {
            console.log("HITS error", err);
            res.status(400).send(err)
        });
}
const deleteOwnerById = async (req, res) => {
    const {id} = req.body;
    index.deleteObjects([id], (err, content) => {
        if (err) {
            res.status(400).send(err)
            throw err;
        }
        console.log("REMOVE", content);
        res.status(200).send(content)
    });
}

module.exports = {
    insertOwner,
    findOwnerByCity,
    deleteOwnerById
}