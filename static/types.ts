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
  // Contains the markdown response
  md: string;
};

type User = {
  address: string | null;
};

export { Command, Status, PromptEvent, Notification, PromptResponse, User };
