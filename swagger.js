const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sport Club API',
            description: "API endpoints for a sport club services documented on swagger",
            contact: {
                name: "Melika Paktalat"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:3000/",
                description: "Local server"
            }
        ]
    },
    // looks for configuration in specified directories
    apis: ['./routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(options);
module.exports = function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}