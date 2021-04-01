const routes = require('express').Router();
//const multer = require('multer');
const crypto = require("crypto");

const Plot = require('./models/Plot');

routes.post("/plotGraph", async (req, res) => {

    // let rangeX = '[-10:10]';
    // let rangeY = '[-5:5]';
    let rangeX = req.body.rX;
    let rangeY = req.body.rY;

    let fileExt = "png";
    let fileName = crypto.randomBytes(16).toString("hex");
    // let fileName = "9165f34d28b85a8322c0684032d2c2f0";

    var gnuplot = require('gnuplot');
    gnuplot()
        .set(`term ${fileExt}`)
        .set(`output "${process.env.APP_FILES_PATH}${fileName}.${fileExt}"`)
        .set('title "CKEditor GNUPlot"')
        .set(`xrange ${rangeX}`)
        .set(`yrange ${rangeY}`)
        .set('zeroaxis')
        .plot('(x/4)**2, sin(x), 1/x')
        .end();

    const query = {'key': fileName};
    const queryOptions = {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
    };

    const plotObj = {
        key: fileName,
        xRange: rangeX,
        yRange: rangeY,
        plotTy: "Teste",
        url: `${process.env.APP_URL}/files/${fileName}.${fileExt}`,
    };
    
    await Plot.findOneAndUpdate(query, plotObj, queryOptions, 
        (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
            return res.json(err);
        }
        return res.json(doc);
    });
    // const post = await Post.create({
    //     key: fileName,
    //     plotRange: "testeRange",
    //     url: `${process.env.APP_URL}/files/${fileName}.${fileExt}`,
    // });
    // return res.json(post);
});

routes.post("/getPlotByKey", async (req, res) => {

    return res.json(await Plot.findOne({ key: req.body.key }).exec());
    
});

module.exports = routes;