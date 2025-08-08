#!/bin/bash
echo " `date` Starting Application Install SH" >> /tmp/out.txt
if [ "$DEPLOYMENT_GROUP_NAME" == "stage" ]
then
    echo "starting Cloudwatch agent for $DEPLOYMENT_GROUP_NAME" >> /tmp/nginx.txt
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c ssm:AmazonCloudWatch-stage-madhifoundation-admin-api-web -s
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a start
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "dev" ]
then
    echo "starting Cloudwatch agent for  $DEPLOYMENT_GROUP_NAME" >> /tmp/nginx.txt
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c ssm:AmazonCloudWatch-dev-madhifoundation-admin-api-web -s
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a start
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "prod" ]
then
    echo "starting Cloudwatch agent for  $DEPLOYMENT_GROUP_NAME" >> /tmp/nginx.txt
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c ssm:AmazonCloudWatch-prod-madhifoundation-admin-api-web -s
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a start
fi
echo " `date` Ending Application Install SH" >> /tmp/out.txt
