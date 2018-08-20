const StellarSdk = require('stellar-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const app = express();
const decimals = require('./helpers/helpers').decimals;

//Initializing Stellar blockchain client
const stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

//Import mock users
const users = require('./users/users.json');

//Express setup
app.use(bodyParser.json());

//Set up Bearer Strategy
passport.use(new Strategy(
    (token, done) => {
        if(users[token]) {
            return done(null, users[token], { scope: 'all' });
        } else {
            return done(null, false);
        }
    }
));

app.get('/account/:id/balance',
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
        const { public: publicKey, secret: secretKey } = req.user;
        const accountId = req.params.id;

        if(publicKey !== accountId) {
            return res.status('404').json({
                status: '404',
                code: 'NOT FOUND',
                message: 'Account not found'
            });
        }

        //Account's balance from the network
        stellarServer.loadAccount(accountId)
            .then((account) => {
                return res.status(200).json({
                    account_id: accountId,
                    balance: account.balances[0].balance
                });
            })
            .catch(e => {
                return res.status('500').json({
                    status: '500',
                    code: 'SERVER ERROR',
                    message: 'Something wrong happen with Stellar Network'
                });
            });
    }
);

app.get('/account/:id/statement',
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
        const { public: publicKey, secret: secretKey } = req.user;
        const accountId = req.params.id;

        if(publicKey !== accountId) {
            return res.status('404').json({
                status: '404',
                code: 'NOT FOUND',
                message: 'Account not found'
            });
        }

        //Account's statement from the network
        stellarServer.loadAccount(accountId)
            .then(account => {
                return account.operations();
            })
            .then(operations => { console.lof
                return res.status(200).json({
                });
            })
            .catch(e => {
                return res.status('500').json({
                    status: '500',
                    code: 'SERVER ERROR',
                    message: 'Something wrong happen with Stellar Network'
                });
            });
    }
);

app.post('/payment',
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
        const { public: publicKeySource, secret: secretKeySource } = req.user;
        const { amount, receiver, source } = req.body;

        if((!amount || typeof amount !== 'string' || typeof parseFloat(amount) !== 'number' || decimals(amount) > 7) || !receiver || !source) {
            return res.status('400').json({
                status: '400',
                code: 'BAD REQUEST',
                message: 'Please verify the input data'
            });
        }

        if(publicKeySource !== source) {
            return res.status('404').json({
                status: '404',
                code: 'NOT FOUND',
                message: 'Source account not found'
            });
        }

        stellarServer.loadAccount(receiver)
            .then(receiverAccount => stellarServer.loadAccount(source))
            .then(sourceAccount => {
                const sourceBalance = parseFloat(sourceAccount.balances[0].balance);
                if(parseFloat(amount) > sourceBalance) {
                    return res.status('400').json({
                        status: '400',
                        code: 'BAD REQUEST',
                        message: 'Insufficient balance'
                    });
                }

                //Building SSC transaction
                const transaction = new StellarSdk.TransactionBuilder(sourceAccount)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receiver,
                        asset: StellarSdk.Asset.native(),
                        amount: amount
                    }))
                    .build();

                //Signing the transaction
                transaction.sign(StellarSdk.Keypair.fromSecret(secretKeySource));

                //Submit the transaction on the network
                return stellarServer.submitTransaction(transaction)
            })
            .then(result => {
                return res.status(200).json({
                    id: result.hash,
                    status: 'approved',
                    amount: amount,
                    fee: '0.00001'
                });
            })
            .catch(e => {
                const { status } = e.response;
                return res.status((status === 404) ? '400' : '500').json({
                    status: (status === 404) ? '400' : '500',
                    code: (status === 404) ? 'BAD REQUEST' : 'SERVER ERROR',
                    message: (status === 404) ? 'Receiver account is invalid' : 'Something wrong happen with Stellar Network'
                });
            });
    }
);

app.get('*', (req, res) => {
    res.status('404').json({
        status: '404',
        code: 'NOT FOUND',
        message: 'Page not found'
    });
});

app.listen(3000, function () {
    console.log('SSC Test App is running on port 3000');
});

