# edgemicro target Two-Way-TLS
This is a Node.js server that listens on port 9443.  

### Start the server
```
node index.js
```


### Denied (no cert)
```
curl -v -s -k https://localhost:9443/hello-two
```

#### Response

```
HTTP/1.1 401 Unauthorized
< X-Powered-By: Express
< Content-Type: application/json
< Date: Tue, 10 Jan 2017 22:29:28 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"status":"invalid certificate presented - access denied"}
```


### Approved (using CA signed cert)
1. Change to the following directory.
```
edgemicro-labs/lab9
```

2. Execute the following command.
```
curl -v -s -k --key keys/client_private.pem --cert keys/client_cert.cert https://localhost:9443/hello-two
```
