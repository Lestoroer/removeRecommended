let app = require('express')();

app.get('/', (req, res) => {
    res.end(':))');
});

require('./server/vk') (app);

app.listen(80);