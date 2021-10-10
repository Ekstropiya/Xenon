# Documentation: Installation
###### V0.0.1-A

### Linux

###### Requirements

- Git

###### Instructions

1. First, clone this repository.

```
$ git clone https://github.com/Ekstropiya/Xenon Xenon
$ cd Xenon
```

#### Manual

<details>
<summary>Expand</summary>

###### Requirements

- A PostgreSQL database.
- NodeJS and NPM.

###### Instructions

2. Create a user to run the app on.

```
# adduser xenon
Adding user `xenon' ...
Adding new group `xenon' (1003) ...
Adding new user `test' (1003) with group `xenon' ...
Creating home directory `/home/xenon' ...
Copying files from `/etc/skel' ...
New password: 
Retype new password: 
passwd: password updated successfully
Changing the user information for test
Enter the new value, or press ENTER for the default
	Full Name []: 
	Room Number []: 
	Work Phone []: 
	Home Phone []: 
	Other []: 
Is the information correct? [Y/n] Y
```

3. Move the cloned repository to the new users home directory.

```
# mv path/to/repository /home/xenon/app
```

4. Duplicate ``ormconfig.json.example``.

```
# cd /home/xenon/app
# cp ormconfig.json.example ormconfig.json
```

5. Configure ``ormconfig.json`` and ``config.js``.

###### ormconfig.json
```json
{
    "type": "postgres",
    "host": "YOUR HOSTNAME",
    "port": 5432,
    "username": "YOUR USERNAME",
    "password": "YOUR PASSWORD",
    "database": "YOUR DATABASE",
    "synchronize": true,
    "logging": false, // Enable if you want to see the statements executed.
    "entities": [
        "./**/*.entity.js"
    ]
}
```

Since we're not using Docker, uncomment the bottom ``module.exports`` and comment out the top one.
###### config.js
```javascript
// module.exports = {
//     "container": true,
//     "ssl": {
//         "use": false,
//         "cert": "",
//         "key": "",
//     },
//     "address": {
//         "range": process.env["XENON_ADDR_RANGE"],
//         "port": process.env["XENON_ADDR_PORT"],
//     },
//     "logging": {
//         "console": process.env["XENON_LOG_CONSOLE"],
//         "database": process.env["XENON_LOG_DATABASE"],
//     },
// }

// Uncomment if not using docker.
module.exports = {
    "container": false, // Don't change.
    "ssl": {
        "use": true, // Whether or not to use SSL. Change to false if you plan on using a reverse proxy.
        "cert": "ssl.cert", // Path to SSL certificate in xenon/ssl directory.
        "key": "ssl.key", // Path to SSL key in xenon/ssl directory.
    },
    "address": {
        "range": "0.0.0.0", // Which address range to listen on.
        "port": "80", // Which port to listen on.
    },
    "logging": {
        "console": true, // Whether or not to log basic request information to console.
        "database": true, // Whether or not to log all request information to the database.
    },
}
```

6. Install NPM dependencies and build project.

```
# npm install
# npm run build
```

Now all you need to do to run is:

```
# npm run start
```

and if you want to exit the terminal:

```
# npm run start &
# disown
```

7. Install systemd unit file (optional).

```
# cp ./xenon.service /etc/systemd/system
```

Now you should be able to launch Xenon from systemd:

```
# systemctl enable xenon
# systemctl start xenon
```
</details>
<br/>

#### Docker

<details>
<summary>Expand</summary>

###### Requirements

- Docker

###### Instructions

1. Set configuration options **(optional)**.

```
$ export OPTION=VALUE
```

###### Available Options

|                 Name | Type    | Description                                                     |
| -------------------: | :------ | --------------------------------------------------------------- |
|  ``LOGGING_CONSOLE`` | Boolean | Whether or not to log basic request information to the console. |
| ``LOGGING_DATABASE`` | Boolean | Whether or not to log all request information to the database.  |
|             ``PORT`` | Integer | Which port to expose the website on.                            |

3. Deploy the Docker composition.

```
$ docker-compose -f path/to/repository/docker-compose.yml
```

The app should now be exposed on ``0.0.0.0:7000`` or your configured port.
</details>

---