/**
 * @dev This file contains every method necessary to modify the DOM
 */

import { Demo, Job } from "./main";
import { allowDrop, drag, dragover, drop } from "./drag";
import {
  ACTIVE_JOB_DESCRIPTION_SELECTOR,
  ACTIVE_JOB_SELECTOR,
  ACTIVE_JOB_TITLE_SELECTOR,
  COMPLETED_JOBS_SELECTOR,
  DEMO_SELECTOR,
  IDLE_JOBS_SELECTOR,
  PROMPT_INPUT_SELECTOR,
  PROMPT_RESPONSE_SELECTOR,
  PROMPT_INPUT_PROMPTS_SELECTOR,
} from "./constants";
import { createElement } from "./util";
import { HtmlElementModifiable, PromptEvent } from "./types";
import * as elements from "./elements";

// View
class View {
  demo: Demo;
  demoElement: HTMLElement;
  activeJob: HTMLElement;
  idleJobs: HTMLElement;
  completedJobs: HTMLElement;
  prompt: HTMLElement;
  promptResponse: HTMLElement;

  constructor(demo: Demo) {
    this.demo = demo;
    this.demoElement = document.getElementById(DEMO_SELECTOR) as HTMLElement;
    this.idleJobs = this.demoElement.querySelector(IDLE_JOBS_SELECTOR) as HTMLElement;
    this.activeJob = this.demoElement.querySelector(ACTIVE_JOB_SELECTOR) as HTMLElement;
    this.completedJobs = this.demoElement.querySelector(COMPLETED_JOBS_SELECTOR) as HTMLElement;
    this.prompt = this.activeJob.querySelector(PROMPT_INPUT_SELECTOR) as HTMLElement;
    this.promptResponse = this.activeJob.querySelector(PROMPT_RESPONSE_SELECTOR) as HTMLElement;

    this.prompt.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = this.prompt.querySelector("input");
      if (!input) {
        return;
      }
      this.demo.prompt(input.value);
    });

    this.activeJob.draggable = false;
    this.activeJob.ondragstart = drag;

    this.completedJobs.ondragover = allowDrop;
    this.completedJobs.ondrop = (ev: DragEvent) => {
      drop(ev, this.demo.getActiveJob() as Job);
      this.clearActiveJob();
    };
    this.completedJobs.ondragover = dragover;
    this.disableActiveJobInputs();
  }

  clearActiveJob() {
    const title = this.activeJob.querySelector(ACTIVE_JOB_TITLE_SELECTOR);
    const input = this.activeJob.querySelector("input");
    const description = this.activeJob.querySelector(ACTIVE_JOB_DESCRIPTION_SELECTOR);
    const response = this.activeJob.querySelector(PROMPT_RESPONSE_SELECTOR);
    if (!title || !description || !response || !input) {
      throw new Error("No items");
    }
    title.innerHTML = "";
    description.innerHTML = "";
    response.innerHTML = "";
    input.value = "";
    this.activeJob.draggable = false;

    this.disableActiveJobInputs();
  }

  disableActiveJobInputs() {
    const input = this.activeJob.querySelector("input");
    const submitBtn = this.activeJob.querySelector("button");
    const samplePrompts = this.activeJob.querySelectorAll(`${PROMPT_INPUT_PROMPTS_SELECTOR} > li > button`);
    if (!input || !submitBtn) {
      throw new Error("No items");
    }

    this.prompt.classList.add("active-job__prompt-input--disabled");

    input.disabled = true;
    submitBtn.disabled = true;
    samplePrompts.forEach((p) => {
      (p as HTMLInputElement).disabled = true;
    });
  }

  enableActiveJobInputs() {
    const input = this.activeJob.querySelector("input");
    const submitBtn = this.activeJob.querySelector("button");
    const samplePrompts = this.activeJob.querySelectorAll(`${PROMPT_INPUT_PROMPTS_SELECTOR} > li > button`);
    if (!input || !submitBtn) {
      throw new Error("No items");
    }

    this.prompt.classList.remove("active-job__prompt-input--disabled");

    input.disabled = false;
    submitBtn.disabled = false;
    samplePrompts.forEach((p) => {
      (p as HTMLInputElement).disabled = false;
    });
  }

  displayIdleJobs(idleJobs: Job[]) {
    this.idleJobs.innerHTML = "";
    for (let i = 0; i < idleJobs.length; i++) {
      const job = document.createElement("div");
      const idleJobInnerHtml = createElement("elementIdle", {
        NAME: idleJobs[i].name,
        PRICING: idleJobs[i].pricing,
        TIME: idleJobs[i].time,
        PRIORITY: idleJobs[i].priority,
      });
      job.className = "idle-jobs__job";
      job.innerHTML = idleJobInnerHtml;
      job.addEventListener("click", () => {
        this.demo.selectJob(idleJobs[i]);
      });
      this.idleJobs.appendChild(job);
    }
  }

  displayActiveJob(job?: Job) {
    if (!job) {
      return;
    }
    (this.activeJob.querySelector(ACTIVE_JOB_TITLE_SELECTOR) as HTMLElement).innerHTML = job.name;
    (this.activeJob.querySelector(ACTIVE_JOB_DESCRIPTION_SELECTOR) as HTMLElement).innerHTML = job.description;
    (this.activeJob.querySelector(PROMPT_RESPONSE_SELECTOR) as HTMLElement).innerHTML = "";
    this.enableActiveJobInputs();
  }

  displayPromptHistory(promptHistory: PromptEvent[]) {
    let responses = "";
    for (let i = 0; i < promptHistory.length; i++) {
      const { response } = promptHistory[i];
      if (response) {
        if (response.html.modifiers) {
          responses += createElement(response.html.name as HtmlElementModifiable, response.html.modifiers);
        } else {
          responses += elements[response.html.name];
        }
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
      const job = createElement("elementCompleted", {
        NAME: completedJobs[i].name,
        STATUS: completedJobs[i].status === "rewarded" ? "Rewarded" : "Get rewarded",
      });
      this.completedJobs.innerHTML += job;
    }
  }

  displayCompleted() {
    // ...
    this.disableActiveJobInputs();
    this.activeJob.draggable = true;
  }
}

export { View };
