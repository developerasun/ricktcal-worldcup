import dotenv from "dotenv";
dotenv.config();

(async () => {
  const token = process.env.BEARER_TOKEN;
  const endpoint = `${process.env.WEBHOOK_ENDPOINT}/reward`;

  if (!token) throw new Error("scheduling/src/reward.ts: invalid api key");

  if (!endpoint)
    throw new Error("scheduling/src/reward.ts: invalid webhook endpoint");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `bearer ${token}`,
        "User-Agent": "Mozilla/5.0 (GitHub Action)",
      },
    });
    const data = await response.json();
    console.info({ data });
  } catch (error) {
    console.error(error);
  }
})();
