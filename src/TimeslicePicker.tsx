import React, { ReactNode, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import Row from './Row';
import Header from './Header';

import { sortByDataSource } from './utils';
import { HOURS, DAY_LIST } from './constants';
import { ITimesliceValue } from './types';

/** 修复赋值数据 */
function fixControlledValue(
  value: ITimesliceValue,
  idx: number,
): ITimesliceValue[keyof ITimesliceValue] {
  if (typeof value === 'undefined' || value === null) return [];
  return value[idx] || [];
}

interface PickerProps
  extends Omit<
    React.HtmlHTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
  /**
   * @description 天集合的数据源
   * @default `DAY_LIST`
   */
  dayList?: React.ReactText[];
  /** 显示在头部的元素 */
  header?: ReactNode;
  /** 头部的元素的类名，不使用定义 header 是有效 */
  headerClassName?: string;
  /** 显示在底部的元素 */
  footer?: ReactNode;
  /** 底部的元素的类名 */
  footerClassName?: string;
  /** 默认值，不可控组件 */
  defaultValue?: ITimesliceValue;
  /** 值，可控组件 */
  value?: ITimesliceValue;
  /** 值变化时触发 */
  onChange?: (value: ITimesliceValue) => void;
}

const Picker: React.FC<PickerProps> = (props) => {
  const {
    dayList,
    header,
    headerClassName,
    footer,
    footerClassName,
    defaultValue,
    value,
    onChange,
    className,
    ...restProps
  } = props;
  const cacheState = useRef<string>(JSON.stringify(value));
  const [currentValue, setCurrentValue] = useState(
    typeof value === 'undefined' ? defaultValue : value,
  );

  useEffect(() => {
    const cacheStr = JSON.stringify(value);
    if (cacheState.current !== cacheStr) {
      setCurrentValue(value);
      cacheState.current = cacheStr;
    }
  }, [value]);

  const prefixCls = classnames('timeslice');
  const curDays = dayList || [];

  const handleHeaderChange = (selectedList: React.ReactText[]) => {
    const len = curDays?.length;
    if (!len) return;

    const newCurrentValue = { ...currentValue } || {};
    for (let i = 0; i < len; i++) {
      // TODO: 处理和 Row 中的 onEnd() 内的冗余代码
      const oldVals = (newCurrentValue[i] as React.ReactText[]) ?? [];
      // 交集
      const intersection = selectedList.filter((x) => oldVals?.includes(x));
      // 差集
      const difference = selectedList.filter((x) => !oldVals?.includes(x));

      const disorderVals = oldVals
        .concat(difference)
        .filter((x) => !intersection.includes(x));
      const newItem = sortByDataSource(HOURS, disorderVals);

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

  const contentNodes = curDays?.map((d, idx) => (
    <Row
      key={d}
      label={d}
      // showData
      value={fixControlledValue(currentValue, idx)}
      onChange={(v) => handleChange(v as number[], idx)}
      // onChange={(list) => console.log(list)}
    />
  ));
  const headerNode = header ?? (
    <Header className={headerClassName} onMoveEnd={handleHeaderChange} />
  );

  return (
    <div className={classnames(`${prefixCls}__wrap`, className)} {...restProps}>
      {headerNode}
      {contentNodes}
      {footer && (
        <div className={classnames(footerClassName, `${prefixCls}-footer`)}>
          {footer}
        </div>
      )}
    </div>
  );
};

Picker.defaultProps = {
  dayList: DAY_LIST,
};

export default Picker;
