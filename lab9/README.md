# Lab 9 - Southbound Two-Way-TLS - IN PROGRESS
For the target servers that require higher level of security, Microgateway can be configured with Two-Way-TLS.  This lab describes how to configure it.  Full Two-Way-TLS configuration is located [here](http://docs.apigee.com/microgateway/latest/operation-and-configuration-reference-edge-microgateway#usingclientssltlsoptions)


### 0. Make sure OpenSSL is installed
(OpenSSL)[https://www.openssl.org/]


## Setup Certificate of Authority and all of the certificates
Skip this section.  All the certificates have already be created.  
Go to [Lab 9 start](#lab-9---start-here)
Source: https://jamielinux.com/docs/openssl-certificate-authority/introduction.html

### 1. Create a certificate of authority to sign certificates
You don't have to perform these steps; I already completed them and the certificates are stored in the `keys/ca/server` and  `keys/ca/client` folders.

#### a. create the root private key
```
cd lab9/ca
mkdir certs crl newcerts private
chmod 700 private
touch index.txt
echo 1000 > serial
openssl genrsa -aes256 -out private/ca-key.pem 2048
chmod 400 private/ca-key.pem
```

#### b. create the root certificate
```
openssl req -config ca.cnf \
      -key private/ca-key.pem \
      -new -x509 -days 9999 -sha256 -extensions v3_ca \
      -out certs/ca-cert.pem
chmod 444 certs/ca-cert.pem
```

#### c. verify the root certificate
```
openssl x509 -noout -text -in certs/ca-cert.pem
```

---

#### a. create the CA all in one go
```
cd lab9/ca
openssl req -new -x509 -days 9999 -config ca_local.cnf -keyout private/ca-key.pem -out ca-crt.pem
```

### 2. Create the certificate chain
The certificate change includes the root certificate and it would also include any intermediate certificates.

```
cd lab9/ca
mkdir intermediate/certs
cat certs/ca-cert.pem > intermediate/certs/ca-chain-cert.pem
chmod 444 intermediate/certs/ca-chain-cert.pem
```

### 3. Create a self-signed public certificate and a private key for the Node.js targetserver
I already created the private key and public certificate and saved them in the `keys/server` folder.

* generate the key
```
cd lab9/keys
openssl genrsa -aes256 -out server/server-key.pem 2048
chmod 400 server/server-key.pem
```

* generate the CSR
```
openssl req -config server/server.cnf \
     -key server/server-key.pem \
     -new -sha256 -out server/server-csr.pem
```

* sign the CSR and encrypt it
```
openssl ca -config ca.cnf -extensions server_cert -days 999 -passin "pass:password" \
-md sha256 -in server/server-csr.pem \
-out server/server-crt.pem
```

OR

* sign the CSR and do not encrypt it
```
openssl ca -config ca.cnf -extensions server_cert -days 999 -passin "pass:password" \
-in server/server-csr.pem \
-out server/server-crt.pem
```

### 4. Create the client certificate for Microgateway Southbound traffic
The Microgateway client will use this certificate to present to the Node.js server.  
---
* generate the key and encrypt with aes256
```
cd lab9/keys
openssl genrsa -aes256 -out client/client-key.pem 2048
chmod 400 client/client-key.pem
```

passphrase -> `password`

OR

* generate the key without encryption - USE THIS option
```
cd lab9/keys
openssl genrsa -out client/client-key.pem 2048
chmod 400 client/client-key.pem
```
---

* generate the CSR
```
openssl req -config client/client.cnf \
     -key client/client-key.pem \
     -new -out client/client-csr.pem
```

---
* sign the CSR with a message digest - use this option
```
openssl ca -config ca.cnf -extensions usr_cert -days 999 -passin "pass:test" \
-md sha256 \
-in client/client-csr.pem \
-out client/client-crt.pem
```

OR

* sign the CSR and exclude message digest
```
openssl ca -config ca.cnf -extensions usr_cert -days 999 -passin "pass:test" \
-in client/client-csr.pem \
-out client/client-crt.pem
```
---

### 5. Convert to pfx
```
cd lab9/keys/client
openssl pkcs12 -export -in client-crt.pem -inkey client-key.pem -out client-crt.pfx
```
Enter `password` when prompted.
Export password is `password`.


#### Check the certificate
```
openssl pkcs12 -info -in client-crt.pfx
```
OR
```
cd lab9
openssl pkcs12 -info -in keys/client/client-crt.pfx
```

## LAB 9 - START HERE
Start here for Lab 9.

### 1. Update the Microgateway config file
Open the Microgateway config file located in `~/.edgemicro/org-env-config.yaml`

Add the `targets` section as shown below.
```
targets:
   - tls:
       client:
         pfx: <path to certificate>/client-cert.pfx
         passphrase:
         rejectUnauthorized: true
```

### 2. Restart Microgateway
Manually restart the Microgateway to load the configuration changes. (i.e `Ctrl + C` then `edgemicro start ...`)



### 3. Start the target server
```
cd lab9/edgemicro_target_tls
node index.js
```

### 4. Send requests to target server

#### Denied (no cert)
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


#### Approved (using CA signed cert)
* Change to the following directory.
```
edgemicro-labs/lab9
```

* Execute the following command.
This will ignore certificate chain errors. Unfortunately, I need the `-k`;

```
curl -v -s --cert keys/client/client-crt.pfx:password --key keys/client/client-key.pem "https://localhost:9443/hello-two" -k
```


#### Response
```
*   Trying ::1...
* Connected to localhost (::1) port 9443 (#0)
* WARNING: SSL: CURLOPT_SSLKEY is ignored by Secure Transport. The private key must be in the Keychain.
* WARNING: SSL: Certificate type not set, assuming PKCS#12 format.
* Client certificate: localhost
* TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* Server certificate: localhost
* Server certificate: ca
> GET /hello-two HTTP/1.1
> Host: localhost:9443
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json
< Date: Wed, 11 Jan 2017 23:35:08 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Connection #0 to host localhost left intact
{"status":"approved"}
```

### 5. Send Requests to Microgateway


#### Access Token Request
```
curl -X POST -H "Content-type: application/json" http://org-env.apigee.net/edgemicro-auth/token -d '{"client_id":"client_id","client_secret":"client_secret","grant_type":"client_credentials"}' -v
```

#### Valid request
The `-k` turns off curl's certificate validation.  We have to turn this off because we are using a self-signed certificate.  

```
curl -i -H "Authorization: token " https://localhost:8000/edgemicro_lab/hello-two -i -k
```


## TODO
When I issue this command I get the following error.  Troubleshoot why.

```
curl -v -s --cert keys/client/client-crt.pfx:password --key keys/client/client-key.pem "https://localhost:9443/hello-two"
```

```
Connected to localhost (::1) port 9443 (#0)
* WARNING: SSL: CURLOPT_SSLKEY is ignored by Secure Transport. The private key must be in the Keychain.
* WARNING: SSL: Certificate type not set, assuming PKCS#12 format.
* Client certificate: localhost
* SSL certificate problem: Invalid certificate chain
* Closing connection 0

```
