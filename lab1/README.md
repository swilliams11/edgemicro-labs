# Lab 1 - Install, configure and start Edge Microgateway

### 1. Install Edge Microgateway
Install the latest version of Edge Microgateway.

```
npm install edgemicro@2.3.1 -g
```

Or

```
npm install edgemicro@latest -g
```

### 2. Initialize Microgateway
Initialize Microgateway with the following command, which creates a `.edgemicro` folder with the `default.yaml` file.

```
edgemicro init
```

### 3. Configure Microgateway

* Creates a public/private key and the private key is stored in the Apigee Vault
* Creates a new Microgateway configuration file named org-env-config.yaml
* Downloads Edge configuration such as products, proxies, developers, quotas, etc. and stores this data in the org-env-cache-config.yaml
* Creates a key and secret that is required to start Microgateway

```
edgemicro configure -o apigee_org -e env -u org_admin -p org_admin_password
```

### 4. Start Microgateway
Copy the key and the secret created by configure command and use it to start Microgateway.

Microgateway starts listening on port 8000 by default.  
```
edgemicro start -o apigee_org -e env -k key -s secret
```

Start Microgateway on a different port with the following command.
```
edgemicro start -o apigee_org -e env -k key -s secret --port 8030
```


### 5. Test it
Send the request below to see the Microgateway respond with a 401 Unauthorized error.  

```
curl http://localhost:8000/edgemicro_lab/hello/ -i
```


#### Obtain a JWT

```
curl -X POST -H "Content-type: application/json" http://org-env.apigee.net/edgemicro-auth/token -d '{"client_id":"client_id","client_secret":"client_secret","grant_type":"client_credentials"}' -v
```

Token Sample

```
{ token: 'qOoFoQ4hFQ' }
```

Send request with the access token.
```
curl -X GET \
-H "Authorization: Bearer qOoFoQ4hFQ" \
http://localhost:8000/edgemicro_lab/hello -v
```
