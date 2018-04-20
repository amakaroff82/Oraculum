'use strict';

var webpack = require('webpack'),
    pkg     = require('./package.json'),  //loads npm config file
    mnfst     = require('./src/manifest.json'),  //loads manifest config file
	GenerateJsonPlugin = require('generate-json-webpack-plugin'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    path = require('path'),
	basedir = __dirname + "\\src\\";
    	
/*	let content_scripts = mnfst.content_scripts[0].js.map((p) => basedir + p);
	let background_scripts = mnfst.background.scripts.map((p) => basedir + p);

	mnfst.content_scripts[0].js = ['content.js'];
	mnfst.background.scripts = ['vendor.js', 'background.js'];*/
	
module.exports = {
    context: __dirname + "/src",
	entry: {
		background: ['./background/app.js'],
        content: ['./content/app.js']
	},
	output: {
		path: __dirname + "/dest", 
		filename: "[name].js",
        publicPath: "/dest/"
	},
	module: {
        rules: [{
            test: __dirname + "/src/assets/*.png",
            use: {
                loader: 'file-loader',
                options: {
                    //publicPath: "assets",
                    //outputPath: "assets"
                    //name: '[path][name].[ext]'
                }
            }
        },{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
		},{
            test: /\.scss$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader", // compiles Sass to CSS
                options: {
                    includePaths: ["./src/assets"]
                }
            }]
		}]
	},
    devtool: 'source-map',
	plugins: [
		new GenerateJsonPlugin ("./manifest.json", mnfst),
		new CopyWebpackPlugin([{
			from: './assets',
			to: './assets'
		}])
	]
}