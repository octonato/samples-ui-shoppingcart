### Frontend Service

The frontend service is a front end web application written in typescript.  It is backed by a `stateless` service that will serve the compiled javacript, html and images.

This service makes `grpc-web` calls directly to the other services to get the data that it needs.  In order to do this we need to compile the proto definitions from the other services as well as generate the grpc-web clients.  This is all done with a shell script `protogen.sh`.  Let's first run the protogen script, then compile the service definition and finally compile our typescript.

#### Building the Docker image

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

Now build the project.

```
npm run-script build
```
Finally the build script will compile the typescript and javascript into a webpack bundle.js file. This contains the code for your web front end.

Build a docker image with the right registry and tag

NOTE: you can get a free public docker registry by signing up at [https://hub.docker.com](https://hub.docker.com/)

```
DOCKER_PUBLISH_TO=<your repo here> npm run dockerbuild
docker build . -t <my-registry>/frontend:latest
```

Push the docker image to the registry

```
docker push <my-registry>/frontend:latest
```

Now the image is in the registry you can deploy it either to your own Cloudstate installation or to Lightbend's Cloudstate

#### Deploying to Lightbend Cloudstate

See the instructions here. Note: If you have built your own Docker image be sure to replace the location of that image with the repository you pushed it to.

https://docs.lbcs.dev/tutorial/deploy-cart.html

#### Deploying to your own Cloudstate deployment

If you are running your own Cloudstate instance you can deploy the frontend service as follows:

`kubectl apply -f deploy/frontend.xml`

#### Local testing

In order to run the shopping cart client locally you need to do the following:

1. Bring up the backend services (the cart, shopping and inventory services) using a convenient docker-compose configuration...

`docker-compose -f backend.yml up -d`

You can shut this down with `docker-compose -f backend.yml down` and follow the logs with `docker-compose -f backend.yml logs -f`.

Each service includes three parts; the service itself, an akka sidecar for it to connect with and a grpc-web proxy so that we can interact with the services directly from a web browser (which do not support grpc).

2. The frontend is served via a node.js server which listens on port 8080, but that is not enough to operate with Cloudstate, you also need an akka sidecar that is able to connect with it. In order to do that bring one up with the following docker command:

`docker run -it --rm --name cloudstate-frontend -p 9003:9000 --env USER_FUNCTION_HOST=host.docker.internal cloudstateio/cloudstate-proxy-dev-mode:latest`

Note that this sidecar exposes its 9000 port to 9003 on the local network, and you'll be able to browse the shopping service using the url http://localhost:9003/pages/index.html

It also sets the USER_FUNCTION_HOST environment variable (the host that the sidecar will try to connect to find the user service) to `host.docker.internal` which in Docker is a hostname mapped to your local network, which is the network we will run the frontend on.

3. Run the frontend.

In order to run the frontend locally we need to configure it correctly to attach the services on their individual ports. In a full Cloudstate deployment all the services would be accessed by the web frontend over the same host and port (the same one you access the web page on), but in local testing they are all different. To handle this you can set the host and port for each service individually in a way that matches up to the config in `backend.yml`. You need to build a special version of the server that has these settings.

```
npm run devbuild
npm run start-no-prestart
```

Now you should be able to use the full application and the services it depends on without needing Kubernetes or an ingress setup like Istio.

Alternatively, you can also run the frontend using docker to test locally. You can do so by building a development Docker image instead.

Create a file called `.env` in the root folder of your project with the contents...

`DOCKER_PUBLISH_TO=<your repo here>`

```
DOCKER_PUBLISH_TO=justinhj npm run dockerdevbuild
docker-compose -f frontend.yml up -d
```