const fs = require('node:fs');

//////////////////////////
//FILE
// Synchronous Code: Blocking code execution
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${new Date(
//     Date.now()
// )}`;
// fs.writeFileSync("./txt/output.txt", textOut, "utf-8");
// console.log("File written");

// Non-blocking code execution
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`,"utf-8", (err, data2) => {
    console.log("data2",data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log("data3",data3);
      fs.writeFile("./txt/final.txt",`${data2}\n${data3}` ,"utf-8",err=>{
        console.log("File has been written 💪")
      })
    });
  });
});
console.log("Reading file...");
