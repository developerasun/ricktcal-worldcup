import dotenv from "dotenv";
dotenv.config();

(async () => {
  const token = process.env.BEARER_TOKEN;

  if (!token) throw new Error("scheudling/src/index.ts: invalid api key");

  await fetch("/api/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `bearer ${token}`,
    },
  });
})();
