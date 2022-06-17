import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'desafio-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { 
    todo: {
      handler: 'src/functions/todo.handler',
      events: [
        {
          http: {
            path: 'todo',
            method: 'get',
            cors: true
          }
        }
      ]
    } },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      dbUsersTodos: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'users_todos',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "user_id",
              AttributeType: "S"
            },
            {
              AttributeName: "title",
              AttributeType: "S"
            },
            {
              AttributeName: "done",
              AttributeType: "BOOL"
            },
            {
              AttributeName: "id",
              AttributeType: "S"
            },
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
