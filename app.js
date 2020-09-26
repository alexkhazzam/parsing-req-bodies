const http = require("http");
const fs = require("fs");
const { parse } = require("path");

const app = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    res.setHeader("Content-type", "text/html");
    res.write(
      "<form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form>"
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString().split("=")[1];
      fs.writeFile("message.txt", parsedBody, (err) => {
        if (err) {
          throw err;
        }
        res.setHeader("Content-type", "text/html");
        if (parsedBody === "alex") {
          res.write("<h1>You Have Access!</h1>");
          return res.end();
        } else {
          res.write("<h1>You Do Not Have Access.</h1>");
          res.end();
        }
      });
    });
  }
});

app.listen(3000);
