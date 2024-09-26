import { PromptEvent, Status, User } from "./types";

export async function mainModule() {
  // job
  class Job {
    id = (Math.random() + 1).toString(36);
    name: string;
    description: string;
    status: Status;
    promptHistory: PromptEvent[];
    deadline: Date | undefined;
    demo: Demo;

    constructor(name: string, description: string) {
      this.name = name;
      this.demo = demo;
      this.description = description;
      this.status = "idle";
      this.promptHistory = [];
    }

    private _start() {
      if (this.status !== "selected") {
        demo.addNotification("Error", "Cannot start non-idle job");
        throw new Error("Cannot start job");
      }
      const length = this.promptHistory.push({
        timestamp: new Date(),
        command: "help",
        response: undefined,
        status: "in_progress",
      });

      if (!demo.user || !demo.user.address) {
        const promptResponse = {
          title: "",
          md: '<span class="pl-mc">!</span> Please set your wallet address with the /wallet command first and try again.',
        };
        this.promptHistory[length - 1].response = promptResponse;
        this.promptHistory[length - 1].status = "rejected";
        throw new Error("You must set your wallet address");
      }
      this.status = "in_progress";
      this.deadline = new Date("Tue, Sep 24, 11:20 PM UTC");

      const promptResponse = {
        title: "",
        md: `
            <samp>
              <table>
                  <tr><td>Deadline</td><td>${+this.deadline}</td></tr>
                  <tr>
                  <td>Beneficiary</td>
                  <td>${demo.user.address}</td>
                  </tr>
              </table>
            </samp>
            <h6>Tips:</h6>
            <ul>
              <li>Use <code>/wallet 0x0000...0000</code> if you want to update your registered payment wallet address.</li>
              <li>Be sure to open a draft pull request as soon as possible to communicate updates on your progress.</li>
              <li>Be sure to provide timely updates to us when requested, or you will be automatically unassigned from the task.</li>
            <ul>
        `,
      };
      this.promptHistory[length - 1].response = promptResponse;
    }

    private _stop() {
      if (this.status !== "in_progress") {
        demo.addNotification("Error", "Cannot stop non-in-progress job");
        throw new Error("Cannot stop job");
      }
      this.status = "stopped";

      // TODO
      const promptResponse = {
        title: "STOP",
        md: '<span class="pl-mil">+ Successfully registered wallet address</span>',
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
        md: `
            <table>
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Description</th>
                  <th>Example</th>
                </tr>
              </thead>  
            <tbody>
              <tr>
                <td class="code">/help</td>
                <td>List all available commands.</td>
                <td class="code">/help</td>
              </tr>
              <tr>
                <td>/allow</td>
                <td>Allows the user to modify the given label.</td>
                <td>/allow @user1 label</td>
              </tr>
              <tr>
                <td>/query</td>
                <td>Returns the user&#39;s wallet, access, and multiplier information.</td>
                <td>/query @ubiquibot</td>
              </tr>
              <tr>
                <td>/start</td>
                <td>Assign yourself to the issue.</td>
                <td>/start</td>
              </tr>
              <tr>
                <td>/stop</td>
                <td>Unassign yourself from the issue.</td>
                <td>/stop</td>
              </tr>
              <tr>
                <td>/wallet</td>
                <td>Register your wallet address for payments.</td>
                <td>/wallet ubq.eth</td>
              </tr>
            </tbody>
          </table>

          `,
      };

      this.promptHistory.push({
        timestamp: new Date(),
        command: "help",
        response: promptResponse,
        status: "in_progress",
      });
    }

    private _wallet(address: string) {
      if (!demo.user) {
        throw new Error("Missing global user object");
      }
      demo.user.address = address;

      const promptResponse = {
        title: "",
        md: '<span class="pl-mil">+ Successfully registered wallet address</span>',
      };

      this.promptHistory.push({
        timestamp: new Date(),
        command: "stop",
        response: promptResponse,
        status: "in_progress",
      });
    }

    private _invalidPrompt() {
      this.promptHistory.push({
        timestamp: new Date(),
        command: "stop",
        response: {
          title: "",
          md: '<span class="pl-bad">!Invalid prompt</span>',
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
    }
  }

  // View
  class View {
    jobs: HTMLElement;
    activeJob: HTMLElement;
    idleJobs: HTMLElement;
    completedJobs: HTMLElement;
    prompt: HTMLElement;
    // promptResponse: HTMLElement;

    constructor() {
      this.jobs = document.getElementById("demo") as HTMLElement;
      this.idleJobs = this.jobs.querySelector("#idle-jobs") as HTMLElement;
      this.activeJob = this.jobs.querySelector("#active-job") as HTMLElement;
      this.completedJobs = this.jobs.querySelector("#completed-jobs") as HTMLElement;
      this.prompt = this.activeJob.querySelector("#active-job__prompt-input") as HTMLElement;
      // this.promptResponse = this.activeJob.querySelector("#active-job__prompt-response") as HTMLElement;

      this.activeJob.addEventListener("drag", () => {});
      this.prompt.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = this.prompt.querySelector("input");
        if (!input) {
          return;
        }
        demo.prompt(input.value);
      });
    }

    displayIdleJobs(idleJobs: Job[]) {
      this.idleJobs.innerHTML = "";
      for (let i = 0; i < idleJobs.length; i++) {
        const job = document.createElement("div");
        job.className = "idle-jobs__job";
        job.innerHTML = `
            <div>
              <span>${idleJobs[i].name}</span>
            </div>
            <div class="idle-jobs__job__details">
              <div>
                2400 USD
              </div>
              <div>
                <2 Weeks
              </div>
              <div>
                3 (High)
              </div>
            </div>
        `;
        job.addEventListener("click", () => {
          demo.selectJob(idleJobs[i]);
        });
        this.idleJobs.appendChild(job);
      }
    }

    displayActiveJob(job?: Job) {
      if (!job) {
        return;
      }
      (this.activeJob.querySelector("#active-job__title") as HTMLElement).innerHTML = job.name;
      (this.activeJob.querySelector("#active-job__description") as HTMLElement).innerHTML = job.description;
      // TODO Display prompt history
      (this.activeJob.querySelector("#active-job__prompt-response") as HTMLElement).innerHTML = "";
    }

    displayPromptHistory(promptHistory: PromptEvent[]) {
      let responses = "";
      for (let i = 0; i < promptHistory.length; i++) {
        const { response } = promptHistory[i];
        if (response) {
          responses += response.md;
        }
      }
      (this.activeJob.querySelector("#active-job__prompt-response") as HTMLElement).innerHTML = responses;
    }

    // TODO
    displayPromptError(errorMessage: string) {
      console.log(errorMessage);
    }

    displayCompletedJobs(completedJobs: Job[]) {
      this.completedJobs.innerHTML = "";

      for (let i = 0; i < completedJobs.length; i++) {
        const job = `
          <div class="completed-job">
            <div>
              <span>${completedJobs[i].name}</span>
            </div>
            <button>
              ${completedJobs[i].status === "rewarded" ? "Rewarded" : "Get rewarded"}
            </button>
          </div> 
        `;
        this.completedJobs.innerHTML += job;
      }
    }
  }

  class Demo {
    jobs: Job[] = [];
    activeJob: Job | undefined;
    notifications = <Notification[]>[];
    view: View = new View();
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
        this.activeJob?.prompt(text);
        this.view.displayPromptHistory(this.activeJob.promptHistory);
      } catch (error) {
        console.log(error);
        this.view.displayPromptError((error as Error).message);
      }
    }

    createJobs() {
      this.jobs.push(new Job("asd", "asd"));
      this.jobs.push(new Job("asd2", "asd"));
      this.view.displayIdleJobs(this.jobs);
    }
  }

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
