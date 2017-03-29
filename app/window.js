const {ipcRenderer} = require('electron')
const moment = require('moment');
const Header = require('./window/header');
const Transaction = require('./window/transaction');

document.addEventListener('DOMContentLoaded', () => {
  // Tell main.js that the dom has loaded
  ipcRenderer.send('DOMContentLoaded', 'ping')

})

ipcRenderer.on('balance-response', (event, arg) => {
	/* Balance first loads when the app is opened
		 show a notification popup with the balance */
  let n = new Notification('💳 Your balance is ' + arg.balance, {
    body: 'Click to view recent transactions',
    icon: 'monzo.png'
  });
  n.onclick = () => { ipcRenderer.send('show-window') }

  let header = new Header(arg);
})

ipcRenderer.on('transactions-response', (event, arg) => {
	// Sort by most recent
	arg.sort(function (a, b) {
	  return moment(a.created) - moment(b.created);
	});

	arg.map((t) => {
		let h = new Transaction(t);
		h.buildTemplate(h.data);
	});
})



