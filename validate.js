// SAXON API: http://www.saxonica.com/ce/user-doc/1.1/html/api/

// onSaxonLoad is called when Saxon has finished loading
var onSaxonLoad = function() {
    var outputNode = document.getElementById('output');
    outputNode.textContent = 'Choose a JATS XML file to validate.';

    // insert the file selection form
    var input = document.createElement('input');
    input.setAttribute('type', 'file');

    var form = document.createElement('form');
    form.appendChild(input);

    document.body.insertBefore(form, document.body.firstChild);

    // listen for selected file
    input.addEventListener('change', function() {
        // clear any previous results
        document.querySelector('#results').textContent = '';

        outputNode.textContent = 'Processing…';

        var reader = new FileReader;

        reader.onload = function() {
            // run the Schematron tests
            Saxon.run({
                stylesheet: 'generated-xsl/jats4r-infolevel-0.xsl',
                source: Saxon.parseXML(this.result),
                method: 'transformToDocument',
                success: function(processor) {
                    outputNode.textContent = 'Converting…';

                    // convert the output XML to HTML
                    Saxon.run({
                        stylesheet: 'output.xsl',
                        source: processor.getResultDocument(),
                        method: 'updateHTMLDocument'
                    });

                    outputNode.textContent = 'Finished';
                }
            });
        }

        reader.readAsText(this.files[0]);
    });

}
