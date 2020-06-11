### Frontend Service

The frontend service is a front end web application written in typescript.  It is backed by a `stateless` service that will serve the compiled javacript, html and images.

This service makes `grpc-web` calls directly to the other services to get the data that it needs.  In order to do this we need to compile the proto definitions from the other services as well as generate the grpc-web clients.  This is all done with a shell script `protogen.sh`.  Let's first run the protogen script, then compile the service definition and finally compile our typescript.

```
cd frontend
nvm install
nvm use
npm install
```
This will install your dependencies, including cloudstate javascript client library.
```
./protogen.sh
```
protogen shell script will collect the required proto files and generate `grpc-web` clients for both typescript and javascript.
These files will appear under the `src/_proto` directory
```
npm run prestart
```
The prestart script will run the `compile-descriptor` located in the cloudstate client library using your service definition `shop.proto` outputting `user-function.desc`.
```
npm run-script build
```
Finally the build script will compile the typescript and javascript into a webpack bundle.js file. This contains the code for your web front end.

Build a docker image with the right registry and tag

NOTE: you can get a free public docker registry by signing up at [https://hub.docker.com](https://hub.docker.com/)
```
docker build . -t <my-registry>/frontend:latest
```

Push the docker image to the registry

```
docker push <my-registry>/frontend:latest
```
