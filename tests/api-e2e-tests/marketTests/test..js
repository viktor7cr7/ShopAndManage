

const products = [
    {
        name: 'arbuz',
        price: 2000
    }, {
        name: 'dynaya',
        price: 4000
    }, {
        name: 'bananas',
        price: 6000
    }
]

const toMatchProducts = products.every((product, index) => {
    if (index + 1 === products.length) return true
    console.log(index)
 return product.price >= products[index + 1].price
})

console.log(toMatchProducts)


