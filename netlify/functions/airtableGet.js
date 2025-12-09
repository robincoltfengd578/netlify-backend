export default async (req) => {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const location = url.searchParams.get("location");

  let formulaParts = [];
  if (date) formulaParts.push(`IS_SAME({Date}, '${date}')`);
  if (location) formulaParts.push(`{Location}='${location}'`);
  const filterFormula = formulaParts.length ? `AND(${formulaParts.join(",")})` : "";

  const apiUrl = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
  if (filterFormula) apiUrl.searchParams.set("filterByFormula", filterFormula);

  const res = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();

  return new Response(JSON.stringify(json), {
    status: res.status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
};

export const config = { path: "/api/airtable/get" };
