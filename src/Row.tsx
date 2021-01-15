import * as React from 'react'
import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  debounceTime,
  buffer,
} from 'rxjs/operators';

import Cell from './Cell';
import {
  createArrayFromRange,
  createNewValues,
  HOURS,
  isMoving,
} from './utils';

const getEventValue = (e: Event) => {
  const target = e.target as Element;
  return Number(target.getAttribute('data-value'));
};

function fixControlledValue<T>(value: T) {
  if (typeof value === 'undefined' || value === null) return [] as T[];
  return value;
}

interface RowProps {
  prefixCls?: string;
  label?: string | ReactNode;
  defaultValue?: number[];
  value?: number[];
  onChange?: (value: number[]) => void;
  /** 清除当前已选中 */
  beforeClear?: (done: VoidFunction) => void;
}

const Row: React.FC<RowProps> = (props) => {
  const { prefixCls, label, defaultValue, value, onChange, beforeClear } = props;
  const [within, setWithin] = useState(false);
  const [moveValues, setMoveValues] = useState<number[]>([]);
  const [resultValues, setResultValues] = useState<number[]>(
    typeof value === 'undefined' ? defaultValue : value,
  );
  const cacheState = useRef<string>(fixControlledValue(resultValues).join());
  const ref = useRef<HTMLUListElement>();

  const onEnd = useCallback(
    (range: number[]) => {
      // console.log('onEnd range:', range);
      const currentValues = createArrayFromRange(range);
      const newResult = createNewValues(resultValues, currentValues);
      // console.log('newResult:', newResult);
      
      if (value === undefined) {
        // setCurrentValue(val);
        setResultValues(newResult);
      }

      onChange?.(newResult);
      setWithin(false);
      setMoveValues([]);
    },
    [onChange, resultValues, value],
  );

  useEffect(() => {
    const mouseDown$ = fromEvent(ref.current, 'mousedown')
      .pipe(
        filter((e) => {
          const LEFT_BUTTON = 0;
          const code = (e as MouseEvent).button;
          return code === LEFT_BUTTON;
        }),
        // tap((x) => {
        //   console.log(`start: ${x}`);
        // }),
        switchMap((startEvent) =>
          fromEvent(document, 'mousemove').pipe(
            throttleTime(100),
            mergeMap((moveEvent) =>
              iif(
                () =>
                  (moveEvent.target as Element).parentElement === ref.current,
                of([startEvent, moveEvent]).pipe(
                  map((events) => events.map(getEventValue)),
                ),
                of([]),
              ),
            ),
            takeUntil(
              fromEvent(document, 'mouseup').pipe(
                map((endEvent) => [startEvent, endEvent].map(getEventValue)),
                tap(onEnd),
              ),
            ),
          ),
        ),
      )
      .subscribe(
        (values) => {
          // console.log('ret: ', values);
          setWithin(() => Boolean(values.length));
          setMoveValues(() => values);
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

  const clearResultValues = () => {
    setResultValues([]);
    onChange?.([]);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resultValues?.length) return;
    
    if (typeof beforeClear === 'function') {
      beforeClear(clearResultValues);
    } else {
      clearResultValues();
    }
  };

  const classname = classnames(`${prefixCls}-row`, {
    [`${prefixCls}-row--moving`]: within,
  });

  const conetntNode = (
    <ul
      className={label ? `${prefixCls}-row-content` : classname}
      ref={ref}
      // onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {HOURS.map((value) => {
        const moving = isMoving(value, moveValues);
        const actived = resultValues?.includes(value);

        return (
          <Cell
            key={value}
            value={value}
            actived={actived}
            moving={moving}
            // onClick={() => {console.log(111)}}
          />
        );
      })}
    </ul>
  );
  if (!label) return conetntNode;

  return (
    <div className={classname}>
      <div className={`${prefixCls}-row-label`}>{label}</div>
      {conetntNode}
    </div>
  );
};

Row.defaultProps = {
  prefixCls: 'timeslice'
}

export default Row;
