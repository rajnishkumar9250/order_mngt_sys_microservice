# order_mngt_sys_microservice
Demo project for order management service using microservice


After cloning the repository, go to inside main directory. To run the microservices, just run below command, make sure you have
docker-compose.yml file is there.

docker-compose up -d

Once, all microservices are started, please navigate browser to localhost:8080 . It will redirect to swagger ui documentation.


Notification: Make sure mongodb and kafka service is not running , because we are using these services. If any microservices are
not started properly, then please down the all microservice and start again. please follow below command

docker-compose down      (to down the microservices)
docker-compose up -d     (To start the microservices, -d option to run microservice in background)

To see the logs of any microservice (let order microservice), run the below command

docker-compose logs -f --tail 500 order

To see which all microservices is running,  run the below command

docker-compose ps
