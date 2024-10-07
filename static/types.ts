import { Demo } from "./main";

type Command = "help" | "start" | "stop" | "wallet";

type Status = "idle" | "selected" | "in_progress" | "stopped" | "completed" | "rewarded";

type PromptEvent = {
  timestamp: Date;
  command?: Command;
  response: PromptResponse | undefined;
  status: "submitted" | "in_progress" | "responded" | "rejected" | "completed";
};

type CallbackFn = (demo: Demo, evt?: PromptEvent) => boolean;

type PromptResponse = {
  title: string;
  html: {
    name: HtmlElement | HtmlElementModifiable;
    modifiers?: { [key: string]: string };
  };
};

type User = {
  address: string | null;
};

type JobTime = "<1 Week" | "<1 Day" | "<4 Hours" | "<2 Hours" | "<1 Hour";
type JobPriority = "1 (Normal)" | "2 (Medium)" | "3 (High)" | "4 (Urgent)";

type HtmlElementModifiable = "elementIdle" | "elementCompleted" | "elementPromptStart";
type HtmlElement =
  | "elementPromptHelp"
  | "elementPromptWalletRegistration"
  | "elementPromptInvalid"
  | "elementPromptWalletSuccess"
  | "elementPromptStart"
  | "elementPromptCompleted"
  | "elementPromptWalletWarning";

export { Command, Status, PromptEvent, PromptResponse, User, JobTime, JobPriority, HtmlElement, HtmlElementModifiable, CallbackFn };
