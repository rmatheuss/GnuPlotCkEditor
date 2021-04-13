GOW Plugin for CKEditor 4
=====================

CKEDITOR.plugins.addExternal('gnuplot', './plugins/gnuplot/', 'plugin.js');

//initialize classic or inline editor.
if ( wysiwygareaAvailable ) {
        CKEDITOR.replace( 'editor', {
                extraPlugins: 'gnuplot'
                } );
} else {
        editorElement.setAttribute( 'contenteditable', 'true' );
        CKEDITOR.inline( 'editor', {
                extraPlugins: 'gnuplot'
                } );
}


