const fs = require('fs')
const server = require('http').createServer()

server.on('request', (req, res) => {
  /* NOTE: Solution 1
  Has to load entire file into memory;
  Can only send resources when ready, and will run out of resources */
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err)
  //   res.end(data)
  // })

  // NOTE: Solution 2: Streams
  // const readable = fs.createReadStream('test-file.txt')
  // readable.on('data', (chunk) => {
  //   res.write(chunk)
  // })
  // readable.on('end', () => {
  //   res.end()
  // })
  // readable.on('error', (err) => {
  //   console.log(err)
  //   res.statusCode = 500
  //   res.end('File not found!')
  // })

  // NOTE: Solution 3
  const readable = fs.createReadStream('test-file.txt')
  readable.pipe(res)
  // readableSource.pipe(writeableDest)
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...')
})
