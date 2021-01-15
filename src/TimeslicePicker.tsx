import * as React from 'react'
import { ReactNode, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import Row from './Row';
import Header from './Header';
import TimeslicePickerContext from './context/TimeslicePickerContext';

import { createNewValues, WEEKS } from './utils';
import { TimesliceValue } from './interface';
import './style/index.less';

/** 修复赋值数据 */
function fixControlledValue(value: TimesliceValue, idx: number): number[] {
  if (typeof value === 'undefined' || value === null) return [];
  return value[idx] || [];
}

// TODO: weeks 参数名修改，语义不符合，weeks 是多个周的含义
interface TimeslicePickerProps {
  weeks?: React.ReactText[];
  footer?: ReactNode;
  defaultValue?: TimesliceValue;
  value?: TimesliceValue;
  onChange?: (value: TimesliceValue) => void;
}

const TimeslicePicker: React.FC<TimeslicePickerProps> = (props) => {
  const { weeks, footer, defaultValue, value, onChange } = props;
  // const value = useRef<number[] | number[][]>();
  const cacheState = useRef<string>(JSON.stringify(value));
  const [currentValue, setCurrentValue] = useState(
    typeof value === 'undefined' ? defaultValue : value,
  );
  const [_v, _setv] = useState<number[]>([2, 5]);

  useEffect(() => {
    const cacheStr = JSON.stringify(value);
    if (cacheState.current !== cacheStr) {
      setCurrentValue(value);
      cacheState.current = cacheStr;
    }
  }, [value]);

  const prefixCls = classnames('timeslice');
  const currentWeeks = weeks || [];
  const isWeek = currentWeeks.length > 0;

  const handleHeaderChange = (headerValue: number[]) => {
    const len = currentWeeks?.length;
    if (!len) return;

    const newCurrentValue = { ...currentValue } || {};
    for (let i = 0; i < len; i++) {
      const newItem = createNewValues(newCurrentValue[i], headerValue);
      newCurrentValue[i] = newItem;
    }
    if (value === undefined) {
      setCurrentValue(newCurrentValue);
    }

    onChange?.(newCurrentValue);
  };

  const handleChange = (val: number[], idx: number) => {
    const newCurrentValue = {
      ...currentValue,
      [idx]: val,
    };
    if (val?.length === 0) {
      Reflect.deleteProperty(newCurrentValue, idx);
    }
    if (value === undefined) {
      setCurrentValue(newCurrentValue);
    }

    onChange?.(newCurrentValue);
  };

  const content = currentWeeks.length ? (
    currentWeeks.map((w, idx) => (
      <Row
        key={w}
        label={w}
        // value={currentValue ? currentValue[idx] || [] : []}
        value={fixControlledValue(currentValue, idx)}
        // value={[2, 4]}
        onChange={(v) => handleChange(v, idx)}
      />
    ))
  ) : (
    <Row
      value={_v}
      onChange={(value) => {
        // console.log(value);
        _setv(value);
      }}
    />
  );

  return (
    <div className={`${prefixCls}__wrap`}>
      <TimeslicePickerContext.Provider
        value={{ isWeek, prefixCls }}
      >
        <Header onMoveEnd={handleHeaderChange} />
        {content}
      </TimeslicePickerContext.Provider>
      <div className={`${prefixCls}-footer`}>
        {footer || 'tips：鼠标拖动选择、点击选择或取消、右击取消整行'}
      </div>
    </div>
  );
};

TimeslicePicker.defaultProps = {
  weeks: WEEKS,
  // weeks: [],
};

export default TimeslicePicker;
