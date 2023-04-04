// const dialogflow = require('dialogflow');
// const config = require('../config/devkey');

// const projectId = config.googleProjectID;
// const sessionId = config.dialogFlowSessionID;

// const credentials = {
//   client_email: config.googleClientEmail,
//   private_key: config.googlePrivateKey,
// };

// const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

// const textQuery = async (userText, userId) => {
//   const sessionPath = sessionClient.sessionPath(projectId, sessionId + userId);

//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: userText,
//         languageCode: config.dialogFlowSessionLanguageCode,
//       },
//     },
//   };

//   try {
//     const response = await sessionClient.detectIntent(request);
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

// module.exports = {
//   textQuery,
// };

const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const config = require('../config/devkey');

const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionID;

const sessionClient = new dialogflow.SessionsClient({
  projectId,
  credentials: {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey,
  },
});

const knowledgeBasePath =
  'projects/' +
  projectId +
  '/knowledgeBases/' +
  'OTAzODcxODQwNDgxODYzMjcwNA' +
  '';
const textQuery = async (userText, userId) => {
  const sessionVal = sessionId + userId;
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionVal
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userText,
        languageCode: config.dialogFlowSessionLanguageCode,
      },
    },
    queryParams: {
      knowledgeBaseNames: [knowledgeBasePath],
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    // console.log(
    //   response.queryResult.parameters.fields.person.structValue.fields.name
    //     .stringValue
    // );
    console.log(response.queryResult.fulfillmentMessages[0].text.text[0]);
    return response.queryResult;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  textQuery,
};
