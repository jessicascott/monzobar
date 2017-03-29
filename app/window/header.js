'use strict';

module.exports = class Header {
	constructor(balance) {
		this.menuTitle = document.getElementById('menu-title');
		this.balance = balance.balance;
		this.spendToday = balance.spendToday;
		this.format();
	}

	format() {
		let spentToday = this.spendToday;
		let balance = this.balance;
		let html =
			`	<h3 class="col-xs-6">${balance} <small>card balance</small></h3>
				<h3 class="col-xs-6 text-right">${spentToday} <small>spent today</small></h3>
			`
		this.menuTitle.innerHTML = html;
	}
}
