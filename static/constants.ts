const DEMO_SELECTOR = "demo";
const IDLE_JOBS_SELECTOR = "#idle-jobs__container";
const ACTIVE_JOB_SELECTOR = "#active-job";
const COMPLETED_JOBS_SELECTOR = "#completed-jobs";
const PROMPT_INPUT_SELECTOR = ".active-job__prompt-input";
const PROMPT_INPUT_PROMPTS_SELECTOR = "#active-job__prompt-input__prompts";
const PROMPT_RESPONSE_SELECTOR = "#active-job__prompt-response";
const ACTIVE_JOB_DESCRIPTION_SELECTOR = "#active-job__description";
const ACTIVE_JOB_TITLE_SELECTOR = "#active-job__title";
const DROPZONE_ACTIVE = "dropzone-active";

const DEMO_JOB1_TITLE = "Sample Job";
const DEMO_JOB1_DESCRIPTION = `
    <p>Welcome. This is a simple intro job.</p>
    <p>You can complete it by setting your wallet address, and starting the job.</p>
    <p>Hint:</p>
    <ol>
        <li> type /wallet {YOUR_WALLET}) </li>
        <li> type /start</li>
    </ol>
`;
const DEMO_JOB1_PRICING = 1200;
const DEMO_JOB1_TIME = "<1 Week";
const DEMO_JOB1_PRIORITY = "3 (High)";

const DEMO_JOB2_TITLE = "Easy job";
const DEMO_JOB2_DESCRIPTION = `
    <p>Congrats! You started your first task. Drag it to the completed jobs to CLAIM your reward.</p>
`;
const DEMO_JOB2_PRICING = 100;
const DEMO_JOB2_TIME = "<1 Hour";
const DEMO_JOB2_PRIORITY = "4 (Urgent)";

export {
  DEMO_SELECTOR,
  IDLE_JOBS_SELECTOR,
  ACTIVE_JOB_SELECTOR,
  COMPLETED_JOBS_SELECTOR,
  PROMPT_INPUT_SELECTOR,
  PROMPT_RESPONSE_SELECTOR,
  DEMO_JOB1_DESCRIPTION,
  DEMO_JOB1_TITLE,
  DEMO_JOB1_PRICING,
  DEMO_JOB1_TIME,
  DEMO_JOB1_PRIORITY,
  DEMO_JOB2_DESCRIPTION,
  DEMO_JOB2_TITLE,
  DEMO_JOB2_PRICING,
  DEMO_JOB2_TIME,
  DEMO_JOB2_PRIORITY,
  ACTIVE_JOB_DESCRIPTION_SELECTOR,
  ACTIVE_JOB_TITLE_SELECTOR,
  DROPZONE_ACTIVE,
  PROMPT_INPUT_PROMPTS_SELECTOR,
};
