import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamoDBClient";

interface ICreateTodo {
    id: string;
    title: string;
    deadline: string;

}
export const handler: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;
    const { id, title, deadline } = JSON.parse(event.body) as ICreateTodo;

    await document.put({
        TableName: "users_todos",
        Item: {
            id,
            user_id,
            title,
            done: false,
            deadline: new Date(deadline).getUTCDate(),
        }
    }).promise();

    const response = await document.query({
        TableName: "users_todos",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(response.Items[0])
    }
}