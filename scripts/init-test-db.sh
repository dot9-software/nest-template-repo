NOCOLOR='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'

## Create Temporary Postgres instance with test database

echo "${RED} IF YOUR DOCKER DEAMON ISN'T RUNNING, STOP THE SCRIPT NOW! ${NOCOLOR}";
sleep 3;

docker kill transportschule-test-pg
docker rm transportschule-test-pg
docker run --name transportschule-test-pg -e POSTGRES_PASSWORD=docker -e PGPASSWORD=docker -p 127.0.0.1:8888:5432 -d postgres

# wait for pg to start
echo "${GREEN} sleep wait for pg-server to start ${NOCOLOR}";
sleep 3;

echo "CREATE DATABASE trtestdb ENCODING 'UTF-8';" | docker exec -i transportschule-test-pg psql -U postgres -p 5432

# IF YOU CHANGE `trtestdb`, ALSO CHANGE IT IN test/TestingModule.ts
DATABASE_URL=postgresql://postgres:docker@localhost:8888/trtestdb yarn ts-node node_modules/.bin/typeorm schema:sync -d tests.ormconfig.ts

## Seed mock data
NODE_ENV=development yarn install
yarn run-fixtures
