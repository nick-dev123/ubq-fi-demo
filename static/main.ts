import { DEMO_JOB1_DESCRIPTION, DEMO_JOB1_PRICING, DEMO_JOB1_PRIORITY, DEMO_JOB1_TIME, DEMO_JOB1_TITLE } from "./constants";
import { CallbackFn, HtmlElement, HtmlElementModifiable, JobPriority, JobTime, PromptEvent, Status, User } from "./types";
import { View } from "./view";

/** Job: A demo has multiple sample jobs, which can be interacted with */
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
  promptCallback: (demo: Demo, evt: PromptEvent) => boolean;

  /**
   * constructor description
   * @param  {Demo} demo reference to the demo class that owns this job
   * @param  {string} name Job name
   * @param  {string} description Job description
   * @param  {number} pricing Job pricing that is paid out the bounty hunter
   * @param  {JobTime} time Expected job completion time
   * @param  {JobPriority} priority Value between 1 and 4, higher number -> higher priority
   * @param  {CallbackFn} promptCallback Gets called after every prompt, true return value represents a completed job
   *            The callback functions receives the demo object and the last prompt event
   */
  constructor(demo: Demo, name: string, description: string, pricing: number, time: JobTime, priority: JobPriority, promptCallback: CallbackFn) {
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

  /**
     * A private method to start a job
     * Start conditions:
     *  1. The job has to be selected first
     *  2. User's wallet address must be set
     * Side effects:
     *  1. A new prompt is inserted into the history
     *  2. The status of job is set to in_progress
    // TODO
     *  3. A new deadline is calculated based on the time property
     * @error Throws error if the starting condiditons are not met
     */
  private _start() {
    if (this.status !== "selected") {
      // TODO
      // this.demo.addNotification("Error", "Cannot start non-idle job");
      throw new Error("Cannot start job");
    }

    const user = this.demo.getUser();

    const length = this.promptHistory.push({
      timestamp: new Date(),
      command: "start",
      response: undefined,
      status: "in_progress",
    });

    if (!user || !user.address) {
      const promptResponse = {
        title: "",
        html: {
          name: "elementPromptWalletWarning" as HtmlElement,
        },
      };
      this.promptHistory[length - 1].response = promptResponse;
      this.promptHistory[length - 1].status = "rejected";
      throw new Error("You must set your wallet address");
    }

    this.status = "in_progress";
    this.deadline = new Date("Tue, Sep 24, 11:20 PM UTC");

    this.promptHistory[length - 1].response = {
      title: "",
      html: {
        name: "elementPromptStart" as HtmlElementModifiable,
        modifiers: {
          DEADLINE: this.deadline.toString(),
          USER_ADDRESS: user.address,
        },
      },
    };
  }

  /**
   * A private method to stop a job
   * Stop conditions:
   *  1. The job has to be in progress
   * Side effects:
   *  1. A new prompt is inserted into the history
   *  2. The status of job is set to stopped
   * @error Throws error if the stop condiditons are not met
   */
  private _stop() {
    if (this.status !== "in_progress") {
      // TODO
      // this.demo.addNotification("Error", "Cannot stop non-in-progress job");
      throw new Error("Cannot stop job");
    }
    this.status = "stopped";

    // TODO
    const promptResponse = {
      title: "STOP",
      html: {
        name: "elementPromptWalletSuccess" as HtmlElement,
      },
    };

    this.promptHistory.push({
      timestamp: new Date(),
      command: "stop",
      response: promptResponse,
      status: "in_progress",
    });
  }

  /**
   * A private method to generate help information
   * Side effects:
   *  1. A new prompt is inserted into the history
   */
  private _help() {
    const promptResponse = {
      title: "Available commands",
      html: {
        name: "elementPromptHelp" as HtmlElement,
      },
    };

    this.promptHistory.push({
      timestamp: new Date(),
      command: "help",
      response: promptResponse,
      status: "in_progress",
    });
  }

  /**
   * A private method to set a user's wallet
   * Side effects:
   *  1. User wallet address is updated in the demo object
   *  2. A new prompt is inserted into the history
   * @error Throws error if the starting condiditons are not met
   */
  private _wallet(address: string) {
    if (!this.demo.getUser()) {
      throw new Error("Missing global user object");
    }
    this.demo.setUserAddress(address);

    const promptResponse = {
      title: "",
      html: {
        name: "elementPromptWalletRegistration" as HtmlElement,
      },
    };

    this.promptHistory.push({
      timestamp: new Date(),
      command: "stop",
      response: promptResponse,
      // TODO Get the current status
      status: "in_progress",
    });
  }

  /**
   * A private method in case of an invalid prompt
   * Side effects:
   *  1. A new prompt is inserted into the history
   * @error Throws error if the starting condiditons are not met
   */
  private _invalidPrompt() {
    this.promptHistory.push({
      timestamp: new Date(),
      command: "stop",
      response: {
        title: "",
        html: {
          name: "elementPromptInvalid",
        },
      },
      status: "in_progress",
    });
  }

  /**
   * A method to prompt a job
   * The query text has to match one of the predefined templates otherwise an invalid prompt message is displayed
   * Side effects:
   *  1. The job's status might get updated to completed if the callback's return value is true
   * @return The callback function's return value
   */
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

/** Demo: Main demo module */
class Demo {
  private _jobs: Job[] = [];
  private _activeJob: Job | undefined;
  private _view: View = new View(this);
  private _user: User = {
    address: null,
  };

  constructor() {}

  /**
   * A method to select a job
   * Conditions:
   *  1. The job has to be idle
   * Side effects:
   *  1. Sets the selected job as the active job
   *  2. Updates job's status to selected
   *  3. Displays active job
   *  4. Displays idle jobs list
   * @error Throws error if the job selection condiditon is not met
   */
  selectJob(selectedJob: Job) {
    const job = this._jobs.find((job) => job.id === selectedJob.id);
    if (!job) {
      throw new Error("No job found");
    }
    if (job.status !== "idle") {
      throw new Error("Cannot select non-idle job");
    }

    const currentlySelectedJob = this._jobs.find((job) => job.status === "selected");
    if (currentlySelectedJob) {
      currentlySelectedJob.status = "idle";
    }

    job.status = "selected";
    this._activeJob = job;
    this._view.displayIdleJobs(this._jobs.filter((job) => job.status === "idle"));
    this._view.displayActiveJob(job);
  }

  /**
   * A method to receive prompts
   * Prompt conditions:
   *  1. There has to be an active job
   * Side effects:
   *  1. The prompt response is displayed
   *  2. (Optionally) A completed job is displayed
   *  3. (Optionally) An error response is displayed
   * @error Throws if there is no active job
   */
  prompt(text: string) {
    if (!this._activeJob) {
      throw new Error("No active job to prompt");
    }
    try {
      const isCompleted = this._activeJob?.prompt(text);
      this._view.displayPromptHistory(this._activeJob.promptHistory);
      if (isCompleted) {
        this._view.displayCompleted();
      }
    } catch (error) {
      console.log(error);
      this._view.displayPromptError((error as Error).message);
    }
  }

  isCurrentJobStatusCompleted() {
    return this._activeJob?.status === "completed";
  }

  /**
   * A method to create sample jobs
   * Side effects:
   *  1. Display jobs
   */
  createJobs() {
    this._jobs.push(new Job(this, DEMO_JOB1_TITLE, DEMO_JOB1_DESCRIPTION, DEMO_JOB1_PRICING, DEMO_JOB1_TIME, DEMO_JOB1_PRIORITY, demo1Logic));
    this._jobs.push(new Job(this, DEMO_JOB1_TITLE, DEMO_JOB1_DESCRIPTION, DEMO_JOB1_PRICING, DEMO_JOB1_TIME, DEMO_JOB1_PRIORITY, demo1Logic));
    this._view.displayIdleJobs(this._jobs);
  }

  getUser() {
    return this._user;
  }

  setUserAddress(address: string) {
    if (this._user.address) {
      console.log("Updating address");
    }
    this._user.address = address;
  }

  /**
   * A private method to create a notification
   */
  private _addNotification(title: string, description: string) {
    console.log(title, description);
    // .. add, setTimeout, remove
  }
}

function demo1Logic(demo: Demo, evt: PromptEvent) {
  return !!(evt.command === "start" && demo.getUser().address);
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
