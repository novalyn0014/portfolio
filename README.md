# UPWARD NEXT Boilerplate

  

Coding boilerplate using Gulp + PugJS + SASS + Typescript + Docker

  

## Update 11.04.25
* replaced src/php directory to www/html/
* changed docker configuration
	* changed from wordpress image to apache/nginx image
	* can install wordpress via cli or manual file download
	* add support for non wordpress projects (php)
  * allows flexible change of wordpress version or files
  * allows flexible change of php version by changing .env value
  
<br>

## Requirements:
> nodejs: >16.17.1

> yarn: >1.22

<br>(update if there is error in installation)
> python > 3.6

<br>

### To install:

```yarn install```

or

```npm install```

<br>

### To start the boilerplate (Static Coding):
```yarn dev```
This will use the files in src/ and be built into dist/

<br>

### To start the boilerplate (Webserver--php-apache):

```yarn server:apache```
This will use the files in /www/html folder instead of the /dist/ folder. You can add php files here and run them


```yarn dev:app```
This will start the boilerplate in webserver dev mode. All assets(css,js, and public files) will be built into /www/html/folder. Php files will be watched for autoreload when updating the file.

<br>  

### To start the boilerplate (Webserver--php-apache with wordpress installation):
To install wordpress you can either download the wordpress files manually and extracting them inside the /www/html/

or

you can install via command line by

```yarn init:wp:all```

This will run the wordpress autodownloader and will extract the files in www/html. After it downloads it will ask to generate for the theme folder name(required). 

**NOTES**
  - running the script again will not replace the existing files and just skip over them
  - if you are cloning an existing project with wordpress installed. Run ```yarn init:wp:base {version}``` with the current version of wordpress installed. As wp-includes and wp-admin is currently added in gitignore

<br>

#### If you want to install a separate version use
```yarn init:wp:base {wpversion}```
e.g.
```yarn init:wp:base 6.2```
Change the version number as needed. Theme folder will not be automatically created by this method and you need to run the

```yarn init:wp:theme```
<br>After installing and initializing the theme you can run

<br>

#### Running the env
```yarn dev:wp```
<br>For dev mode. Assets (css, js, and public) files will be built under /www/html/wp-content/themes/{themename}/
You will be directed to wordpress installation screen. Setup the wordpress as usual and use the credentials below:

To create the database access phpmyadmin by accessing (localhost:8090) on your browser and create a database .


For wordpress database use these credentials for database

```

databasename: you can create one via phpmyadmin(port 8090)

host : mysql

username : dbuser

password : password

```

#### For projects that already have a wordpress installtion(test/prod) server
 - use all in one migration plugin to get the data of the existing wordpress to your local
 - **NOTE: If there is a theme folder with the exact name in the existing(test/prod) wordpress the contents of that theme folder will replace the one in your /www/html/wp-content/themes/{themename}**

<br>  

### Changing php versions

You can change the php version by editing the .env file and setting the php version you want.

After changing the file run
```yarn server:apache --build```
to rebuild the image with the changed php version


<br>  


## Current script guide list

```

build": "yarn gulp build --smap=false", #build in dist

"build:app": "yarn gulp buildApp --smap=false", #build in www/html/

"build:wp": "yarn gulp buildWp --smap=false", #build in wordpress theme folder

"clean": "yarn clean:node && yarn clean:docker && rm -rf dist", # remove node_modules, docker volumes, and dist folder

"clean:docker": "docker volume prune", # remove docker volumes

"clean:node": "concurrently \"rm -rf node_modules\" \"rm -rf .cache\" \"rm -rf .parcel-cache\"", #remove nodejs files

"close": "docker-compose down --remove-orphans", # close all docker containers

"close:delete": "docker-compose down --remove-orphans && docker volume prune", # close all docker containers and remove volumes

"dev": "yarn gulp dev", #dev mode static site

"dev:app": "yarn server:apache -d && yarn gulp buildApp && yarn gulp devApp", #dev mode webserver

"dev:wp": "yarn server:apache -d && yarn gulp buildWp && yarn gulp devWp", #dev mode wordpress webserver

"init:wp:all": "yarn init:wp:base && yarn init:wp:theme", # initialize wordpress installation

"init:wp:base": "node scripts/addWordpress.mjs", # install wordpress

"init:wp:theme": "node scripts/createWPtheme.mjs", # initialize wordpress theme folder

"server:apache": "docker-compose -f docker-compose.yml -f docker-compose.apache.yml up", # start webserver

"server:nginx": "docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up", #start webserver nginx (WIP)

```

  
  

## Note


* NodeJS must be greater or equal than the said requirements. Take note that previous projects from webpack won't work when you upgrade your NodeJS version. You will have to upgrade and downgrade everytime you edit. You can install "nvm" if you want to use and switch between nodejs versions

  

* when migrating from the old boilerplate you may need to change some directory paths in the .pug, .scss, or .ts files

  

* when using this boilerplate on a new project. run yarn install first before making the first commit
