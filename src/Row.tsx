import * as React from 'react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { fromEvent, iif, of } from 'rxjs';
import {
  map,
  switchMap,
  takeUntil,
  throttleTime,
  tap,
  mergeMap,
  filter,
} from 'rxjs/operators';

import Cell from './Cell';
import { isMoving, range, sortByDataSource } from './utils';
import { HOURS, LEFT_BTN_CODE } from './constants';

interface IHandleEvent extends Event {
  target: Element;
}
const getAttr = (attr: string, e: IHandleEvent) => e.target.getAttribute(attr);
const getEventIdx = (e: Event) =>
  Number(getAttr('data-idx', e as IHandleEvent));
// const getEventValue = (e: Event) => {
//   const target = e.target as Element;
//   return Number(target.getAttribute('data-value'));
// };

function fixControlledValue<T>(value: T): T | T[] {
  if (typeof value === 'undefined' || value === null) return [];
  return value;
}

type ValueType = React.ReactText;
interface RowProps
  extends Omit<
    React.HtmlHTMLAttributes<HTMLDivElement | HTMLUListElement>,
    'defaultValue' | 'onChange'
  > {
  prefixCls?: string;
  /** 每个行的标注 */
  label?: string | ReactNode;
  /**
   * 显示在每个 cell 中的数据源，值要唯一
   * @default `HOURS`
   */
  dataSource?: ValueType[];
  defaultValue?: ValueType[];
  value?: ValueType[];
  /** 值变化时触发 */
  onChange?: (valueList: ValueType[], indexList?: number[]) => void;
  /**
   * 清除当前已选中的回调
   * @param [VoidFunction] reset - 完成后执行重置
   * @description `onContextMenu`执行，改为清除已选中的方法
   */
  beforeClear?: (reset: VoidFunction) => void;
  /** 是否在 cell 中显示 dataSource 中的数据 */
  showData?: boolean;
}

// TODO: Row 无参传入时，没有高度问题

const Row: React.FC<RowProps> = (props) => {
  const {
    prefixCls,
    label,
    dataSource,
    defaultValue,
    value,
    onChange,
    beforeClear,
    showData,
    className,
    ...restProps
  } = props;

  const [within, setWithin] = useState(false);
  const [moveRange, setMoveRange] = useState<[number, number]>();
  const [resultValues, setResultValues] = useState<ValueType[]>(
    typeof value === 'undefined' ? defaultValue : value,
  );
  const cacheState = useRef<string>(fixControlledValue(resultValues).join());
  const ref = useRef<HTMLUListElement>();

  const onEnd = useCallback(
    (vals: number[]) => {
      const idxRange = vals as [number, number];
      // console.log('onEnd range:', idxRange);
      const oldVals = [...(resultValues ?? [])];
      // const curSelectedVals = createArrayFromRange(idxRange);
      const idxs = range(idxRange);
      const curSelectedVals = dataSource?.filter((...[, idx]) =>
        idxs.includes(idx),
      );

      // 交集
      const intersection = curSelectedVals.filter((x) => oldVals?.includes(x));
      // 差集
      const difference = curSelectedVals.filter((x) => !oldVals?.includes(x));

      const disorderVals = oldVals
        .concat(difference)
        .filter((x) => !intersection.includes(x));
      const ret = sortByDataSource(dataSource, disorderVals);

      // value 有值时组件为可控组件
      if (value === undefined) {
        setResultValues(ret);
      }

      onChange?.(ret, idxs);
      setWithin(false);
      setMoveRange(undefined);
    },
    [onChange, resultValues, value],
  );

  useEffect(() => {
    const mouseDown$ = fromEvent(ref.current, 'mousedown')
      .pipe(
        filter((e) => {
          const code = (e as MouseEvent).button;
          return code === LEFT_BTN_CODE;
        }),
        // tap((x) => {
        //   console.log(`start: ${x}`);
        // }),
        switchMap((startEvent) =>
          fromEvent(document, 'mousemove').pipe(
            throttleTime(50),
            mergeMap((moveEvent) =>
              iif(
                () =>
                  (moveEvent.target as Element).parentElement === ref.current,
                of([startEvent, moveEvent]).pipe(
                  map((events) => events.map(getEventIdx)),
                ),
                of([]),
              ),
            ),
            takeUntil(
              fromEvent(document, 'mouseup').pipe(
                map((endEvent) => [startEvent, endEvent].map(getEventIdx)),
                tap(onEnd),
              ),
            ),
          ),
        ),
      )
      .subscribe(
        (range) => {
          // console.log('ret: ', range);
          setWithin(() => Boolean(range.length));
          setMoveRange(range as [number, number]);
        },
        (err) => {
          console.log('err', err);
        },
      );

    return () => {
      mouseDown$.unsubscribe();
    };
  }, [onEnd]);

  useEffect(() => {
    const cacheStr = fixControlledValue(value).join();
    if (cacheState.current !== cacheStr) {
      setResultValues(() => value);
      cacheState.current = cacheStr;
    }
  }, [value]);

  const resetResultValues = () => {
    setResultValues([]);
    onChange?.([], []);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resultValues?.length) return;

    if (typeof beforeClear === 'function') {
      beforeClear(resetResultValues);
    } else {
      resetResultValues();
    }
  };

  const classNames = classnames(`${prefixCls}-row`, className, {
    [`${prefixCls}-row--moving`]: within,
  });
  const contentProps = { className: classNames };
  Object.assign(
    contentProps,
    label
      ? {
          className: `${prefixCls}-row-content`,
        }
      : restProps,
  );

  const contentNode = (
    <ul ref={ref} onContextMenu={onContextMenu} {...contentProps}>
      {dataSource?.map((val, idx) => {
        const moving = isMoving(idx, moveRange);
        const actived = resultValues?.includes(val);

        return (
          <Cell
            key={val}
            prefixCls={prefixCls}
            data-idx={idx}
            actived={actived}
            moving={moving}
          >
            {showData && val}
          </Cell>
        );
      })}
    </ul>
  );
  if (!label) return contentNode;

  return (
    <div className={classNames} {...restProps}>
      <div className={`${prefixCls}-row-label`}>{label}</div>
      {contentNode}
    </div>
  );
};

Row.defaultProps = {
  prefixCls: 'timeslice',
  // showData: true,
  dataSource: HOURS,
};

export default Row;
