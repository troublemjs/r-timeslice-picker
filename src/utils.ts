import React, { ReactText } from 'react';

const min = (ls: number[]) => Math.min(...ls);
const max = (ls: number[]) => Math.max(...ls);

/**
 * 依据 index 判断当前 cell 是否为移动中
 * @param idx
 * @param range
 * @returns boolean
 */
export const isMoving = (idx: number, range: [number, number]): boolean => {
  if (!range) return false;
  return idx >= min(range) && idx <= max(range);
};

export const range = (range: [number, number]): number[] => {
  const minVal = min(range);
  const maxVal = max(range);
  let ret: number[] = [];
  for (let i = minVal; i <= maxVal; i++) {
    ret.push(i);
  }

  return ret;
};

export const sortByDataSource = (
  dataSource: ReactText[],
  list: ReactText[],
): ReactText[] => {
  const map = new Map<number, ReactText>();
  dataSource.forEach((item, idx) => map.set(idx, item));

  const ret: ReactText[] = [];
  dataSource.forEach((item) => {
    if (list.includes(item)) {
      ret.push(item);
    }
  });

  return ret;
};

export const getAttrbuteFromEvent = (
  event: Event,
  name: string = 'data-value',
) => {
  const target = event.target as Element;
  return target.getAttribute(name);
};

export const formatTimeslice = (arr: []) => {
  return '';
};
