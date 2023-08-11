module.exports = (req, res, next) => {
    res.apiError = function (obj) {
        let message = obj
        if (typeof obj == 'object')
            message = obj.message

        res.status(500).send({
            status: 500,
            error: message
        }).end();
    }

    res.apiSend = function (data) {
        res.status(200).send({
            status: 200,
            data: data,
            session: req.sessionID
        }).end();
    }

    next();
}
