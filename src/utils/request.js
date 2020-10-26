export default async function (url, getAccessTokenSilently, loginWithRedirect, method="GET", dataToInsert=null) {
  try {
    let token = await getAccessTokenSilently();

    if(dataToInsert !== null){
      dataToInsert = JSON.stringify(dataToInsert);
    }

    let response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: dataToInsert
    });

    let data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    await loginWithRedirect();
  }
}