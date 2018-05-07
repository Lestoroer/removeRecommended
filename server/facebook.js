const config = require('../config');

const request = require('request');
// v-- авторизация



module.exports = (app) => {

    app.get('/facebook', (req, res) => {
        var code = req.query.code;

        if (!code) {
            res.redirect(`http://www.facebook.com/dialog/oauth?client_id=${config.facebook.client_id}&redirect_uri=${encodeURIComponent(config.domen)}`);
            return;
        }

        request(`https://graph.facebook.com/oauth/access_token?client_id=${
            config.facebook.client_id
            }&redirect_uri=${
            encodeURIComponent(config.domen)
            }&client_secret=${
            config.facebook.client_secret
            }&code=${
            code
            }`, function (err, rez) {
                console.log(rez);
                res.end(':)');
            });
    });

    app.get('/facebook/terms', function(req, res) {
        res.end(':D'); 
    })
}