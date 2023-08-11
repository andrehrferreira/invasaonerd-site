
module.exports = (req, res, next) => {
    req.paginate = {
        findFields: null,
        likeMode: false,
        query: () => {
            var searchTerm = (req.query.find) ? req.query.find : "";
            var queryObject = {};

            if(searchTerm){
                if(Array.isArray(req.paginate.findFields)){
                    if(req.paginate.findFields.length > 0){
                        queryObject["$or"] = [];

                        req.paginate.findFields.forEach((field) => {
                            var OrQuery = {};

                            if(field !== "_id"){
                                if(req.paginate.likeMode)
                                    OrQuery[field] = { '$regex' : searchTerm, '$options' : 'img' };
                                else
                                    OrQuery[field] = searchTerm;

                                queryObject["$or"].push(OrQuery);
                            }
                        });
                    }
                    else{
                        if(req.paginate.likeMode)
                            queryObject[fields[0]] = { '$regex' : searchTerm, '$options' : 'img' }
                        else
                            queryObject[fields[0]] = searchTerm
                    }
                }
                else if(typeof req.paginate.findFields == "string"){
                    if(req.paginate.likeMode)
                        queryObject[req.paginate.findFields] = { '$regex' : searchTerm, '$options' : 'img' }
                    else
                        queryObject[req.paginate.findFields] = searchTerm
                }
            }

            return queryObject;
        },
        options: () => {
            var page = (req.query.page) ? parseInt(req.query.page) : 1;

            var rawOptions = {
                limit: (req.query.rowsPerPage) ? parseInt(req.query.rowsPerPage) : 10
            }

            rawOptions.skip = (req.query.skip) ? parseInt(req.query.skip) : ((page-1) * rawOptions.limit);

            if(req.query.sortBy){
                rawOptions.sort = {};
                rawOptions.sort[req.query.sortBy] = (req.query.descending == "true") ? -1 : 1;
                console.log(rawOptions.sort)
            }

            return rawOptions;
        },
        paginate: (docs, total, options) => {
            return{
                totalDocs: total,
                pages: Math.round(total/options.limit),
            }
        },
        send: (docs, total) => {
            return {
                items: docs,
                options: req.paginate.options(),
                query: req.paginate.query(),
                paginate: req.paginate.paginate(docs, total, req.paginate.options()),
                total: total
            }
        }
    }

    next();
}
