/*
    1.  Let's import the easyinvoice library so we can use it.
    2.  Let's import the built-in NodeJS fs library,
        so we can interact with the file system to save our invoice 
*/    
var easyinvoice = require('easyinvoice');
var fs = require('fs');

/*  
    3.  Let's create a data object. 
        This object will contain all the data we would like to be visible on our invoice.
        We will add data later in our demo.
*/      
var data = {};

//  4.    Let's use the EasyInvoice library and call the "createInvoice" function
easyinvoice.createInvoice(data, function (result) {
    /*  
        5.  The 'result' variable will contain our invoice as a base64 encoded PDF
            Now let's save our invoice to our local filesystem so we can have a look!
            We will be using the 'fs' library we imported above for this.
    */
    fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
});