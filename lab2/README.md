# Lab 2 - Include the Spike Arrest plugin

### 1. cd to the .edgemicro folder

```
cd ~/.edgemicro
```


### 2. Update Edgemicro Config
Open the `org-env-config.yaml` file and make the following changes.

#### a. Add the `- spikearrest` plugin to the sequence section
When you add the spike arrest plugin to the sequence, then Edge Microgateway invokes plugins in the order listed in the sequence section.  In this case the `oauth` plugin will execute first, then the `spikearrest` plugin will execute.


#### b. Add the `spikearrest:` section
Configure the spike arrest plugin as shown below.  
* 30 requests per minute with a buffer size of 0.

The per minute interval is converted to a per second interval.

60sec/30rpm = 2 second interval

Hence, Edgemicro will only allow 1 request every 2 seconds.  

```
plugins:    
    dir: ../plugins    
    sequence:       
        - oauth
        - spikearrest
spikearrest:
  timeUnit: minute
  allow: 30
  bufferSize: 0
```

### 3. Reload the Microgateway

```
edgemicro reload -o apigee_org -e env -k key -s secret
```

### 4. Test it
Send the request below to see the Microgateway respond with a 401 Unauthorized error.  

```
curl http://localhost:8000/hello/ -i
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
http://localhost:8000/hello -v
```


Send two requests or more within 2 seconds and you should see the `503` status code along with the following error message.
```
{"error": "spike arrest policy violated"}
```
