#!/usr/bin/env bash

cd "$(dirname "$0")" || exit
command="docker-compose exec -T -e PGPASSWORD=admin test_db psql -U admin test -c 'select 1'"
timeout="${1:-3}"

i=1
until eval "${command}"
do
    ((i++))

    if [ "${i}" -gt "${timeout}" ]; then
        echo "command was never successful, aborting due to ${timeout}s timeout!"
        exit 1
    fi

    sleep 1
done
