const puppy = require('puppeteer')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())


app.get("/", async (req, res) => {
    try{
        console.log("recived a request")
        const value = await scraper()
        return res.send(value)
    }
    catch(error){
        return res.send("some error occured")
    }
})

app.listen(4000, () => {
    console.log('server started')
})


const scraper = async() => {
    const browser = await puppy.launch({
        headless: false
    })

    const page = await browser.newPage()
    await page.goto("http://results.uoc.ac.in/")

    const element = await page.$$eval('.odd, .even', elements => {
        const result = []
        for(const ele of elements){
            const childTd = ele.querySelectorAll('td')
            try{
                result.push({"title": childTd[0].textContent, "Publish_data": childTd[1].textContent})
            }
            catch(error){
                console.log(error)
                continue
            }
        }

        return result
    })

    await browser.close()

    return element
}
