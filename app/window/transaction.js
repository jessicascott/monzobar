'use strict';
const _ = require('lodash');
const moment = require('moment');

module.exports = class Transaction {
	constructor(transaction) {
		this.container = document.getElementById('container');
		this.transactionsTitle = document.getElementById('menu-title');
		this.truncateLength = 18;
		this.format(transaction);
	}

	format(t) {
    const amount = (Math.sqrt(t.amount * t.amount) / 100).toFixed(2);
    const description = _.get(t, 'merchant.name', t.description);
    const name = t.merchant ?  t.merchant.name : t.description;

		const data = {
			amount: `${t.amount > 0 ? '+' : ''}£${amount}`,
			description: `${this.truncate(name)}`,
			time: moment(t.created).fromNow(),
			logo: t.merchant ? t.merchant.logo : null,
			emoji: _.get(t, 'merchant.emoji') || '💳'
		}

		this.data = data;
	}

	truncate(string){
		let length = this.truncateLength;
		return string.length > length ? string.substring(0,length)+'...' : string;
	};

	buildTemplate(data) {
		let transaction = document.createElement('transaction');
		let html = 
    	`<div class="row">
    		<div class="col-xs-8 description">
    			<div class="icon">
    				<img
    					src="${data.logo ? data.logo : 'monzo.png'}" 
    					width="20"
    					class="${data.logo ? 'img-responsive' : 'hidden'}"
    				/>
    				<p class="${!data.logo ? '' : 'hidden'}">${data.emoji}</p>
    			</div>
    			<p>${data.description} <span class="text-muted">${data.time}</span></p>
    		</div>
    		<div class="col-xs-4 text-right">
    			<p>${data.amount}</p>
    		</div>
    	</div>`
		transaction.innerHTML = html;
		this.container.insertBefore(transaction, this.transactionsTitle.nextSibling);	
	}
}