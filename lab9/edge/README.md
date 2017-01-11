# edgemicro_lab_twoway_tls proxy

The directory `/edgemicro_lab_twoway_tls` contains the required sample API proxy.

# Configure

In order to deploy this proxy, you need to create a developer, an app, and an API product in your organization. The setup script below describes how to complete this.

1. Update `/setup/setenv.sh` with your organization name and email address.

3. Deploy the `edgemicro_lab_twoway_tls` proxy. Run `deploy.sh` from the `./setup` directory.

4. When prompted, enter `edgemicro_lab_twoway_tls`

5. Enter your org admin password when prompted. The script will deploy the proxy to the organization and environment specified in the `setenv.sh` file.

6. The script prompts you to provision the API product, App and developer. Type `yes` to deploy these to your Edge organization and environment.  Follow the command prompts.


---
Copyright © 2014, 2015 Apigee Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy
of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
