"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addTime, getEverhourTaskIdForJiraIssue } from "@/lib/everhour";
import { JSX, SVGProps, useEffect, useState } from "react";

type DataDay = {
  day: number;
  month: number;
  year: number;
  ymd: number;
  tasks: DataTask[];
};

type DataTask = {
  jiraIssue: string;
  everhourTaskId?: string;
  durationMinutes: number;
  everhourComment?: string;
  // startTime: string;
};

type DataInput = DataDay[];

export function CalendarProcessor() {
  const [inputTsv, setInputTsv] = useState("");
  const [selectedYmd, setSelectedYmd] = useState(0);
  const [dataDay, setDataDay] = useState<DataDay | null>(null);
  const [data, setData] = useState(new Map<Number, DataDay>());

  useEffect(() => {
    // Assuming dates is a Map or similar structure
    const tasksForSelectedDate = data.get(selectedYmd);
    if (tasksForSelectedDate) {
      // Enrich tasks
      Promise.all(
        tasksForSelectedDate.tasks.map((task) =>
          getEverhourTaskIdForJiraIssue(task.jiraIssue).then((taskId) => {
            task.everhourTaskId = taskId;
          })
        ),
      ).then(() => setDataDay(tasksForSelectedDate));
    }
    console.debug("useeffect", selectedYmd, data.get(selectedYmd));
  }, [selectedYmd, data]); // Recalculate when selectedYmd changes or the dates map is updated

  function nextDay() {
    setSelectedYmd(selectedYmd + 1);
  }

  function processInput() {
    // Process the input into an array of dates.
    let firstYmd = 30000000;
    const newData = new Map<number, DataDay>();

    inputTsv.split("\n").forEach((line) => {
      const parts = line.split("\t");
      const task = {
        jiraIssue: parts[2],
        durationMinutes: parseInt(parts[1]),
        everhourComment: parts[3],
      };

      const date = parts[0];
      const day = parseInt(date.split("/")[1]);
      const month = parseInt(date.split("/")[0]);
      const year = parseInt(date.split("/")[2]);
      const ymd = parseInt(`${year}${`0${month}`.slice(-2)}${`0${day}`.slice(-2)}`);
      if (!newData.has(ymd)) {
        newData.set(ymd, {
          day,
          month,
          year,
          ymd,
          tasks: [task],
        });
        if (ymd < firstYmd) {
          firstYmd = ymd;
        }
      } else {
        newData.get(ymd)!.tasks.push(task);
      }
    });

    setData(newData);
    console.debug(newData);
    setSelectedYmd(firstYmd);
  }

  function submitToEverhour() {
    if (!dataDay) return;
    Promise.all(dataDay.tasks.map((task) => {
      if (!task.everhourTaskId) {
        console.error("No everhour task id for", task);
        return;
      }
      const everhourDate = `${dataDay.year}-${`0${dataDay.month}`.slice(-2)}-${`0${dataDay.day}`.slice(-2)}`;
      return addTime(task.everhourTaskId, task.durationMinutes * 60, everhourDate, task.everhourComment);
    })).then(() => {
      console.info("Submitted to Everhour");
      nextDay();
    });
  }

  const handleInputTsvChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputTsv(event.target.value);
  };

  return (
    <main
      key="1"
      className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-8 bg-gray-100 dark:bg-gray-800"
    >
      <div className="w-full md:w-2/3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Process TSV Hour Log Data</CardTitle>
            <CardDescription>Paste the corresponding TSV data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tsvData">TSV Data</Label>
                <textarea
                  className="w-full h-32 p-2 border border-gray-200 rounded dark:border-gray-800 dark:text-gray-950"
                  id="tsvData"
                  value={inputTsv}
                  onChange={handleInputTsvChange}
                />
              </div>
              <Button onClick={processInput}>
                <WorkflowIcon className="mr-1 h-4 w-4 -translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full mt-8">
          <CardHeader>
            <CardTitle>
              Total Minutes Logged for <span className="font-normal">{selectedYmd}</span>
            </CardTitle>
            <CardDescription>
              Overview of the total minutes logged for the selected day. Click on the + button to add a new entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <input className="w-full p-2 border border-gray-200 rounded dark:border-gray-800" id="activity" />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-2 border border-gray-200 rounded dark:border-gray-800" id="startTime" />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-2 border border-gray-200 rounded dark:border-gray-800" id="endTime" />
                  </TableCell>
                  <TableCell>
                    <input
                      className="w-full p-2 border border-gray-200 rounded dark:border-gray-800"
                      id="totalMinutes"
                    />
                  </TableCell>
                  <TableCell>
                    <Button>
                      <PlusIcon className="mr-1 h-4 w-4 -translate-x-1" />
                    </Button>
                  </TableCell>
                </TableRow>
                {dataDay?.tasks.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>{task.jiraIssue} ({task.everhourTaskId})</TableCell>
                    <TableCell>{task.everhourComment}</TableCell>
                    <TableCell>{/*task.startTime*/}</TableCell>
                    <TableCell>{task.durationMinutes}</TableCell>
                    <TableCell>
                      <Button>
                        <FileEditIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell>{dataDay?.tasks.map((t) => t.durationMinutes).reduce((a, b) => a + b, 0)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4 gap-2">
              <Button onClick={nextDay}>
                Skip {">"}
                {/* <ArrowRightIcon className="mr-1 h-4 w-4 -translate-x-1" /> */}
              </Button>
              <Button onClick={submitToEverhour}>
                Submit to Everhour {">"}
                {/* <ArrowRightIcon className="mr-1 h-4 w-4 -translate-x-1" /> */}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-1/3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Processed Dates</CardTitle>
            <CardDescription>List of dates that have been processed and their total duration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-02-01</TableCell>
                  <TableCell>5 minutes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-02</TableCell>
                  <TableCell>6 minutes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-03</TableCell>
                  <TableCell>7 minutes</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function WorkflowIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
  );
}

function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function FileEditIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5V4a2 2 0 1 2-2h8.5L20 7.5V20a2 1-2 2h-5.5" />
      <polyline points="14 2 8 20" />
      <path d="M10.42 12.61a2.1 2.1 0 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
}
