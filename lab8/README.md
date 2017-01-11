# Lab 8 - Northbound TLS configuration
Microgateway can be configured to accept TLS connections from clients. Update the Microgateway config file with the public/private key and include the other [mandatory values] (http://docs.apigee.com/microgateway/latest/operation-and-configuration-reference-edge-microgateway#configuringsslontheedgemicrogatewayserver), then restart the Microgateway.  This lab walks you through setting up TLS for Microgateway Northbound traffic.

### 0. Make sure OpenSSL is installed
(OpenSSL)[https://www.openssl.org/]

### 1. Create a self-signed public certificate and a private key
You can skip this step.  The private and public key are already created in the `keys` directory.
Open a terminal and enter the following command:

```
openssl req -new -x509 -sha256 -newkey rsa:2048 -nodes \
    -keyout private.pem -days 9999 -out mycert.cert
```

You will be prompted for the following:
* Country code
* State
* Locality
* Organization
* Organizational unit
* Common Name (FQDN) -> apigee1609.net
* email address


### 2. Update the Microgateway config file
Open the Microgateway config file located in `~/.edgemicro/org-env-config.yaml`

Add the `ssl` section as shown below.
```
edgemicro:
...
  ssl:
    key: <absolute path to the SSL key file>/private.pem
    cert: <absolute path to the SSL key file>/mycert.cert
    #passphrase: password #option added in v2.2.2
    rejectUnauthorized: true #option added in v2.2.2
```

### 3. Restart Microgateway
Manually restart the Microgateway to load the configuration changes. (i.e `Ctrl + C` then `edgemicro start ...`)


### 4. Send Requests to Microgateway
Generate a couple of different requests.

#### Access Token Request
```
curl -X POST -H "Content-type: application/json" http://org-env.apigee.net/edgemicro-auth/token -d '{"client_id":"client_id","client_secret":"client_secret","grant_type":"client_credentials"}' -v
```

#### Valid request
The `-k` turns off curl's certificate validation.  We have to turn this off because we are using a self-signed certificate.  

```
curl -i -H "Authorization: token " https://localhost:8000/edgemicro_lab/hello -i -k
```
