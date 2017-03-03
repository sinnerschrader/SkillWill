### About this project

* This is only the frontend logic of the project.
* To get full functionality, checkout the backend at git@git.sinnerschrader.com:SkillWill/skillwill.git

* If the backend is not located at "localhost: 1337" edit the "backendServer" property in src/config.json

### To run frontend

* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) installed in your system.
* Fork and clone the project:

```
git clone git@git.sinnerschrader.com:SkillWill/skillwill-frontend.git
```

* Then install the dependencies:

```
npm install
```

* Run development server:

```
npm start
```

Open the web browser to `http://localhost:8888/`

### Building static files
To create static resources to deploy, run *one* of those commands:
* ```npm run build-dev``` (using ```webpack.config.js```; same config as ```npm run start```)
* ```npm run build``` (using ```webpack.production.config.js```)

The output can be found in ```/public```, just throw it at the webserver of your choice.
