import { COMPLETED_JOBS_SELECTOR, DROPZONE_ACTIVE } from "./constants";
import { Job } from "./main";

const completedJobs = document.querySelector(COMPLETED_JOBS_SELECTOR) as HTMLElement;

// Drag events
export function allowDrop(ev: DragEvent) {
  ev.preventDefault();
}

export function drop(ev: DragEvent, job: Job) {
  ev.preventDefault();

  const lastCompletedJob = completedJobs.lastElementChild;
  if (!lastCompletedJob) {
    return;
  }
  lastCompletedJob.classList.remove(DROPZONE_ACTIVE);
  lastCompletedJob.innerHTML = `<p>${job.name}</p> <button>Get Reward</button>`;

  const newLastJob = document.createElement("div");
  newLastJob.className = "completed-jobs__job";

  completedJobs.appendChild(newLastJob);
}

export function drag(ev: DragEvent) {
  ev.dataTransfer?.setData("text", (ev.target as HTMLTextAreaElement)?.id);
}

export function dragover(ev: DragEvent) {
  ev.preventDefault();
  // Highlight drop zone
  const lastCompletedJob = completedJobs.lastElementChild;
  if (!lastCompletedJob) {
    return;
  }
  lastCompletedJob.classList.add(DROPZONE_ACTIVE);
}

export function dragleave(ev: DragEvent) {
  ev.preventDefault();
  // Highlight drop zone
  const lastCompletedJob = completedJobs.lastElementChild;
  if (!lastCompletedJob) {
    return;
  }
  lastCompletedJob.classList.remove(DROPZONE_ACTIVE);
}
