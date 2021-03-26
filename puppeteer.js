const express = require("express")
const puppeteer = require("puppeteer")

const app = express()
const port = 3000

async function getData(p) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.shop-apotheke.com/homoeopathisch-hautpflege/?pageNumber=${p}`);

    const title = await page.evaluate(() => {
        return document.querySelector(".u-margin--bottom:nth-child(1)").innerText;
    });

    const price = await page.evaluate(() => {
        return document.querySelector(".o-ProductPrice:last-child > .u-display--inline-block:last-child").innerText;
    });

    const pzn = await page.evaluate(() => {
        return document.querySelector(".o-ProductPackageDetails > div:nth-child(2)").innerText;
    });

    const img = await page.evaluate(() => {
        return document.querySelector(".o-ProductImage > .m-ImageWithDiscountBadge > picture > img").src;
    });

    await browser.close();

   return {title, price, pzn, img};
}

app.get('/', (req, res) => {
    let page = "1"
    let data = getData(page)
    data.then(function(result) {
        console.log(result)
        res.json(result)
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
