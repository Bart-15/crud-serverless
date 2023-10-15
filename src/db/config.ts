import AWS from 'aws-sdk';
import config from '../config/config';

AWS.config.update({
    region: config.AWS_REGION,
    credentials:{
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }
});

export const db = new AWS.DynamoDB.DocumentClient();

// Table
export const UsersTable = 'UsersTable';


