var Config = require('../config.json')[process.env.NODE_ENV];
var Mysql = require('mysql');
var Shedule = require('./shedule')(Config.source);

var SqlPool = null;
SqlPool = Mysql.createPool(Config.db_connection);

function query(sql, data, cb){
    SqlPool.getConnection(function(err, connection) {

        if(err) {
            console.log(err);
            callback(err);
            return;
        }

        connection.config.queryFormat = function queryFormat(query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };

        connection.query(sql, data, function(err, results) {
            connection.release();
            if(err) {
                cb(err);
                return;
            }
            cb(false, results);
        });
    });
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}



Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


function clientExist(telegram_id, cb) {
    query('SELECT * FROM `clients` WHERE `telegram_id`=:telegram_id LIMIT 1', {telegram_id: telegram_id}, function (err, resp) {
        cb(err, resp);
    });
}

function addClient(data, cb) {
    if(!data.username){
        data.username = "";
    }
    query('INSERT INTO clients(telegram_id, first_name, last_name, username, createdAt, updatedAt) VALUES(:telegram_id, :first_name, :last_name, :username, :createdAt, :updatedAt)', {
        telegram_id: data.telegram_id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        updatedAt: Shedule.nowDate().toMysqlFormat(),
        createdAt: Shedule.nowDate().toMysqlFormat()
    }, function (err, resp) {
        cb(err, resp);
    });
}

function updateClient(data, cb) {
    data.updatedAt = Shedule.nowDate().toMysqlFormat();
    if(!data.username){
        data.username = "";
    }
    query('UPDATE clients SET updatedAt = :updatedAt, first_name = :first_name, last_name = :last_name, username = :username WHERE telegram_id = :telegram_id', data, function (err, resp) {
        cb(err, resp);
    });
}

function getAllClients(cb){
    query('SELECT * FROM `clients`', {}, function (err, resp) {
        cb(err, resp);
    });
}

function checkClient(data, cb){
    clientExist(data.telegram_id, function (err, exist) {
        if(err) {
            cb(err);
            return;
        }else if(!exist.length){
            exist = false;
        }

        if(exist){
           updateClient(data, function (err, r) {
               cb(err, r);
           });
        }else{
           addClient(data, function(err, r) {
               cb(err, r);
           });
        }
    });
}

module.exports = {
    add: addClient,
    exist: clientExist,
    check: checkClient,
    getAll: getAllClients
};