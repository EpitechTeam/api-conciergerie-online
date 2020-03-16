const models = {};

function modelToRoute(router, method, modelName, route, callback) {
    router[method](`/${modelName}s${route}`, async (req, res) => {
        try {
            res.send(await callback(models[modelName], req));
        } catch (error) {
            res.send(error.errors, 400);
        }
    });
}

function fromModel(router, modelName) {
    // Require model
    const lowercaseModelName = modelName.toLowerCase();
    models[lowercaseModelName] = require(`../../models/${modelName}`);
    modelName = lowercaseModelName;

    // Get with pagination
    modelToRoute(router, 'get', modelName, '', async (model, req) => {
        let { page=1, results=10, sortField, sortOrder, ...query } = req.query;
        page = parseInt(page) - 1;
        results = parseInt(results);

        return {
            results: await model.find(query)
                .limit(results)
                .skip(page * results)
                .sort({ [sortField]: sortOrder == 'descend' ? 1 : -1 }),
            totalCount: await model.countDocuments(query)
        };
    });

    // Rest routes
    modelToRoute(router, 'get', modelName, '/:id', (model, req) => model.findById(req.params.id));
    modelToRoute(router, 'post', modelName, '', (model, req) => model.create(req.body));
    modelToRoute(router, 'put', modelName, '/:id', (model, req) => model.findByIdAndUpdate(req.params.id, req.body));
    modelToRoute(router, 'delete', modelName, '/:id', (model, req) => model.findByIdAndDelete(req.params.id));
}

module.exports = (router) => ({
    modelToRoute: (...args) => modelToRoute(router),
    fromModel: (...args) => fromModel(router, ...args)
});
