import request from "request";

const USER = xxxx;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Api-Key": "apikey",
};

function addTime(task, seconds, date, comment = "") {
  const body = JSON.stringify({
    "time": seconds,
    "user": USER,
    date,
    comment,
  });

  const url = `https://api.everhour.com/tasks/${task}/time`;

  return request({
    method: "POST",
    headers: HEADERS,
    url,
    body,
  }, function(error, response, body) {
    console.log("Status:", response.statusCode);
    console.log("Headers:", JSON.stringify(response.headers));
    console.log("Response:", body);
  });
}

addTime("xxxx-19235", 111, "2024-02-03");
