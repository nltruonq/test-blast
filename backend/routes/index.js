const routes = (app) => {
    app.use("/api/auth", require("./auth"));
    app.use("/api/user", require("./user"));
    app.use("/api/package", require("./package"));
    app.use("/api/prompt", require("./prompt"));
    app.use("/api/feedback", require("./feedback"));
    app.use("/api/refine", require("./refine"));
    app.use("/api/menu", require("./menu"));
    app.use("/api/student", require("./student"));
};

module.exports = routes;
