
const MongoClient = require('mongodb').MongoClient;

const config = require('./config');

console.log(111, config.mongo_link);

let db;

MongoClient.connect(config.mongo_link, (err, database) => {
    if (err) return console.log(err);
    console.log('success db connect');
    db = database;
})


class DonationAlerts {

    constructor() {
        this.list = [];
    }

    createData(arr) {
        let data = {};
        if (arr[0]) data.id = arr[0];
        if (arr[1]) data.name = arr[1];
        if (arr[2]) data.money = parseFloat(arr[2].split('-')[0].replace(',', '.'));
        if (arr[3]) data.msg = arr[3];
        if (arr[4]) data.date = arr[4];
        if (arr[5]) data.service = arr[5];
        if (arr[6]) data.others = arr[6];
        return data;
    }

    save() {
        // db.update
        for (let i in this.list) {
            let row = this.list[i];
            // console.log(db);
            db.collection('alert').update({ id: row.id }, { $set: row }, { upsert: true }, (err, data) => {
                if (err) console.log(err);
            });
        }
    }

    load() {
        require('request').post({
            headers: {
                "Accept": "text/html, */*; q=0.01",
                // "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Host": "www.donationalerts.ru",
                "Origin": "http://www.donationalerts.ru",
                "Referer": "http://www.donationalerts.ru/dashboard/general",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": "language=ru_RU; PHPSESSID=k6mtnkf5u5qkqrbp1cr9cvlk37; _ga=GA1.2.569907753.1527756113; _gid=GA1.2.1643225409.1527756113; mr1lad=5b0fb551747f7981-0-0-; mc=fa946f68c8647952a5fde4f53e66c0e571e55f3234383632; sdc=o2ApKr6NLDhwZQjg; ; _gat=1; tmr_detect=1%7C1527760462130"
            },
            form: {
                sort_by: 'date_created',
                sort_direction: 'DESC',
                page: 1,
                filters: 'filter%5Bdate%5D=all-time&filter%5Busername%5D=&filter%5Bdatefrom%5D=&filter%5Bdateto%5D='
            },
            url: 'http://www.donationalerts.ru/loaddonations'
        }, (err, res, body) => {
            console.log('loaded');
            if (err) console.log(err);
            let $ = require('cheerio').load(body);
            let list = [];
            $('tr').map((row, el) => {
                if (row != 0) {
                    let arr = [];
                    $(el).find('td').map((i, el2) => {
                        arr[i] = $(el2).text().trim().replace(/\t/g, '').replace(/\n/g, '');
                    });
                    list.push(this.createData(arr));
                }
            });
            console.log(list);
            this.list = list;
            this.save();
        });
    }
}

module.exports = new DonationAlerts();