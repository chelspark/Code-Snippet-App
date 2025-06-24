### Code Snippet App
# Deployment Instructions

## Introduction
The Code Snippet App is currently live on [comp3120.lukeglover.dev](https://comp3120.lukeglover.dev/). The deployment is on Google Cloud Platform (GCP) Compute Engine (equivalent to AWS EC2), which provides a virtual machine in the cloud. These instructions are specific for GCP, but could be replicated on any cloud host or local server. This guide assumes you have a virtual machine with a Debian based Linux OS setup already, and you have SSH access to the machine. In addition, you need either the root login, or your user accounts needs `sudo` permissions.

## Installing Dependencies
Install dependencies using the package manager:
```
sudo apt update
sudo apt install git nodejs npm nginx
```

## Clone Code Snippet App
```
git clone https://github.com/MQCOMP3120-2024/group-project-gwdp-monday-5pm-pls-no.git
cd group-project-gwdp-monday-5pm-pls-no
```

## Install NodeJS Dependencies
```
npm install
```

## Build Frontend
Modify the env.js config file with the URL for your server
```
nano src/env.js
```
```
let env = {
    backend_domain: "http://comp3120.lukeglover.dev"
}

export default env;
```
Then build the frontend using npm.
```
npm run build
mkdir dist
mv public/* dist
```

## Setup Nginx to Serve Frontend
We use NGinx to serve the front end rather than the Webpack server for performance and security reasons. Create a file in `/etc/nginx/sites-available` with a name of your choice (for example, `comp3120`) for storing the nginx configuration, and open it in a text editor.
```
sudo nano /etc/nginx/sites-available/comp3120
```
Copy / paste the following configuration, changing the `server_name` to your domain name, and the `root` to your user folder.
```
server {

        listen 80;

        server_name comp3120.lukeglover.dev;

        location / {
                root /home/luke/group-project-gwdp-monday-5pm-pls-no/dist/;
                index index.html;
        }

        location /api {
                proxy_pass http://127.0.0.1:3000;
        }

        location /users {
                proxy_pass http://127.0.0.1:3000;
        }

}
```
Then symlink the file you just created to the `sites-enabled` directory.
```
sudo ln -S /etc/nginx/sites-available/comp3120 /etc/nginx/sites-enabled/comp3120
```
Then test the Nginx configuration for errors before reloading nNginx.
```
sudo nginx -t
sudo nginx -s reload
```

## Start Backend Server
```
npm run server
```
