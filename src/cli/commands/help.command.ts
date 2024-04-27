/* eslint-disable indent */
import { ICommand } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements ICommand {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
    ${chalk.bgMagenta('Программа для подготовки данных для REST API сервера.')}
        Пример:
            cli.js ${chalk.green('--<command>')} ${chalk.blue('[--arguments]')}
        Команды:
            ${chalk.green(
              '--version'
            )}:                   # выводит номер версии
            ${chalk.green('--help')}:                      # печатает этот текст
            ${chalk.green('--import')} ${chalk.blue(
      '<path>'
    )}:             # импортирует данные из TSV
            ${chalk.green('--generate')} ${chalk.blue(
      '<n> <path> <url>'
    )}: # генерирует произвольное количество тестовых данных
    `);
  }
}
