module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname+'/js',
        filename: "bundle.js"
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
    }
};