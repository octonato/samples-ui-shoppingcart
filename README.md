### Frontend Service

The frontend service is a front end web application written in typescript.

This service makes `grpc-web` calls directly to the other services to get the data that it needs.  In order to do this we need to compile the proto definitions from the other services as well as generate the grpc-web clients.  This is all done with a shell script `protogen.sh`.  Let's first run the protogen script, then compile the service definition and finally compile our typescript.

```
cd frontend
```

#### Installing development dependencies (optional)

Although this is not required for building and deploying the service, you might want to set up a development environment.
```
npm install
```
This will install your dependencies, including the cloudstate javascript client library.

Now you can build the project.
```
npm run build
```
The build script will compile the typescript and javascript into a webpack bundle.js file. This contains the code for your web front end.


3. Run the frontend.

In order to run the frontend locally we need to configure it correctly to attach the services on their individual ports. In a full Cloudstate deployment all the services would be accessed by the web frontend over the same host and port (the same one you access the web page on), but in local testing they are all different. To handle this you can set the host and port for each service individually in a way that matches up to the config in `backend.yml`. You need to build a special version of the server that has these settings.

```
npm run build:local_dev
npm start
```

Now you should be able to use the full application and the services it depends on without needing Kubernetes or an ingress setup like Istio.

Alternatively, you can also run the frontend using docker to test locally. You can do so by building a development Docker image instead.

Create a file called `.env` in the root folder of your project with the contents...

`DOCKER_PUBLISH_TO=<your repo here>`

```
DOCKER_PUBLISH_TO=<your repo here>` npm run dockerdevbuild
docker-compose -f frontend.yml up -d
```
