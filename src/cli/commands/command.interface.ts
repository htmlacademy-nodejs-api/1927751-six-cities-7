export interface ICommand {
  getName(): string;
  execute(...parameters: string[]): Promise<void>;
}
