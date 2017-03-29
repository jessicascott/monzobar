'use strict';
const async = require('async');
const client = require('./client');
const token = require('./token');
const moment = require('moment');


module.exports = class Monzo {
  constructor() {
    this.loadBalance();
    this.loadTransactions();
  }

  loadBalance() {
    async.waterfall([
        function getAccountId(done) {
            client.getAccountId(token, done);
        },
        function getBalance(accountId, done) {
            client.getBalance(token, accountId, done);
        }
    ], (err, data) => {
        if (err) {
            return;
        }
        this.setBalance(data);
    });
  }

  setBalance(balance) {
    this.balance = balance;
  }

  loadTransactions() {
      const since = moment().subtract(72, 'hours');

      async.waterfall([
          function getAccountId(done) {
              client.getAccountId(token, done);
          },
          function getBalance(accountId, done) {
              client.getTransactions(token, accountId, since.format(), done);
          }
      ], (err, transactions) => {
          if (err) {
              return;
          }

          this.setTransactions(transactions);
      });
  }

  setTransactions(transactions) {
    this.transactions = transactions;
  }
}