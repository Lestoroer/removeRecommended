const secret = require('../config');

const request = require('request');
// v-- авторизация



module.exports = (app) => {

    app.get('/vk', (req, res) => {
        console.log(req.url);
        if (req.query.code) {
            if (req.query.error) {
                res.end('error');
                console.log(`vk oauth error:: ${req.query.error}`.red);
            }
            let code = req.query.code;
            console.log(`code: ${code}`);
            let link = `https://oauth.vk.com/access_token?client_id=${secret.vk.client_id}&client_secret=${secret.vk.client_secret}&code=${code}&redirect_uri=${secret.domen}/vk/`;
            // res.redirect(link);
    
            request(link, function (err, res2, body) {
                console.log(body);
                if (body === undefined) return console.log(arguments);
                let data = JSON.parse(body);
                let user_id = `v${data.user_id}`;
                let access_token = data.access_token;
                console.log(user_id, access_token);
                res.end(`your id = ${user_id}`);
                // mongo.updateById({ id: user_id }, { id: user_id, token: token }, function (err, rez) {
                //     // console.log(rez.result);
                //     users[user_id] = users[user_id] || {};
                //     users[user_id].token = token;
                //     let options = { maxAge: 1000 * 60 * 60 * 24 * 365 };
                //     res.cookie('id', user_id, options);
                //     res.cookie('token', token, options);
                //     res.redirect('/');
                //     console.log(users);
                // });
            });
        } else {
            let link = `https://oauth.vk.com/authorize?client_id=${secret.vk.client_id}&response_type=code&display=mobile&redirect_uri=${secret.domen}/vk/`;
            res.redirect(link);
        }
    });
}