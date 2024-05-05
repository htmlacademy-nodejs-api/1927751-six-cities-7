export function generateRandomNumber(
  min: number,
  max: number,
  numAfterDigit = 0
) {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomNumber(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomNumber(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomNumber(0, items.length - 1)];
}

export function generateRandomBoolean(): boolean {
  return !!Math.round(Math.random());
}

export function generateRandomString(length: number = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
