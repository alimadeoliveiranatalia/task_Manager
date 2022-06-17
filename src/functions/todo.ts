import { APIGatewayProxyHandler } from "aws-lambda"

export const handler: APIGatewayProxyHandler = async (event) => {
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Tarefa Criada com sucesso"
        })
    }
}