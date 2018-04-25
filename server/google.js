const request = require('request');
const secret = require('../config');

module.exports = (app) => {
    let redirect_link = `${secret.domen}/google`;
    
    let authlink = [];
    authlink.push(`https://accounts.google.com/o/oauth2/v2/auth`);
    authlink.push(`?scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile openid email profile')}`);
    authlink.push(`&access_type=offline`);
    authlink.push(`&include_granted_scopes=true`);
    authlink.push(`&state=state_parameter_passthrough_value`);
    authlink.push(`&redirect_uri=${(redirect_link)}`);
    authlink.push(`&response_type=code`);
    authlink.push(`&client_id=${secret.google.client_id}`);
    authlink = authlink.join('');

    app.get('/google', function (req, res) {
        if (req.query.code) {
            let data = req.query;
            request.post(`https://www.googleapis.com/oauth2/v4/token`, {
                form:{
                    code:data.code,
                    client_id:secret.google.client_id,
                    client_secret:secret.google.client_secret,
                    redirect_uri:`${redirect_link}`,
                    grant_type:'authorization_code'
                }
            }, function (err, rez, body) {
                if (err) return res.end(':(');
                // res.end(body);
                let data = JSON.parse(body);
                request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${data.id_token}`, function(err ,rez, body) {
                    let data = JSON.parse(body);
                    if (data.sub) {
                        //data.email;
                        let user_id = `g${data.sub}`;
                        res.end(`:) your id = ${data.sub}`);
                        // mongo.updateById({id:user_id}, {id:user_id, token:token}, function(err, rez) {
                        //     // console.log(rez.result);
                        //     users[user_id] = users[user_id] || {};
                        //     users[user_id].token = token;
                        //     let options = {maxAge: 1000 * 60 * 60 * 24 * 365};
                        //     res.cookie('id', user_id, options);
                        //     res.cookie('token', token, options);
                        //     res.redirect('/');
                        //     console.log(users);
                        // });
                    } else res.end(":(");
                })
                //https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cid&key={YOUR_API_KEY}
            })
        }
        else res.redirect(authlink);
    });
}