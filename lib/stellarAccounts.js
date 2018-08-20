const StellarSdk = require('stellar-sdk');
const pair = StellarSdk.Keypair.random();
const request = require('request');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


console.log('SECRET: ', pair.secret());
console.log('PUBLIC: ', pair.publicKey());

//Founding Account
request.get({
  url: 'https://friendbot.stellar.org',
  qs: { addr: pair.publicKey() },
  json: true
}, function(error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body);
  }
  else {
    console.log('SUCCESS! You have a new account :)\n', body);
  }
});

//Checking for balance
server.loadAccount(pair.publicKey())
    .then((account) => {
        console.log('Balances for account: ' + pair.publicKey());
        account.balances.forEach((balance) => {
            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
        });
    });
