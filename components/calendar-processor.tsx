"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JSX, SVGProps, useState } from "react";

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

  const dates = new Map<Number, DataDay>();

  function processInput() {
    // Process the input into an array of dates.
    let firstYmd = 0;

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
      if (!dates.has(ymd)) {
        dates.set(ymd, {
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
        dates.get(ymd)!.tasks.push(task);
      }
    });
    // const input: DataInput = Array.from(dates.values());

    console.debug(dates);
    setSelectedYmd(firstYmd);
  }

  const handleInputTsvChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputTsv(event.target.value);
    console.log(event.target.value);
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
                  className="w-full h-32 p-2 border border-gray-200 rounded dark:border-gray-800"
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
              Total Hours Logged for
              <span className="font-normal">[Date]</span>
            </CardTitle>
            <CardDescription>
              Overview of the total hours logged for the selected day. Click on the '+' button to add a new entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Total Hours</TableHead>
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
                    <input className="w-full p-2 border border-gray-200 rounded dark:border-gray-800" id="totalHours" />
                  </TableCell>
                  <TableCell>
                    <Button>
                      <PlusIcon className="mr-1 h-4 w-4 -translate-x-1" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Design Meeting</TableCell>
                  <TableCell>10:00 AM</TableCell>
                  <TableCell>11:30 AM</TableCell>
                  <TableCell>1.5</TableCell>
                  <TableCell>
                    <Button>
                      <FileEditIcon className="mr-1 h-4 w-4 -translate-x-1" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Code Review</TableCell>
                  <TableCell>1:00 PM</TableCell>
                  <TableCell>2:00 PM</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>
                    <Button>
                      <FileEditIcon className="mr-1 h-4 w-4 -translate-x-1" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Development</TableCell>
                  <TableCell>2:30 PM</TableCell>
                  <TableCell>5:00 PM</TableCell>
                  <TableCell>2.5</TableCell>
                  <TableCell>
                    <Button>
                      <FileEditIcon className="mr-1 h-4 w-4 -translate-x-1" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell>5</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Button>
                <ArrowRightIcon className="mr-1 h-4 w-4 -translate-x-1" />
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
                  <TableCell>5 hours</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-02</TableCell>
                  <TableCell>6 hours</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-03</TableCell>
                  <TableCell>7 hours</TableCell>
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

function ArrowRightIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m12 5 7 7-7" />
    </svg>
  );
}
