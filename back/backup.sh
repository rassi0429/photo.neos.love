#!/bin/bash
date=`date +%Y%m%d-%H`
mysqldump --skip-column-statistics --single-transaction --quick --lock-tables=false -h 127.0.0.1 --port 3388 -u neos -ppassword photo | xz -3 > backups/${date}.sql.xz