type Command = "help" | "start" | "stop" | "wallet";

type Status = "idle" | "selected" | "in_progress" | "stopped" | "completed" | "rewarded";

type PromptEvent = {
  timestamp: Date;
  command: Command;
  response: PromptResponse | undefined;
  status: "submitted" | "in_progress" | "responded" | "rejected";
};

type Notification = {
  title: string;
  description: string;
};

type PromptResponse = {
  title: string;
  html: string;
};

type User = {
  address: string | null;
};

type JobTime = "<1 Week" | "<1 Day" | "<4 Hours" | "<2 Hours" | "<1 Hour";
type JobPriority = 1 | 2 | 3 | 4;

export { Command, Status, PromptEvent, Notification, PromptResponse, User, JobTime, JobPriority };
