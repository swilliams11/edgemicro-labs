# Lab 0 - Setup Edge Microgateway aware proxy

### 1. Setup Edge Microgateway aware proxy

Navigate to the `edge/setup` directory and follow the instructions there to create an Edge Microgateway aware proxy and create an API product, developer and Developer App.

### 2. Start the Node.js target server
The Node.js target server listens on port 8090.
* install the target server dependencies with `npm install`
* start the Node.js target server with `node index.js`

```
cd edgemicro_target
npm install
node index.js
```

#### Stop Node.js
```
ctrl + c
```
#### Test It
Send a sample request to the target server with the following command.

```
curl -i http://localhost:8090/hello
```

Response:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 22
ETag: W/"16-rddAO5XEFkUJEQserCga5g"
Date: Thu, 22 Dec 2016 17:43:01 GMT
Connection: keep-alive

{
  "hello": "world"
}
```
