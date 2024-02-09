# jott.js

JavaScript library of `jott`, the immutable transaction ledger.

This is a small library I wrote to help my team at Merlin access a transactional ledger more easily without worrying about the underlying implementation.

For example, instead of connecting to a persistence layer or managing models, the developers can focus on the core capabilities and UI, and instead interact with the ledger as follows:

```javascript
const ledger = jott.ledger('LEDGER_ID');
const account = await ledger.account('ACCOUNT_ID');
let deposit = await account.deposit(145.00);
```

Or,

```javascript
jott.retrieveAll()
    .fromCollection('transactions')
    .where('amount')
    .isLessThan(5000.00)
    .and('status')
    .is('active')
```

The ledger itself uses PostgreSQL but any driver can be implemented instead.

## Requirements

- NodeJS v16.17.1+
- PostgreSQL v15.1+
