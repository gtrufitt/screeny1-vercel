const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

    
    const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;
    
    
    
    if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Page URL not defined' })
    }
    
    const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 200;
      window.scrollTo(0, 0);
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
};
    
      const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
      const page = await browser.newPage();
      await page.setViewport({width: 1900, height: 3500});
      const start = Date.now();
      await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });
      console.log('Took', Date.now() - start, 'ms');
      await autoScroll(page, "Page 2:");
      const screenshot = await page.screenshot({ encoding: 'base64' });
     
      await browser.close();
    
  
    return {
        statusCode: 200,
         body: JSON.stringify({ 
                message: `Complete screenshot of ${pageToScreenshot}!`, 
                data: screenshot 
            }),
        headers: {
        'Content-Type': 'image/png',
    }
    }


}