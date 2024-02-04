const USER = xxxx;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Api-Key": "apikey",
};

async function addTime(task, seconds, date, comment = "") {
  const body = JSON.stringify({
    "time": seconds,
    "user": USER,
    date,
    comment,
  });

  const url = `https://api.everhour.com/tasks/${task}/time`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body
    });
    const responseBody = await response.json();

    console.log("Status:", response.status);
    console.log("Headers:", JSON.stringify(Object.fromEntries(response.headers.entries())));
    console.log("Response:", responseBody);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

await addTime("xxxx-19235", 111, "2024-02-03");
