#Preports backup

MONGO_PORT=27018
MONGO_HOST=localhost
BACKUP_PATH=/opt/preports-backup/$(date --iso-8601=seconds)
PREPORTS_ATTACHEMENTS=/opt/preports-data/upload/
DB_BACKUP_PATH=$BACKUP_PATH/db
ATT_BACKUP_PATH=$BACKUP_PATH/attachments

mkdir -p $DB_BACKUP_PATH;
mkdir -p $ATT_BACKUP_PATH;

echo 'Creating dump of mongo db in ' $DB_BACKUP_PATH

#mongodump zip -v -r preports-yyyyMMdd+"%Y%m%d".zip /home/preports/bak sftp [[user@]host[:dir[/]]] put 
#- | gzip > $BACKUP_PATH/db/preports_db.gz
mongodump --host $MONGO_HOST --port $MONGO_PORT --db preports --out $DB_BACKUP_PATH

echo 'Zipping mongo dump'

zip -r $DB_BACKUP_PATH/db.zip $DB_BACKUP_PATH/preports

echo 'Backing up report attachments'

zip -r $ATT_BACKUP_PATH/attachements.zip $PREPORTS_ATTACHEMENTS

echo 'Preports backup complete'
