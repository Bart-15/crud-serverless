import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

import { createUserInput, createUserSchema } from './schema/user.schema';
import validateResource from './middleware/validateResource';
import { handleError } from './middleware/errHandle';
import { addUser, destroyUser, fetchUserByID, index, update } from './services/user.service';

const headers = {
  'content-type': 'application/json',
};

// sample only
export const listUser = async (
  _event: APIGatewayProxyEvent,
  _context: any
): Promise<APIGatewayProxyResult> => {
  try {
    const users = await index();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(users.Items),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const createUser = async (event: APIGatewayProxyEvent) => {
  try {
    const reqBody = JSON.parse(event.body as string) as createUserInput;

    const newUser = {
      userID: uuidv4(),
      name: reqBody.name,
      lastName: reqBody.lastName,
      age: reqBody.age,
      avatar: '',
    };

    // ----------------VALIDATION START ------------------ //
    validateResource(createUserSchema, newUser);
    // ----------------VALIDATION END ------------------ //

    //save to dynamoDb
    await addUser(newUser);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'User Created Successfully!',
        user: newUser,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getUser = async (event: APIGatewayProxyEvent) => {
  try {
    const user = await fetchUserByID(event.pathParameters?.id as string);

    if (!user)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'User not found',
        }),
      };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteUser = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id as string;

    await destroyUser(id);

    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    return handleError(error);
  }
};

export const updateUser = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id as string;

    const user = await fetchUserByID(id);

    if (!user)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'User not found',
        }),
      };

    const reqBody = JSON.parse(event.body as string) as createUserInput;

    const newUser = {
      name: reqBody.name,
      lastName: reqBody.lastName,
      age: reqBody.age,
      avatar: reqBody.avatar,
    };

    // ----------------VALIDATION START ------------------ //
    validateResource(createUserSchema, newUser);
    // ----------------VALIDATION END ------------------ //

    await update(id, newUser);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "User updated successfully"
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};
