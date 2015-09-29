#!/bin/bash
# Julius Zaromskis
# changes by http://dev-eth0.de
# Backup rotation

# Storage folder where to move backup files
# Must contain backup.monthly backup.weekly backup.daily folders
storage=/opt/preports-backup

# Mail for notification if failed 
TARGET_MAIL=bi-dev-support-products@bisnode.de


# Source folder where files are backed
source=$storage/incoming

# Destination file names
date_daily=`date +"%Y-%m-%d"`

# lifetime of backups before rotating in days
LIFETIME_DAILY=14
LIFETIME_WEEKLY=60
LIFETIME_MONTHLY=300


# Get current month and week day number
month_day=`date +"%d"`
week_day=`date +"%u"`

# Create folders if required
mkdir -p $storage/backup.daily
mkdir -p $storage/backup.weekly
mkdir -p $storage/backup.monthly

# Check if there are any files in the backup folder
#test "$(ls -A $source)" || ((echo "Please check your backup" | mail $TARGET_MAIL -s "[Backup] Daily backup failed! Backup folder is empty.") && exit 1)

# It is logical to run this script daily. We take files from source folder and move them to
# appropriate destination folder

# On first month day do
if [ "$month_day" -eq 1 ] ; then
  destination=backup.monthly/$date_daily
else
  # On saturdays do
  if [ "$week_day" -eq 6 ] ; then
    destination=backup.weekly/$date_daily
  else
    # On any regular day do
    destination=backup.daily/$date_daily
  fi
fi

# Move the files
mkdir $destination
mv -v $source/* $destination

# daily
find $storage/backup.daily/ -maxdepth 1 -mtime +$LIFETIME_DAILY -type d -exec rm -rv {} \;

# weekly
find $storage/backup.weekly/ -maxdepth 1 -mtime +$LIFETIME_WEEKLY -type d -exec rm -rv {} \;

# monthly
find $storage/backup.monthly/ -maxdepth 1 -mtime +$LIFETIME_MONTHLY -type d -exec rm -rv {} \;