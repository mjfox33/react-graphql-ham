#!/bin/bash

remote_file="https://data.fcc.gov/download/pub/uls/complete/l_amat.zip"
local_file="./tmp/l_amat.zip"

if [ -f $local_file ]
then
    modified=$(curl --silent --head $remote_file | \
             awk '/^last-modified/{print $0}' | \
             sed 's/^last-modified: //')
    remote_ctime=$(date --date="$modified" +%s)
    local_ctime=$(stat -c %z "$local_file")
    local_ctime=$(date --date="$local_ctime" +%s)

    if [[ $local_ctime -ge $remote_ctime ]]
    then
        echo 'No new files to download.'
        exit 0
    fi
fi

echo 'Downloading new file...'
curl $remote_file -o $local_file 
unzip $local_file EN.dat -d ./tmp

# end of file.
