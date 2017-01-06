# Lab 6 - Log File
Edge Microgateway generates a log file in the default directory `/var/tmp`.  The purpose of this lab is to review the log file in order to familiarize yourself with the content and format, and also generate multiple log files.

### 1. Confirm Log Level is Set to "info" in the Edge Microgateway Config file
Open the Microgateway config file located in `~/.edgemicro/org-env-config.yaml`

Sample Content Shown below:
```
edgemicro:
  ...
  logging:
    level: info
    dir: /var/tmp
    stats_log_interval: 60
    rotate_interval: 24
  plugins:
    ...
```

If `logging level` is not set to `info`, then change it and save the file.  The Microgateway will auto-reload the configuration file after 5 minutes.

Once the reload is complete, you should see something similar to what is displayed below.
```
Reload completed
onfiguration change detected. Saving new config and Initiating reload
Recieved reload instruction. Proceeding to reload
installed plugin from analytics
installed plugin from oauth
9cf5acc0-d42a-11e6-87e4-35dba59ffa8d edge micro listening on port 8000
installed plugin from analytics
installed plugin from oauth
9cf97d50-d42a-11e6-ab69-e3db2df04809 edge micro listening on port 8000
installed plugin from analytics
installed plugin from oauth
installed plugin from analytics
installed plugin from oauth
9cfdc310-d42a-11e6-94d7-c5f886d3a4a7 edge micro listening on port 8000
9cfe3840-d42a-11e6-887e-f50d583642ba edge micro listening on port 8000
Reload completed
```

You could also manually restart the Microgateway to load the configuration changes as well. (i.e `Ctrl+C` then `edgemicro start ...`)


### 2. Send Requests to Microgateway
Generate a couple of different requests:
* valid requests
* 401 Unauthorized - requests without an Authorization header
* 403 Forbidden - use a valid Authorization header or API validation with an invalid resource path
  * (i.e. `/edgemicro_lab/hello2` should generate 403)
* 404 Not Found - (i.e. `/helloworld`)


#### Access Token Request
```
curl -X POST -H "Content-type: application/json" http://org-env.apigee.net/edgemicro-auth/token -d '{"client_id":"client_id","client_secret":"client_secret","grant_type":"client_credentials"}' -v
```

#### Valid request
```
curl -i -H "Authorization: token " http://localhost:8000/edgemicro_lab/hello
```


### 3. Review the Log File
Review the log file to see the entries that were generated.  
The details of the log file content can be found [here](http://docs.apigee.com/microgateway/latest/operation-and-configuration-reference-edge-microgateway#managinglogfiles-logfilenamingconvention).
