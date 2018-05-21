const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');

app.use(compression());
if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('./public'));


app.get('*', function(req, res){

    res.sendFile(__dirname + '/index.html');

});

app.listen(process.env.PORT || 8080);
