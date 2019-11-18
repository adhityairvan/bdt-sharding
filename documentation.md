# MongoDB Cluster Installisation

## Architecture
* 2 Mongodb Config server
  * IP : 10.10.15.143-10.10.15.144
  * RAM : 512
  * Network : Private
* 1 MongoDB Query Router Server
  * IP :10.10.15.145
  * RAM : 512
  * Network : 
    * Private
    * Port Bind
* 3 Mongodb Shard server
  * IP : 10.10.15.146-10.10.15.148
  * RAM : 512
  * Network : Private 


## Preparation
1. Create Virtual Machine and do provisioning
2. See Vagrantfile in the repo for detailed config
3. Provision each server to install mongodb server
4. add this list to your hosts file
   ```
   10.10.15.143 mongo-config-1
   10.10.15.144 mongo-config-2
   10.10.15.145 mongo-query-router
   10.10.15.146 mongo-shard-1
   10.10.15.147 mongo-shard-2
   10.10.15.148 mongo-shard-3

## Setup basic Auth on Mongodb server
1. On any server, create root user
   ```
   mongo
   use admin
   db.createUser({user: "adhityairvan", pwd: "bdt2019", roles:[{role: "root", db: "admin"}]})
   ```
   you can change mongo-admin and password with anything you like
2. Generate key file
   ```
   openssl rand -base64 756 > mongo-keyfile
   ```
3. Copy key file to vagrant shared folder

## Installing created auth
1. On all server run these commands
    ```
    sudo mkdir /opt/mongo
    sudo cp /vagrant/mongo-keyfile /opt/mongo
    sudo chmod 400 /opt/mongo/mongo-keyfile
    sudo chown mongodb:mongodb /opt/mongo/mongo-keyfile
    ```
2. Edit mongo config to use the key. edit `/etc/mongod.conf` file. Remove comment on `security:` line, and add this line under it
   ```
   keyFile: /opt/mongo/mongodb-keyfile
   ```
3. Restart each mongodb process.

## Start Replicaset on config server
1. Edit mongod.conf to change bindIp address
2. uncomment `replication:` line and add `replSetName: configReplicaSet`. You can change configReplicaSet with anything you want.
3. uncomment `sharding:` line and add this line to set the config server role in the sharding cluster `clusterRole: "configsvr"`
4. Restart both config server mongodb service
5. On one of the config server. do this command on mongo interface
   ```
    rs.initiate( { _id: "configReplSet", configsvr: true, members: [ { _id: 0, host: "mongo-config-1:27019" }, { _id: 1, host: "mongo-config-2:27019" }, { _id: 2, host: "mongo-config-3:27019" } ] } )
    ```
    change the host address and ip according to your cluster configuration ip
6. See the replicaset status with this command 
   ```
   rs.status()
   ```
   ![](https://github.com/adhityairvan/bdt-sharding/raw/master/image/Annotation%202019-11-18%20023042.jpg)

## Configure Query Router server
1. Create new file `/etc/mongos.conf`
   ```
   # where to write logging data.
    systemLog:
      destination: file
      logAppend: true
      path: /var/log/mongodb/mongos.log

    # network interfaces
    net:
      port: 27017
      bindIp: 192.0.2.4

    security:
      keyFile: /opt/mongo/mongo-keyfile

    sharding:
      configDB: configReplicaSet/mongo-config-1:27017,mongo-config-2:27017
    ```
2. Create service file to make a new service
    ```
    [Unit]
    Description=Mongo Cluster Router
    After=network.target

    [Service]
    User=mongodb
    Group=mongodb
    ExecStart=/usr/bin/mongos --config /etc/mongos.conf
    # file size
    LimitFSIZE=infinity
    # cpu time
    LimitCPU=infinity
    # virtual memory size
    LimitAS=infinity
    # open files
    LimitNOFILE=64000
    # processes/threads
    LimitNPROC=64000
    # total threads (user+kernel)
    TasksMax=infinity
    TasksAccounting=false

    [Install]
    WantedBy=multi-user.target
    ```
    save it on `/lib/systemd/system/mongos.service
3. Stop normal mongodb service
   ```
   sudo systemctl stop mongod
   sudo systemctl disable mongod
   ```
4. Start a newly created service
   ```
   sudo systemctl start mongos
   ```
   ![](https://github.com/adhityairvan/bdt-sharding/raw/master/image/Annotation%202019-11-18%20115719.jpg)

## Adding shard server to Cluster
1. Edit mongod.conf on each of shard server
   1. change Bind address according to cluster ip
   2. uncomment sharding line, and add `clusterRole: "shardsvr"` under it
   3. restart mongod service
2. connect to mongos inteface
   ```
   mongo mongo-query-router -u adhityairvan -p -authenticationDatabase admin
   ```
3. add sharding server
   ```
   sh.addShard("mongo-shard-1:27017")
   ```
4. do these step above on each shard server

![](https://github.com/adhityairvan/bdt-sharding/raw/master/image/Annotation%202019-11-18%20121239.jpg)

## Enabling Sharding 
1. Enable sharding on the database
   ```
   use Playstore
   sh.enableSharding("Playstore")
2. Enable Sharding on collection
   ```
   db.Apps.ensureIndex( { _id : "hashed" } )
   sh.shardCollection("Playstore.Apps", {"_id": "hashed"})
   ```

## Inserting Data to collection
1. download data csv
2. run this command to import csv to mongodb
   ```
   mongoimport -h mongo-query-router -u adhityairvan -p bdt2019 --authenticationDatabase admin -d Playstore -c Apps --type csv --file /vagrant/googleplaystore.csv --headerline
   ```
   ![](https://github.com/adhityairvan/bdt-sharding/raw/master/image/Annotation%202019-11-18%20132808.jpg)
3. check the sharding stats on the collection
   ```
   db.Apps.getShardDistribution()
   ```
   ![](https://github.com/adhityairvan/bdt-sharding/raw/master/image/Annotation%202019-11-18%201330272.jpg)
   
