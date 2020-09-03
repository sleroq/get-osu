const fetch = require("node-fetch");
const db = require("./database/handler.js");
async function Auth() {
  const response = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.OSU_CLIENT_ID,
      client_secret: process.env.OSU_SECRET,
      scope: "public",
    }),
  }).then((response) => {
    return response.json();
  });
  console.log(response);
  await db.updateToken(response.access_token, response.expires_in);
}
/**
 * osu API
 *
 * @class osuAPI
 */
class osuAPI {
  /**
   * Creates an instance of osuApi.
   * @param {string} [baseURL='https://osu.ppy.sh/api/v2/'] base URL
   * @memberof osuAPI
   */
  constructor(baseURL = "https://osu.ppy.sh/api/v2") {
    this.baseURL = baseURL;
  }

  /**
   * Get user
   *
   * @param {string|number} id User id or Name
   * @param {string|number} mode User mode
   * @returns user object
   * @memberof osuAPI
   */
  async user(id) {
    const token = await db.getToken();
    let headers = {
      Authorization: "Bearer " + token.access_token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const data = await fetch(`${this.baseURL}/users/${id}`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log(error);
        return { error: error }; // throw new Error(error);
      });
    if ("error" in data) {
      return undefined;
    }
    if (data.authentication == "basic") {
      await Auth();
      this.user(id);
    } else {
      return data;
    }
  }
  /**
   * Get user's recent activity
   *
   * @param {string|number} id User id or Name
   * @returns recent activity object
   * @memberof osuAPI
   */
  async recentActivity(id) {
    const token = await db.getToken();
    let headers = {
      Authorization: "Bearer " + token.access_token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const url = new URL(
      `https://osu.ppy.sh/api/v1/users/${id}/recent_activity`
    );

    let params = {
      limit: "12",
      offset: "1",
    };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    const data = await fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      })
      .catch((error) => {
        console.log(error);
        return { error: error }; // throw new Error(error);
      });
    if ("error" in data) {
      return undefined;
    }
    if (data.authentication == "basic") {
      await Auth();
      this.recentActivity(id);
    } else {
      return data;
    }
  }
  /**
   * Get user's recent activity
   *
   * @param {string|number} id User id or Name
   * @returns recent activity object
   * @memberof osuAPI
   */
  async scores(id) {
    const url = new URL(`https://osu.ppy.sh/api/v2/users/${id}/scores/best`);

    let params = {
      include_fails: "0",
      mode: "osu",
      limit: "12",
      offset: "1",
    };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      })
      .catch((error) => {
        console.log(error);
        return { error: error }; // throw new Error(error);
      });
    if ("error" in data) {
      return undefined;
    }
    if (data.authentication == "basic") {
      await Auth();
      this.recentActivity(id);
    } else {
      return data;
    }
  }
}

module.exports = osuAPI;
