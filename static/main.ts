import { DEMO_JOB1_DESCRIPTION, DEMO_JOB1_PRICING, DEMO_JOB1_PRIORITY, DEMO_JOB1_TIME, DEMO_JOB1_TITLE } from "./constants";
import { JobPriority, JobTime, PromptEvent, Status, User } from "./types";
import { createElement } from "./util";
import { elementPromptHelp, elementPromptInvalid, elementPromptWalletRegistration, elementPromptWalletSuccess } from "./elements";
import { View } from "./view";

class Job {
  id = (Math.random() + 1).toString(36);
  name: string;
  description: string;
  status: Status;
  promptHistory: PromptEvent[];
  deadline: Date | undefined;
  pricing: number;
  time: JobTime;
  priority: JobPriority;
  demo: Demo;
  // Gets called after every prompt, if true the job is completed
  promptCallback: (demo: Demo, evt: PromptEvent) => boolean;

  constructor(
    demo: Demo,
    name: string,
    description: string,
    pricing: number,
    time: JobTime,
    priority: JobPriority,
    promptCallback: (demo: Demo, evt: PromptEvent) => boolean
  ) {
    this.name = name;
    this.demo = demo;
    this.description = description;
    this.status = "idle";
    this.promptHistory = [];
    this.pricing = pricing;
    this.time = time;
    this.priority = priority;
    this.promptCallback = promptCallback;
  }

  private _start() {
    if (this.status !== "selected") {
      this.demo.addNotification("Error", "Cannot start non-idle job");
      throw new Error("Cannot start job");
    }
    const length = this.promptHistory.push({
      timestamp: new Date(),
      command: "start",
      response: undefined,
      status: "in_progress",
    });

    if (!this.demo.user || !this.demo.user.address) {
      const promptResponse = {
        title: "",
        html: '<span class="pl-mc">!</span> Please set your wallet address with the /wallet command first and try again.',
      };
      this.promptHistory[length - 1].response = promptResponse;
      this.promptHistory[length - 1].status = "rejected";
      throw new Error("You must set your wallet address");
    }
    this.status = "in_progress";
    // TODO
    this.deadline = new Date("Tue, Sep 24, 11:20 PM UTC");

    const promptResponse = {
      title: "",
      html: createElement("elementPromptStart", {
        DEADLINE: +this.deadline,
        USER_ADDRESS: this.demo.user.address,
      }),
    };
    this.promptHistory[length - 1].response = promptResponse;
  }

  private _stop() {
    if (this.status !== "in_progress") {
      this.demo.addNotification("Error", "Cannot stop non-in-progress job");
      throw new Error("Cannot stop job");
    }
    this.status = "stopped";

    // TODO
    const promptResponse = {
      title: "STOP",
      html: elementPromptWalletSuccess,
    };

    this.promptHistory.push({
      timestamp: new Date(),
      command: "stop",
      response: promptResponse,
      status: "in_progress",
    });
  }

  private _help() {
    const promptResponse = {
      title: "Available commands",
      html: elementPromptHelp,
    };

    this.promptHistory.push({
      timestamp: new Date(),
      command: "help",
      response: promptResponse,
      status: "in_progress",
    });
  }

  private _wallet(address: string) {
    if (!this.demo.user) {
      throw new Error("Missing global user object");
    }
    this.demo.user.address = address;

    const promptResponse = {
      title: "",
      html: elementPromptWalletRegistration,
    };

    this.promptHistory.push({
      timestamp: new Date(),
      command: "stop",
      response: promptResponse,
      // TODO
      status: "in_progress",
    });
  }

  private _invalidPrompt() {
    this.promptHistory.push({
      timestamp: new Date(),
      command: "stop",
      response: {
        title: "",
        html: elementPromptInvalid,
      },
      status: "in_progress",
    });
  }

  prompt(text: string) {
    const walletRegex = /\/wallet\s(0x[a-fA-F0-9]{40})/;
    const match = text.match(walletRegex);
    if (match) {
      const address = match[1];
      this._wallet(address);
    } else if (text === "/help") {
      this._help();
    } else if (text === "/start") {
      this._start();
    } else if (text === "/stop") {
      this._stop();
    } else {
      this._invalidPrompt();
    }
    const isCompleted = this.promptCallback(this.demo, this.promptHistory[this.promptHistory.length - 1]);
    if (isCompleted) {
      this.status = "completed";
    }
    return isCompleted;
  }
}

class Demo {
  jobs: Job[] = [];
  activeJob: Job | undefined;
  notifications = <Notification[]>[];
  view: View = new View(this);
  user: User = {
    address: null,
  };

  constructor() {}

  addNotification(title: string, description: string) {
    console.log(title, description);
    // .. add, setTimeout, remove
  }

  selectJob(selectedJob: Job) {
    const currentlySelectedJob = this.jobs.find((job) => job.status === "selected");
    if (currentlySelectedJob) {
      currentlySelectedJob.status = "idle";
    }
    const job = this.jobs.find((job) => job.id === selectedJob.id);
    if (!job) {
      throw new Error("No job found");
    }
    if (job.status !== "idle") {
      throw new Error("Cannot select non-idle job");
    }
    job.status = "selected";
    this.activeJob = job;
    this.view.displayIdleJobs(this.jobs.filter((job) => job.status === "idle"));
    this.view.displayActiveJob(job);
  }

  prompt(text: string) {
    if (!this.activeJob) {
      throw new Error("No active job to prompt");
    }
    // TODO
    // this.validatePrompt(text);
    try {
      const isCompleted = this.activeJob?.prompt(text);
      this.view.displayPromptHistory(this.activeJob.promptHistory);
      if (isCompleted) {
        this.view.displayCompleted();
      }
    } catch (error) {
      console.log(error);
      this.view.displayPromptError((error as Error).message);
    }
  }

  isCurrentJobStatusCompleted() {
    return this.activeJob?.status === "completed";
  }

  createJobs() {
    this.jobs.push(new Job(this, DEMO_JOB1_TITLE, DEMO_JOB1_DESCRIPTION, DEMO_JOB1_PRICING, DEMO_JOB1_TIME, DEMO_JOB1_PRIORITY, demo1Logic));
    this.jobs.push(new Job(this, DEMO_JOB1_TITLE, DEMO_JOB1_DESCRIPTION, DEMO_JOB1_PRICING, DEMO_JOB1_TIME, DEMO_JOB1_PRIORITY, demo1Logic));
    this.view.displayIdleJobs(this.jobs);
  }
}

function demo1Logic(demo: Demo, evt: PromptEvent) {
  return !!(evt.command === "start" && demo.user.address);
}

export async function mainModule() {
  const demo = new Demo();
  demo.createJobs();

  return demo;
}

mainModule()
  .then(() => {
    console.log("mainModule loaded");
  })
  .catch((error) => {
    console.error(error);
  });

export { Demo, Job };
