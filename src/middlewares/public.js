export default (req, res, next) => {
    //CORS
    res.setHeader('Access-Control-Allow-Origin', process.env.PROXY_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");

    next();
}
