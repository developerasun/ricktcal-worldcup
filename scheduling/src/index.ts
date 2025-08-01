import dotenv from "dotenv";
dotenv.config();

(async () => {
  const token = process.env.BEARER_TOKEN;
  const endpoint = process.env.WEBHOOK_ENDPOINT;

  if (!token || !endpoint)
    throw new Error("scheudling/src/index.ts: invalid api key");

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
})();
