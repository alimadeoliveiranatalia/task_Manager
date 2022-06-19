import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'desafio-serverless',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
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
    CreateTodo: {
      handler: 'src/functions/CreateTodo.handler',
      events: [
        {
          http: {
            path: 'CreateTodo/{user_id}',
            method: 'post',
            request: {
              parameters: {
                paths: {
                  user_id:true
                }
              }
            },
            cors: true
          }
        }
      ]
    },
    ListTodo: {
      handler: 'src/functions/ListTodo.handler',
      events: [
        {
          http: {
            path: 'ListTodo/{user_id}',
            method: 'get',
            request: {
              parameters: {
                paths: {
                  user_id:true
                }
              }
            },
            cors: true
          }
        }
      ]
    }
  },
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
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
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
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
