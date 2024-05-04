const express = require('express');
const router = express.Router();
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { createHash } = require('crypto');

const db = new DynamoDBClient({ region: "eu-central-1" });

router.get('/echo', function(req, res, next) {
    res.send(req.query.string);
});

router.post('/getPrice', async function(req, res, next) {
    const command = new GetItemCommand({
        TableName: "online-shop-items",
        Key: {
            "item_id": { S: req.body.itemId }
        }
    });
    const item = await db.send(command);
    const perItemPrice = parseInt(item.Item.per_item_price.N);
    const totalPricePreTax = perItemPrice * req.body.quantity;
    const taxRate = parseFloat(item.Item.tax_rate.N);
    const totalPriceWithTax = totalPricePreTax * (1 + taxRate);

    res.json({
        itemId: req.body.itemId,
        quantity: req.body.quantity,
        perItemPrice: perItemPrice,
        totalPricePreTax: totalPricePreTax,
        taxRate: taxRate,
        totalPriceWithTax: totalPriceWithTax
    });
});

router.post('/compute', function(req, res, next) {
    req.body.sort((a, b) => a - b);

    let hash = Buffer.alloc(0);
    for(const number of req.body) {
        const numberHash = createHash('sha256').update(intToBuffer(number)).digest();
        const newHash = Buffer.concat([hash, numberHash]);
        hash = createHash('sha256').update(newHash).digest();
    }

    res.send(hash.toString('hex'));
});

function intToBuffer(number) {
    let buffer = new Int8Array(1);
    buffer[0] = number;
    return buffer;
}

router.post('/parse', function(req, res, next) {
    const searchString = req.query.searchString;

    for(let i = 0; i < req.body.length; i++) {
        if(searchString === req.body[i]) {
            res.send(i.toString());
            return;
        }
    }
    res.send((-1).toString());
});

router.get('/query', async function (req, res, next) {
    const initialPrimaryKey = req.query.initialPrimaryKey;
    let nextPrimaryKey = initialPrimaryKey;
    counter = 0;
    do {
        const command = new GetItemCommand({
            TableName: "round-trip-table",
            Key: {
                "primary_key": {S: nextPrimaryKey}
            }
        });
        const item = await db.send(command);
        nextPrimaryKey = item.Item.next_primary_key.S;
        counter++;
    } while (nextPrimaryKey !== initialPrimaryKey);
    res.send(counter.toString());
});

module.exports = router;
