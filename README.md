# SSCPayments
Basic backend application for paymentes using Stellar Smart Contracts (SSC)

#### Current version 1.0.0

---

## Requeriments

* Node 6.10.1

---

## Installation & Run

1) Clone or download this repo
```
git clone https://github.com/pedropablorj/SSCPayments
```

2) Install project dependencies
```
npm install
```

3) Run application
```
npm start
```

---

## Account setup and stellar network

### Create and founding Stellar account on testnet
```
node /lib/stellarAccounts.js
```

### Stellar account setup
This application is for testing pourpose so it only run for testnet network, the application has two accounts set up so add or remove account add them on users/users.json file using the folowing format:
```
{
    "<token_hash>": {
        "secret": "<stellar_account_secret>"
        "public": "<stellar_account_public>"
    }
}
```

---

## Postman collection

Use SSCPayments.postman_collection.json file.

---

## Response Codes

+ **200** -- The request has seccede with data response.
+ **400** -- The server couldn't made the request because the input or is bad genereted.
+ **401** -- Unauthorize.
+ **404** -- The server has not found anything for an specific resquest.
+ **500** -- Unexpected error in the server.

---

## Endpoints

### GET
* [GET /account/:id/balance](#balance)
* [GET /account/:id/statement](#statement)

### POST
* [GET /payment](#payment)

---

<a name="blance"></a>

### GET /account/:id/balance

Param   | Type  | In    | Required  | Description
---     | ---   | ---   | ---       | ---
token   | String| Header| True      | Bearer token on headers
id      | String| URI   | True      | Stellar Account id/publicKey

***Sample response***

Return code: 200

```
{
    "account_id": "GAH43CGAJROIY2LOFL3DK7V6JA5BII6Z5OSHY4FL7EHPCLGIEZHRBSDB",
    "balance": "9929.9999600"
}
```

---

<a name="statement"></a>

### GET /account/:id/statement

Param   | Type  | In    | Required  | Description
---     | ---   | ---   | ---       | ---
token   | String| Header| True      | Bearer token on headers
id      | String| URI   | True      | Stellar Account id/publicKey

***Sample response***

Return code: 200

```
[
    {
        "id": "bc756d90ed10d9ac1ccb15894fb23860e7c437b90ab6fd4a884cc8acf9b84382",
        "type": "create_account",
        "amount": "10000.0000000",
        "fee": "0.0000000",
        "from": "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
        "to": "GAH43CGAJROIY2LOFL3DK7V6JA5BII6Z5OSHY4FL7EHPCLGIEZHRBSDB",
        "created_at": "2018-08-18T23:31:45Z"
    },
    {
        "id": "00b59c1c8889f3eac2be5e7df9799496f71c1db774dd4aae05dd1a7e4e2e46eb",
        "type": "payment",
        "amount": "-10.0000000",
        "fee": "0.0000100",
        "from": "GAH43CGAJROIY2LOFL3DK7V6JA5BII6Z5OSHY4FL7EHPCLGIEZHRBSDB",
        "to": "GBEKG4NP4IPPGASINEJQ3WEUFCRXHVAYUFPYMBUGSCHSO5HDFKCEU5GP",
        "created_at": "2018-08-20T16:54:49Z"
    }
]
```

---

<a name="payment"></a>

### GET /payment

Param   | Type  | In    | Required  | Description
---     | ---   | ---   | ---       | ---
token   | String| Header| True      | Bearer token on headers
source  | String| Body  | True      | Sender Stellar Account id/publicKey
Receiver| String| Body  | True      | Receiver Stellar Account id/publicKey
Amount  | String| Body  | True      | Payment amount no more than 7 decimals

***Sampre body request***

```
{
    "source": "GAH43CGAJROIY2LOFL3DK7V6JA5BII6Z5OSHY4FL7EHPCLGIEZHRBSDB",
    "receiver": "GBEKG4NP4IPPGASINEJQ3WEUFCRXHVAYUFPYMBUGSCHSO5HDFKCEU5GP",
    "amount": "10"
}
```

***Sample response***

Return code: 200

```
{
    "id": "2d38ad1f6cc7df560476b77e881d3c68c761c7786b7d5fcef4dd391c69308950",
    "status": "approved",
    "amount": "10",
    "fee": "0.00001"
}
```

---

## What's next?

- Data Base implementation.
- Encrypeted storage stellar accounts information on db.
- Queries by transactions
- Authentication using JWT
- And more...


