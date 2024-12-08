const swaggerDocs = require('./swagger');
const express = require('express');
const app = express();

require('./startup/config')()
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation')();



const port = process.env.PORT = 3000;
app.listen(port, () => console.log(`connect to ${port}`));

swaggerDocs(app, port);