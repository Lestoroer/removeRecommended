let express = require('express');
let app = express();//require('express')();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.end(':)');
});

require('./auth/vk')(app);
require('./auth/google')(app);
require('./auth/facebook')(app);

let alerts = require('./DonationAlerts');
setTimeout(() => {
    alerts.load();
}, 1000);

app.listen(8080);