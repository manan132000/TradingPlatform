from kafka import KafkaProducer
import json

producer =KafkaProducer(bootstrap_servers='localhost:9092')

producer.send("buyersTopic",value={
        "orderId":"abab",
        "stockCode":"APL",
        "number":5,
        "maxPrice":65
    })
producer.send("buyersTopic",value={
        "orderId":"bcde",
        "stockCode":"SMS",
        "number":4,
        "maxPrice":45
    })

producer.send("sellersTopic",value={
        "orderId":"poli",
        "stockCode":"APL",
        "number":7,
        "minPrice":60
    })
producer.send("sellersTopic",value={
        "orderId":"sabh",
        "stockCode":"SMS",
        "number":10,
        "minPrice":40
    })