# Lab 3 - Quota

### Prerequisites
If you completed Lab 0, then you will already have the Edgemicro Product created with a quota configured for 10 requests every minute.  

### 1. cd to the .edgemicro folder

```
cd ~/.edgemicro
```


### 2. Update Edgemicro Config
Open the `org-env-config.yaml` file and make the following changes.

#### a. Add the `- quota` plugin to the sequence section
When you add the spike arrest plugin to the sequence, then Edge Microgateway invokes plugins in the order listed in the sequence section.  In this case the `oauth` plugin will execute first, then `spikearrest` and finally the `quota` plugin will execute.

```
plugins:    
    dir: ../plugins    
    sequence:       
        - oauth
        - spikearrest
        - quota
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
http://localhost:8000/hello -v
```


Send 10 requests within 1 minute and you should see the `403` status code along with the following error message.
```
{"error": "exceeded quota"}
```
