# Lab 5 - Custom Plugin
[Custom plugins](http://docs.apigee.com/microgateway/latest/develop-custom-plugins) allow
you extend Edge Microgateway with additional logic and features.

This lab will walk you through writing a simple plugin that overrides the response
with "Hello World from custom plugin!".  

### 1. Stop Edge Microgateway

```
edgemicro stop
```

### 2. Change your directory to the custom plugin directory
```
cd [prefix]/npm/lib/node_modules/edgemicro/plugins
```

Where [prefix] is `npm config get prefix`

### 3. Create a new plugin project
```
mkdir response-override && cd response-override
```

### 4. Create a new Node.js project
```
npm init
```

### 5. Create a new file named index.js and open it in a text editor
```
touch index.js
```

### 6. Copy the following code into index.js
```javascript
'use strict';
var debug = require('debug')

module.exports.init = function(config, logger, stats) {

  return {

    ondata_response: function(req, res, data, next) {
      debug('***** plugin ondata_response');
      next(null, null);
    },

    onend_response: function(req, res, data, next) {
      debug('***** plugin onend_response');
      next(null, "Hello, World from custom plugin!\n\n");
    }
  };
}
```

### 7. Add the plugin to the org-env-config.yaml file
```
  plugins:
       dir: ../plugins
       sequence:
         - oauth
         - response-override
```

### 8. Restart Edge Microgateway
```
edgemicro start -o apigee_org -e env -k key -s secret
```

### 9. Test the request
```curl
curl -H 'x-api-key: apikey' http://localhost:8000/edgemicro_lab/hello
Hello, World from custom plugin!
```
