const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");
const fs = require('fs');
const cookieParser = require("cookie-parser");
const modules = require('./Graphql');
async function startApolloServer() {
    

    const server = new ApolloServer({ modules });
    await server.start();

    const app = express();

    // expres server setting
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    //express middlewares
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    

    //Routes
    const routesPath = path.join(__dirname, "routes");
    fs.readdir(routesPath, (err, files) => {
        if (err) throw new Error(err);
        files.forEach((route) => {
            const RoutePath = path.join(routesPath, route);
            const Route = require(RoutePath);
            if (Route.path && Route.router) app.use(Route.path, Route.router);
        });
    });

    server.applyMiddleware({ app });

    await new Promise((resolve) => app.listen({ port: 80 }, resolve));
    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
    return { server, app };
}

startApolloServer();

