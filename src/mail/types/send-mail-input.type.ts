export type SendMailInput = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  htmlInput?: Record<string, any>;
};
