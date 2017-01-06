# Lab 7 - Debugging
In lab 5 you created a custom plugin.  In this lab you will add some debugging statements to that plugin so that they are printed to the console when you include the `DEBUG=plugin:response-override` statement when you start Microgateway.

### 1. Update the response-override plugin
Copy the plugin (`response-override`) folder from this repository to the Microgateway plugins directory on your local machine.
i.e. `/usr/local/lib/node_modules/edgemicro/plugins`

The `response-override` folder is located in the `lab7` folder.

Note: that the `package.json` file was also updated, so you should replace both the `index.js` and the `package.json` files.  

### 2. Restart the Microgateway
Stop the Microgateway with `Ctrl + c`

Start the Microgateway with the following command.

```
DEBUG=plugin:response-override edgemicro start -o apigee_org -e env -k key -s secret
```

The `DEBUG=plugin:response-override` tells Node.js that it should only capture `debug` statements for this plugin.  


### 3. Send Requests to Microgateway
Generate a couple of different requests:
* valid requests

#### Access Token Request
```
curl -X POST -H "Content-type: application/json" http://org-env.apigee.net/edgemicro-auth/token -d '{"client_id":"client_id","client_secret":"client_secret","grant_type":"client_credentials"}' -v
```

#### Valid request
```
curl -i -H "Authorization: token " http://localhost:8000/edgemicro_lab/hello
```

### 4. Review the debugging statements on the console
Review the debugging statements on the console, which should look similar to the ones below.

```
plugin:response-override response-override plugin onrequest +0ms
plugin:response-override response-override plugin onend_request +10ms
plugin:response-override response-override ***** plugin ondata_response +10ms
plugin:response-override response-override **** plugin onend_response +1ms
plugin:response-override response-override plugin onrequest +0ms
plugin:response-override response-override plugin ondata_request 15 +8ms
plugin:response-override response-override plugin ondata_request transformed data: {"TEST":"TEST"} +1ms
plugin:response-override response-override plugin onend_request +2ms
plugin:response-override response-override ***** plugin ondata_response +10ms
plugin:response-override response-override **** plugin onend_response +0ms
```
