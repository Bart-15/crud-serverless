import { db, UsersTable } from './../db/config';
import { createUserInput } from '../schema/user.schema';
import { HttpError } from '../middleware/errHandle';

const generateUpdateQuery = <T extends Record<string, any>>(fields: T) => {
  let exp = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {} as Record<string, string>,
    ExpressionAttributeValues: {} as Record<string, any>,
  };
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += `#${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
};

export async function index() {
  return await db
    .scan({
      TableName: UsersTable,
    })
    .promise();
}
export async function fetchUserByID(id: string) {
  const output = await db
    .get({
      TableName: UsersTable,
      Key: {
        userID: id,
      },
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: 'not found' });
  }

  return output.Item;
}

export async function addUser(input: createUserInput) {
  return await db
    .put({
      TableName: UsersTable,
      Item: input,
    })
    .promise();
}

export async function destroyUser(id: string) {
  return await db
    .delete({
      TableName: UsersTable,
      Key: {
        userID: id,
      },
    })
    .promise();
}

export async function update(id: string, input: createUserInput) {
  const data = generateUpdateQuery<createUserInput>(input);

  const params = {
    TableName: UsersTable,
    Key: {
      userID: id,
    },
    ConditionExpression: 'attribute_exists(userID)',
    ...data,
    ReturnValues: 'ALL_NEW',
  };

  return await db.update(params).promise();
}
