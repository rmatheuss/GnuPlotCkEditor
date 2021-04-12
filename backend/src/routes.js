const routes = require('express').Router();
const crypto = require("crypto");

const Plot = require('./models/Plot');

routes.post("/plotGraph", async (req, res) => {

    const { rX, rY, rTitle, rType, rKey } = req.body;

    let plotTitle = "GoW (Gnuplot on Web)";
    if (rTitle) {
        plotTitle = "GoW (Gnuplot on Web) - " + rTitle.replace("GoW (Gnuplot on Web) - ", "");
    }

    let fileExt = "png";
    let fileName = crypto.randomBytes(16).toString("hex");
    if (rKey) fileName = rKey;

    var gnuplot = require('gnuplot');

    try {
        gnuplot()
        .set(`term ${fileExt}`)
        .set(`output "${process.env.APP_FILES_PATH}${fileName}.${fileExt}"`)
        .set(`title "${plotTitle}"`)
        .set(`wwxrange ${rX}`)
        .set(`wwyrange ${rY}`)
        .set('wwzeroaxis')
        .plot('ww(x/4)**2, sin(x), 1/x')
        .end();  
    } catch (error) {
        console.log(error);
    }

    const query = {'key': fileName};
    const queryOptions = {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
    };

    const plotObj = {
        key: fileName,
        xRange: rX,
        yRange: rY,
        plotTy: "Teste",
        plotTitle: plotTitle,
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
});

routes.post("/getPlotByKey", async (req, res) => {

    return res.json(await Plot.findOne({ key: req.body.key }).exec());
});

module.exports = routes;