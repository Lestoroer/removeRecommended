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
                if (err) return console.log(err);
                let data = JSON.parse(body);
                let user_id = data.user_id;
                let access_token = data.access_token;

                request(`https://api.vk.com/method/users.get?user_ids=${user_id}&fields=photo_50,city,verified&access_token=${access_token}&v=5.74`, function(err, rez, body) {
                    if (err) return console.log(err);
                    let data = JSON.parse(body);
                    data.name = data.response[0].first_name + ' ' +data.response[0].last_name;
                    data.photo = data.response[0].photo_50;
                    res.send(`<div login style="display:none">${JSON.stringify(data)}</div>😉 Your authorization is successful 😉`);
                });

            });
        } else {
            let link = `https://oauth.vk.com/authorize?client_id=${secret.vk.client_id}&response_type=code&display=mobile&redirect_uri=${secret.domen}/vk/`;
            res.redirect(link);
        }
    });
}