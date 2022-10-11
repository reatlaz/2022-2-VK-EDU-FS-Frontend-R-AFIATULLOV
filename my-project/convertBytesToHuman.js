/*
 * В этом задании надо разработать функцию
 * `convertBytesToHuman`. Эта функция  должна принимать
 * аргумент `bytes` только числового типа.
 * На выходе функция должна отдать
 * человекопонятную строку, которая будет
 * отражать размер файла. Примеры использования:
 * `convertBytesToHuman(1024) === '1 KB';`
 * `convertBytesToHuman(123123123) === '117.42 MB';`
 * Необходимо предусмотреть защиту от
 * передачи аргументов неправильного типа
 * и класса (например, отрицательные числа)
 */

export default function convertBytesToHuman(bytes) {
  
  if (typeof bytes != 'number') return false;
  if (bytes < 0) return false;

  const units = {0: 'B', 1: 'KB', 2: 'MB', 3: 'GB', 4: 'TB', 5: 'PB'};

  let unitIndex = 0;

  while (bytes >= 1024) {
    bytes = bytes / 1024;
    unitIndex++;
  }

  let decimal = bytes % 1

  if (decimal > 0) {

    bytes = bytes.toFixed(2);

  }
  return bytes + ' ' + units[unitIndex];
}
