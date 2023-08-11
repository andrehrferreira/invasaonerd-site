//Application controller
import '@babel/polyfill/noConflict';

import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import timeout from "connect-timeout";
import passport from "passport";
import redisStore from "connect-redis";
import { $, plugins, routes } from "@dekproject/scope";
import publicCors from './middlewares/public'
import cors from 'cors'


import paginate from "./middlewares/paginate";
import response from "./middlewares/response";

(async () => {
    dotenv.config(); //Load .env

    $.set("app", express());
    $.set("dev", !(process.env.NODE_ENV === 'production'));

    //Sessão e login
    const RedisStore = redisStore(session);

    $.app.use(session({
        store: new RedisStore({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 86400000 }
    }));

    $.app.use(passport.initialize());
    $.app.use(passport.session());
    $.set("passport", passport);

    //Outros middlewares
    $.app.use(cookieParser());
    $.app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    $.app.use(bodyParser.json({limit: '50mb'}));
    $.app.use(timeout('60s')); //Define que nenhuma request por ter mais de 20s

    if($.dev) $.app.use(cors())
    else $.app.use(publicCors)

    if(process.env.DEBUG)
        $.app.use(morgan('tiny')); //Debug

    await plugins("node_modules/@dekproject");

    //Middlewares
    $.app.use(paginate)
    $.app.use(response)

    const PORT = process.env.PORT || 5555;

    $.wait(["mongoose", "mongodb", "redis"]).then(async () => {
        $.app.use("/api", await routes($.dev ? "src/routes" : "build/routes"));

        $.app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}!`);
        });
    }).catch((e) => {
        console.log(e)
        console.log("The wait timeout was reached without loading the dependencies");
        process.exit(-1);
    });
})();
