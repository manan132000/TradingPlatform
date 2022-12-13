# Trading Platform

## QuickStart Guide
- Download the repository
- Enter the `Trading-Platform` folder on terminal
- `pip install -r requirements.txt`
- Enter the `frontend` repository
- `npm install`
- `npm start` to start the frontend server
- In your home directory, run the following commands to install Apache Kafka and Zookeeper
- `wget https://archive.apache.org/dist/zookeeper/zookeeper-3.5.5/apache-zookeeper-3.5.5-bin.tar.gz`
- `tar -xvf apache-zookeeper-3.5.5-bin.tar.gz`
- `rm apache-zookeeper-3.5.5-bin.tar.gz`
- `mkdir apache-zookeeper-3.5.5-bin/data`
- `wget https://archive.apache.org/dist/kafka/2.3.0/kafka_2.12-2.3.0.tgz`
- `tar -xzf kafka_2.12-2.3.0.tgz`
- `rm kafka_2.12-2.3.0.tgz`
- Now we can start our Kafka Server by running the following from the repository's server
- `.backend/event-streaming/starter/start_all.sh`
- Enter the `backend` repository
- `flask run` to start the backend server