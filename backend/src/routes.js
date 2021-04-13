const routes = require('express').Router();
const crypto = require("crypto");

const Plot = require('./models/Plot');

plotar = () => {
    var run = require('comandante')
    var plot = run('gnuplot', []);

    plot.print = function (data, options) {
        plot.write(data);
        if (options && options.end) {
            plot.end();
        }
        return plot;
    };

    plot.println = function (data, options) {
        return plot.print(data + '\n', options);
    };

    ['set', 'unset', 'plot', 'splot', 'replot'].forEach(function (name) {
        plot[name] = function (data, options) {
            if (data) {
                return plot.println(name + ' ' + data, options);                
            }
            return plot.println(name, options);                
        };
    });
    return plot;
}

routes.post("/plotGraph", async (req, res) => {

    const { pX, pY, pTitle, pFunctions, pKey } = req.body;

    let plotTitle = "GoW (Gnuplot on Web)";
    if (pTitle) {
        plotTitle = "GoW (Gnuplot on Web) - " + pTitle.replace("GoW (Gnuplot on Web) - ", "");
    }

    let fileExt = "png";
    let fileName = crypto.randomBytes(16).toString("hex");
    if (pKey) fileName = pKey;

    try {
        let errors = "";
        let p = plotar();

        if (pY)
        {
            p.set(`term ${fileExt}`)
            .set(`output "${process.env.APP_FILES_PATH}${fileName}.${fileExt}"`)
            .set(`title "${plotTitle}"`)
            .set(`xrange ${pX}`)
            .set(`yrange ${pY}`)
            .plot(pFunctions)
            .end() 
        } 
        else{
            p.set(`term ${fileExt}`)
            .set(`output "${process.env.APP_FILES_PATH}${fileName}.${fileExt}"`)
            .set(`title "${plotTitle}"`)
            .set(`xrange ${pX}`)
            .plot(pFunctions)
            .end() 
        }

        p.stdout.on('data', (data) => {
            // console.log(`stdout: ${data}`);
        });

        p.stderr.on('data', (data) => {
            // console.log(`stderr: ${data}`);
            errors += `${data}`;
        });

        p.stderr.on('end', (data) => {
            // console.log("*******END");
        });

        
        p.on('exit', async (code) => {
            if (errors) {
                return res.status(500).json({ 
                    error: "Erro ao plotar gráfico", 
                    detail: errors 
                });  
            }
            else {
                const query = {'key': fileName};
                const queryOptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true,
                };

                const plotObj = {
                    key: fileName,
                    xRange: pX,
                    yRange: pY,
                    plotFunctions: pFunctions,
                    plotTitle: plotTitle,
                    url: `${process.env.APP_URL}/files/${fileName}.${fileExt}`,
                };
                
                await Plot.findOneAndUpdate(query, plotObj, queryOptions, 
                    (err, doc) => {
                    if (err) {
                        // console.log("Something wrong when updating data!");
                        return res.status(500).json({ 
                            error: "Erro ao plotar gráfico", 
                            detail: err 
                        });  
                    }
                    return res.status(200).json(doc);
                });
            }
        });
       
    } catch (err) {
        return res.status(500).json({ 
                                    error: "Erro ao plotar gráfico", 
                                    detail: err 
                                });    
    }
});

routes.post("/getPlotByKey", async (req, res) => {

    return res.status(200).json(await Plot.findOne({ key: req.body.key }).exec());
});

module.exports = routes;