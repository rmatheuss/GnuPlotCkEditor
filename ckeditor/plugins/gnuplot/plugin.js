CKEDITOR.plugins.add( 'gnuplot', {
    icons: 'gnuplot',
    init: function( editor ) {
        editor.addCommand( 'editPlot', 
            new CKEDITOR.dialogCommand( 'editPlotDialog' ) 
        );
        editor.ui.addButton( 'Gnuplot', {
            label: 'Gnuplot on Web (GOW)',
            command: 'editPlot',
            toolbar: 'insert'
        });

        editor.contextMenu.addListener( function( element, selection ) {
            if (element.getAscendant('img', true)) {
                if (element.$.getAttribute("alt") &&
                JSON.parse(element.$.getAttribute("alt")) &&
                JSON.parse(element.$.getAttribute("alt")).key ) {
                    return {
                        editImgCmd : CKEDITOR.TRISTATE_OFF
                    }
                }
            }
        });
        editor.addMenuItems({
            editImgCmd : {
                label : 'Editar Plot',
                icon: this.path + 'icons/gnuplot.png',
                command : 'editPlot',
                group : 'image',
                order : 2
            }
        });

        CKEDITOR.dialog.add( 'editPlotDialog', this.path + 'dialogs/editPlot.js' );

    }
});