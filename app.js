const express = require('express')
const https = require('https')
const app = express()
const port = 3500

app.get('/api/getTimeStories', async (req, res) => {
    try{
        const url = 'https://time.com';
        https.get(url, (response) => {
            let data = '';
            response.on('data',(chunk) => {
                data +=  chunk;
            });
            response.on('end', () => {
                const latestAllStories = parseHTML(data);
                const latestStories = latestAllStories.slice(0, 6);

                res.write("[\n");
                latestStories.forEach((story) => {
                    res.write(JSON.stringify(story, null, 2) + '\n');
                });
                res.write("]");

                res.end();
            });
        });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
});

function parseHTML(html){
    const latestStories = [];
    const regex = /<li class="latest-stories__item">\s*<a href="([^"]+)">\s*<h3 class="latest-stories__item-headline">([^<]+)<\/h3>/g;
    let match;
    while((match = regex.exec(html)) !== null){
            console.log("In if");
            latestStories.push({
                title: match[2],
                link: match[1],
            });
    }
    return latestStories;
}

app.listen(port, () => {
    console.log("Server is running on port "+port);
} )