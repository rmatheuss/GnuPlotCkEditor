CKEDITOR.dialog.add( 'editPlotDialog', function ( editor ) {
    const ulrApi = "http://localhost:3000/plotGraph";

    return {
        title: 'Gnuplot - Propriedades do gráfico',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-plot-range',
                label: 'Plot Tipo 1 - Range',
                elements: [
                    {
                        type: 'hbox',
                        id: 'plotRangeX',
                        widths: [ '25%', '25%', '50%' ],
                        children: [
                            {
                                label: 'Início X',
                                type: 'text',
                                id: 'plotRangeStaRX',
                                width: '40px',
                                validate: CKEDITOR.dialog.validate.notEmpty("Informe um valor!"),

                                setup: function( element ) {
                                    let xsta = "";
                                    try {
                                        xsta = element.xRange.replace("[", "").replace("]", "").split(":")[0];
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    this.setValue(xsta);
                                }
                            },
                            {
                                label: 'Fim X',
                                type: 'text',
                                id: 'plotRangeEndRX',
                                width: '40px',
                                validate: CKEDITOR.dialog.validate.notEmpty("Informe um valor!"),

                                setup: function( element ) {
                                    let xend = "";
                                    try {
                                        xend = element.xRange.replace("[", "").replace("]", "").split(":")[1];
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    this.setValue(xend);
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        id: 'plotRangeY',
                        widths: [ '50%', '50%' ],
                        children: [
                            {
                                label: 'Início Y',
                                type: 'text',
                                id: 'plotRangeStaRY',
                                width: '40px',
                                validate: CKEDITOR.dialog.validate.notEmpty("Informe um valor!"),

                                setup: function( element ) {
                                    let ysta = "";
                                    try {
                                        ysta = element.yRange.replace("[", "").replace("]", "").split(":")[0];
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    this.setValue(ysta);
                                }
                            },
                            {
                                label: 'Fim Y',
                                type: 'text',
                                id: 'plotRangeEndRY',
                                width: '40px',
                                validate: CKEDITOR.dialog.validate.notEmpty("Informe um valor!"),

                                setup: function( element ) {
                                    let yend = "";
                                    try {
                                        yend = element.yRange.replace("[", "").replace("]", "").split(":")[1];
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    this.setValue(yend);
                                }
                            }
                        ]
                    },
                    {
                        type: 'text',
                        id: 'plotRangeTitle',
                        label: 'Título (Opcional)',
                        size: 80,
                        widths: [100, 200],

                        setup: function( element ) {
                            if (element && element.plotTitle) {
                                this.setValue(element.plotTitle);                             
                            }
                        }
                    },
                    {
                        type: 'text',
                        id: 'plotRangeKey',
                        label: '',
                        size: 80,
                        widths: [100, 200],
                        style: 'display: none;',

                        setup: function( element ) {
                            if (element && element.key) {
                                this.setValue(element.key);                             
                            }
                        }
                    }
                ]
            },
            {
                id: 'tab-adv',
                label: 'Tipo 2',
                elements: [
                    {
                        type: 'text',
                        id: 'id',
                        label: 'Id'
                    }
                ]
            }
        ],

        onShow: function() {
            const selection = editor.getSelection();
            let element = selection.getStartElement();

            if ( element && element.$ 
                && JSON.parse(element.$.getAttribute("alt")) 
                && JSON.parse(element.$.getAttribute("alt")).key) 
            {
                element = JSON.parse(element.$.getAttribute("alt"));
                this.insertMode = false;
            }
            else
            {
                element = editor.document.createElement( 'editPlot' );
                this.insertMode = true;  
            }               
            this.element = element;

            if ( !this.insertMode )
                this.setupContent( this.element );
        },

        onOk: async function() {
            var dialog = this;
            const staRX = dialog.getValueOf('tab-plot-range', 'plotRangeStaRX');
            const endRX = dialog.getValueOf('tab-plot-range', 'plotRangeEndRX');
            const staRY = dialog.getValueOf('tab-plot-range', 'plotRangeStaRY');
            const endRY = dialog.getValueOf('tab-plot-range', 'plotRangeEndRY');
            const plotTitle = dialog.getValueOf('tab-plot-range', 'plotRangeTitle');
            const plotKey = dialog.getValueOf('tab-plot-range', 'plotRangeKey');

            const dataToSend = JSON.stringify(
                    {
                        "rKey": plotKey,
                        "rX": `[${staRX}:${endRX}]`, 
                        "rY": `[${staRY}:${endRY}]`,
                        "rTitle": plotTitle,
                        "rType": plotTitle,
                    }
                );


            const rawResponse = await fetch(ulrApi, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: dataToSend
            });
            const content = await rawResponse.json();

            if (rawResponse.ok) {
                if (content && content.url) {
                    const { url, key, plotTitle, plotTy, xRange, yRange} = content;
    
                    setTimeout(function(){ 
                        let plotResult = editor.document.createElement('img');
                        plotResult.setAttribute('src', url + "?d=" + new Date().getTime());
                        plotResult.setAttribute('alt', JSON.stringify(content));
                        plotResult.setAttribute("style", "height: auto; width: 400px;");                  
                        console.log(plotResult);
                        editor.insertElement( plotResult );
                        editor.focus();
                        editor.updateElement();
                    }, 500);
                }
            }
            else{
                if (content.error) {
                    alert(content.error +'\n\nDetalhe: \n' + content.detail);
                }               
            }                    
        }
    };
});