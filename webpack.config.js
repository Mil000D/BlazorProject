module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "sql-httpvfs.js",
        library: {
            type: "module"
        },
        module: true,
    },
    experiments: {
        outputModule: true
    },
    optimization: {
        minimize: true
    },
};