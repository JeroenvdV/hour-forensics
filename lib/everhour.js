"use server";

const USER = process.env.EVERHOUR_USER_ID;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Api-Key": process.env.EVERHOUR_API_KEY,
};

export async function addTime(task, seconds, date, comment = "") {
  const body = JSON.stringify({
    "time": seconds,
    "user": USER,
    date,
    comment,
  });

  const url = `https://api.everhour.com/tasks/${task}/time`;

  const result = await everhourApiCall("POST", url, body);
  console.debug(result);
}

async function everhourApiCall(method, url, body) {
  try {
    const response = await fetch(url, {
      headers: HEADERS,
      method,
      body,
    });
    const responseBody = await response.json();

    // console.log("Status:", response.status);
    // console.log("Headers:", JSON.stringify(Object.fromEntries(response.headers.entries())));
    // console.log("Response:", responseBody);
    return responseBody;
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

/**
 *
 *  * Example result:
 * [
    {
        "id": "xxxx-19307",
        "name": "Infrastructure",
        "type": "Story",
        "status": "Backlog",
        "url": "https://xxxx.atlassian.net/browse/HOR-30",
        "projects": [
        "xxxx-10040"
        ],
        "number": "HOR-30",
        "createdAt": "2024-01-17 13:36:28",
        "labels": [],
        "attributes": {
        "Epic Link": "HOR-14",
        "Priority": "Medium"
        },
        "completed": false,
        "assignees": [],
        "_type": "task"
    }
    ]
 * @param {string} jiraIssue
 * @returns { result: Promise<string> }
 */
export async function getEverhourTaskIdForJiraIssue(jiraIssue) {
  // Workaround for sequential execution of server tasks, see https://www.youtube.com/watch?v=CDZg3maL9q0
  async function _getEverhourTaskIdForJiraIssue(jiraIssue) {
    const url = `https://api.everhour.com/tasks/search?query=${jiraIssue}&limit=100`;

    const result = await everhourApiCall("GET", url);

    const match = result.find(task => task.number === jiraIssue);
    if (match) return match.id;
    console.warn("Missing Jira issue: ", jiraIssue);
    return null;
  }
  return { taskId: _getEverhourTaskIdForJiraIssue(jiraIssue) };
}

//   await addTime("xxxx-19235", 111, "2024-02-03");
//   await getEverhourTaskIdForJiraIssue("CO-736"));
