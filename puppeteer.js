const express = require("express")
const puppeteer = require("puppeteer")

const app = express()
const port = 3000

async function getData(p) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.shop-apotheke.com/homoeopathisch-hautpflege/?pageNumber=${p}`);

    const data = await page.evaluate(() => {
        let arr = []
        for (let i = 1; i<33;i++) {
            let x = document.querySelector(`ul.o-Hits > li:nth-child(${i}) `)
            if(x.innerText !== ""){
                let title = document.querySelector(`li:nth-child(${i}) > .l-flex > .o-FilteredProductListItem__content > .l-flex--stretch-children > div:nth-child(1) > .u-margin--bottom:nth-child(1)`).innerText
                let price = document.querySelector(`li:nth-child(${i}) > .l-flex > .o-FilteredProductListItem__content > .l-flex--stretch-children > div:nth-child(2) > .u-margin--bottom:nth-child(1) > .o-ProductPriceInfo > .u-margin-small--bottom > .u-display--inline-block > .o-ProductPrice > div:nth-child(3)`).innerText
                let pzn = document.querySelector(`li:nth-child(${i}) > .l-flex > .o-FilteredProductListItem__content > .l-flex--stretch-children > div:nth-child(1) > div:nth-child(4) > .o-ProductPackageDetails > div:nth-child(2)`).innerText
                let image = document.querySelector(`li:nth-child(${i}) > .l-flex > .o-FilteredProductListItem__image > .a-Button > .o-ProductImage > .m-ImageWithDiscountBadge > picture > img`).src
                arr.push({title,price,pzn, image})
            }
        }
        return arr
    });

    await browser.close();

    return {data};
}

app.get('/', (req, res) => {
    let page = "1"
    let data = getData(page)
    data.then(function(result) {
        console.log(result)
        res.json(result)
    }).catch(function (err){
        console.log(err)
    })
})

app.get('/:p', (req, res) => {
    let page = req.params.p
    let data = getData(page)
    data.then(function(result) {
        console.log(result)
        res.json(result)
    })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
