let express = require('express');
let app = express();//require('express')();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.end(':)');
});

require('./server/vk') (app);
require('./server/google') (app);
require('./server/facebook') (app);

app.listen(80);