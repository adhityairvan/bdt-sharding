# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  (1..2).each do |i|
    config.vm.define "mongo_config_#{i}" do |node|
      node.vm.hostname = "mongo-config-#{i}"
      node.vm.box = "bento/ubuntu-18.04"
      node.vm.network "private_network", ip: "10.10.15.14#{2+i}"
      
      node.vm.provider "virtualbox" do |vb|
        vb.name = "mongo-config-#{i}"
        vb.gui = false
        vb.memory = "512"
      end

      node.vm.provision "shell", path: "provision/allhosts.sh", privileged: false
      node.vm.provision "shell", inline: "echo hello from node #{i}"
    end
  end

  config.vm.define "mongo_query_router" do |mongo_query_router|
    mongo_query_router.vm.hostname = "mongo-query-router"
    mongo_query_router.vm.box = "bento/ubuntu-18.04"
    mongo_query_router.vm.network "private_network", ip: "10.10.15.145"
    mongo_query_router.vm.network "forwarded_port", guest: "27017", host: "27017"
    
    mongo_query_router.vm.provider "virtualbox" do |vb|
      vb.name = "mongo-query-router"
      vb.gui = false
      vb.memory = "512"
    end

    mongo_query_router.vm.provision "shell", path: "provision/allhosts.sh", privileged: false
  end

  (1..3).each do |i|
    config.vm.define "mongo_shard_#{i}" do |node|
      node.vm.hostname = "mongo-shard-#{i}"
      node.vm.box = "bento/ubuntu-18.04"
      node.vm.network "private_network", ip: "10.10.15.14#{5+i}"
          
      node.vm.provider "virtualbox" do |vb|
        vb.name = "mongo-shard-#{i}"
        vb.gui = false
        vb.memory = "512"
      end
  
      node.vm.provision "shell", path: "provision/allhosts.sh", privileged: false
    end
  end
end
