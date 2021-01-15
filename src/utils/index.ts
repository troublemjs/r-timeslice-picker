export const isMoving = (value: number, range: number[]): boolean => {
  const min = Math.min(...range);
  const max = Math.max(...range);
  return value >= min && value <= max;
};

export const createArrayFromRange = (range: number[]): number[] => {
  const min = Math.min(...range);
  const max = Math.max(...range);
  const ret = Array(max - min + 1)
    .fill(0)
    .map((...[, idx]) => idx + min);
  return ret;
};

export const createNewValues = <T extends number>(
  oldValues: T[] = [],
  newValues: T[],
): T[] => {
  // 单个时判断是否存在，是否选中
  const single = newValues.length === 1;
  if (single) {
    const [curVal] = newValues;
    const has = oldValues.some((item) => item === curVal);
    if (has) return oldValues.filter((item) => item !== curVal);
  }
  const oldSet = new Set<T>();
  oldValues.forEach((item) => oldSet.add(item));
  const addition = newValues.filter((item) => !oldSet.has(item));

  return [...oldValues, ...addition].sort((a, b) => a - b);
};

export const getAttrbuteFromEvent = (event: Event, name: string = 'data-value') => {
  const target = event.target as Element;
  return target.getAttribute(name);
}

export const HOURS = Array(24)
  .fill(0)
  .map((...[, idx]) => idx);

export const WEEKS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

export const formatTimeslice = (arr: []) => {
  return '';
};
