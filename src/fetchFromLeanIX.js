import "dotenv/config";
import fs from "fs/promises";

/*
 * This script pulls data from UKHSA's LeanIX instance and creates a Markdown table
 * from the factsheets.
 * To run it you will need to create a .env file in the root of this repository
 * containing the following variables:
 *
 * - LEANIX_BASE_URL - the base URL for the Lean IX instance you're connecting to, this
 *   will take the form of, https://<name>.leanix.net
 * - LEANIX_CLIENT_TOKEN - the client secret to authenticate against the API with to get
 *   an access token
 *
 * As well as setting these variables in a .env file, you can also specify them directly
 * as environment variables.
 *
 * This is a poc atm and needs more work, we need to:
 * - filter the factsheets to remove irrelevant/superceded/old/incorrect entries
 * - split the output into multiple markdown files
 * - decide if the descriptions in LeanIX are good enough or whether to source summaries
 *   of the components from elsewhere (e.g. wikidata?)
 * - make the UI better on the rendered page as the text currently overflows, and it's
 *   not very pretty
 * - programmatically work out if something should be approved or not
 */

/**
 * Authenticates against the LeanIX instance and retrieve a short-lived access token for
 * subsequent requests.
 *
 * @param baseUrl the base URL of the LeanIX instance
 * @param token the client token to use to authenticate with
 * @returns {Promise<string>} the access token
 * @throws Error if the API returns an error
 */
async function authenticate(baseUrl, token) {
  const params = new URLSearchParams({grant_type: "client_credentials"})
  const tokenUrl = `${baseUrl}/services/mtm/v1/oauth2/token?${params}`;
  const headers = {
    "Authorization": `Basic ${Buffer.from(`apitoken:${token}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json",
  };
  const response = await fetch(tokenUrl, {method: "POST", headers: headers});
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to authenticate due to: ${body.errors}`);
  }
  return data.access_token;
}

/**
 * Retrieves all available fact sheets from LeanIX and returns them as an array. The
 * fact sheets returned will all have the type "ITComponent", otherwise no other filter
 * is used.
 *
 * @param baseUrl the base URL of the LeanIX instance
 * @param accessToken the short-lived access token to use for this request
 * @returns {Promise<Object[]>} an array of fact sheets, directly from the API response
 * @throws Error if the API returns an error response
 */
async function getFactSheets(baseUrl, accessToken) {
  const headers = {
    "Authorization": `Bearer ${accessToken}`,
    "Accept": "application/json",
  };
  const params = new URLSearchParams({type: "ITComponent", pageSize: 500});
  let factSheets = [];
  while (true) {
    const url = `${baseUrl}/services/pathfinder/v1/factSheets?${params}`;
    const response = await fetch(url, {method: "GET", headers: headers});
    const body = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to load fact sheets due to: ${body.errors}`);
    }
    if (body.data.length > 0) {
      factSheets.push(...body.data);
      params.set("cursor", body.cursor);
    } else {
      break;
    }
  }
  return factSheets;
}

/**
 * Given an array of fact sheets, turns them into an array of strings representing the
 * lines in a Markdown table.
 *
 * @param factSheets the fact sheets from the LeanIX API
 * @returns {string[]} a Markdown table represented line by line
 */
function toMarkdown(factSheets) {
  let content = [
    "| Name | Technology Assessment | Description |",
    "| - | - | - |",
  ];
  content.push(...factSheets.map(factSheet => {
    const name = factSheet.name.trim();
    let description = !!factSheet.description ? factSheet.description : "None provided";
    description = description.replaceAll("\n", "<br>").replace("|", "\\|").trim();
    return `| ${name} | Approved | ${description} |`;
  }));
  return content;
}

async function main() {
  // get the configuration from the env vars
  const baseUrl = process.env.LEANIX_BASE_URL;
  const clientToken = process.env.LEANIX_CLIENT_TOKEN;
  const accessToken = await authenticate(baseUrl, clientToken);
  const factSheets = await getFactSheets(baseUrl, accessToken);
  const page = [
    "# IT Components in Lean IX",
    "",
    "A list of the components in Lean IX.",
    "",
  ];
  page.push(...toMarkdown(factSheets));
  await fs.writeFile("docs/leanIX.md", `${page.join("\n")}\n`);
}

await main();
