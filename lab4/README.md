# Lab 4 - Analytics
The [analytics plugin](https://www.npmjs.com/package/volos-analytics-apigee) is automatically added to the plugin execution sequence and it does not need to appear in the plugin sequence.  The buffer size and buffer flush interval can be modified.


### 1. cd to the .edgemicro folder

```
cd ~/.edgemicro
```


### 2. Update Edgemicro Config
Open the `org-env-config.yaml` file and make the following changes.



#### a. Add the `analytics:` section
* bufferSize - maximum number of records the buffer can hold before it starts to drop requests
* batchSize - maximum number of records sent to Edge Analytics
* flushInterval -  Number of ms between each flush of a batch of records to Edge.

```
analytics:
     bufferSize: 5
     batchSize: 5
     flushInterval: 10000
```

### 3. Reload the Microgateway
You can reload the Microgateway or wait for the auto-reload.  The default config reload time is 600 seconds (10 minutes).

```
edgemicro reload -o apigee_org -e env -k key -s secret
```

### 4. Test it

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

In about 15 minutes you should be able to see the analytics data flowing through Microgateway in the Edge UI.  

![Edge UI Analytics](/screenshots/analytics.png?raw=true "Edge UI Analytics")
