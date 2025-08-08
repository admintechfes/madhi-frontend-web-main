#!/bin/bash
echo " `date` Starting After Install SH" >> /tmp/out.txt
if [ "$DEPLOYMENT_GROUP_NAME" == "stage" ]
then
    echo "downloading $DEPLOYMENT_GROUP_NAME" >> /tmp/nginx.txt
    #sudo aws s3 cp s3://madhifoundation-application/dev/admin/.env /var/www/html/api/madhifoundation-frontend/ --region ap-south-1
    cd /var/www/html/stage/frontend/madhi-frontend-web/
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "dev" ]
then
    echo "downloading $DEPLOYMENT_GROUP_NAME" >> /tmp/nginx.txt
    #sudo aws s3 cp s3://madhifoundation-application/uat/admin/.env /var/www/html/dev/api/madhifoundation-frontend/ --region ap-south-1
    cd /var/www/html/dev/frontend/madhi-frontend-web/
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "prod" ]
then
    echo "downloading $DEPLOYMENT_GROUP_NAME" >> /tmp/nginx.txt
    #sudomadhifoundation-application/prod/admin/.env /var/www/html/api/madhifoundation-frontend/ --region ap-south-1
    cd /var/www/html/prod/frontend/madhi-frontend-web/
fi
sudo npm install
sudo npm run build
sudo service nginx restart
FILE="/home/ubuntu/.env" # Replace with the actual file path
DEST_DIR="/var/www/html/dev/frontend/madhi-frontend-web/"
if [ -f "$FILE" ]; then
    sudo cp "$FILE" "$DEST_DIR"
else
    echo "File not found: $FILE" >> /tmp/nginx.txt
fi
echo " `date` Ending After Install SH" >> /tmp/out.txt
