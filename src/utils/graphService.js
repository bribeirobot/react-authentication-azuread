const graph = require('@microsoft/microsoft-graph-client');

// function getAuthenticatedClient(accessToken) {
//   const client = graph.Client.init({
//     authProvider: (done) => {
//       done(null, accessToken);
//     }
//   });

//   return client;
// }

export async function getUserDetails(extension) {
  const jsonObject = JSON.parse(extension);
  const user  = {
    displayName: jsonObject.nmUsuario,
    mail: jsonObject.nmEmail,
    employees: jsonObject.employees
  }
  // const client = getAuthenticatedClient(accessToken);

  // const user = await client
  //   .api('/me')
  //   .select('emails,name')
  //   .get();

  return user;
}
