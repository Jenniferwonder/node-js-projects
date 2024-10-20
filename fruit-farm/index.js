const fs = require('node:fs');
const http = require('node:http');
const url = require('node:url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // transform data string into object

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data); // send back the response
  }

  // Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html', // HTTP Header
      'my-own-header': 'hello world',
    });
    res.end('Page not found!');
  }
});

server.listen(8000, '127.0.0.1', () =>
  console.log('Listening to requests on port 8000')
);
