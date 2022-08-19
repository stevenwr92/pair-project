function convertPrice(price) {
    price = price.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(price))
        price = price.replace(pattern, "$1,$2");
    return `Rp. ${price}`;
}

// console.log(convertPrice(1000))

module.exports=convertPrice