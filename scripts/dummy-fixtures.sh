#!/bin/bash
set -a 
source .env
set +a
echo "Are you sure you want to insert the dummy fixtures into your db, overwriting all other data in the database $DATABASE_URL?"
read -p "Type 'confirm' to confirm: " userInput
if [ ${userInput} = 'confirm' ]
then
  echo "Inserting fixtures into database..."
  yarn fixtures ./dummy-fixtures --config ./ormconfig.js --require=ts-node/register --require=tsconfig-paths/register -d
fi