const fs = require('fs');
const http = require('http');
const url = require('url');
// __dirname returns location of file
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);


 
const server = http.createServer((req, res) => {
  // https://myurl.com/pathName
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;
  // Homepage
  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });
      
    // load html file 
    fs.readFile(`${__dirname}/data/templates/template-overview.html`, 'utf-8', (err, data) => {
        let overViewOutput = data;
        // Load another html file
        fs.readFile(`${__dirname}/data/templates/template-card.html`, 'utf-8', (err, data) => {
            
        // Create array of html of each product cards and join them
        // Replace placeholders of overViewoutput with data from each iteration through laptopData
        const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
            
        
        overViewOutput = overViewOutput.replace("{%CARD%}", cardsOutput);
        res.end(overViewOutput);
  
  });
  
  })} 
    // Product page
    else if (pathName === '/laptop' && id < laptopData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    
    fs.readFile(`${__dirname}/data/templates/template-laptop.html`, 'utf-8', (err, data) => {
      const laptop = laptopData[id];
      const output = replaceTemplate(data, laptop);
      res.end(output);
  
    });
  } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
      fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
          res.writeHead(200, { 'Content-type': 'image/jpg' });
          res.end(data);
          
          
          
          
      })
      
      
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('URL was not found on the server');
  }
 
 
});
 
server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for requests now');
});

function replaceTemplate (html, laptop) {
      let output = html.replace(/{%PRODUCTNAME%}/g, laptop.productName);
      output = output.replace(/{%IMAGE%}/g, laptop.image);
      output = output.replace(/{%PRICE%}/g, laptop.price);
      output = output.replace(/{%SCREEN%}/g, laptop.screen);
      output = output.replace(/{%CPU%}/g, laptop.cpu);
      output = output.replace(/{%STORAGE%}/g, laptop.storage);
      output = output.replace(/{%RAM%}/g, laptop.ram);
      output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
      output = output.replace(/{%ID%}/g, laptop.id)
    return output;
};