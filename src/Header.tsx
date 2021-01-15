import * as React from 'react'
import classnames from 'classnames';
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRef } from 'react';
import { fromEvent, iif, of } from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';
import TimeslicePickerContext from './context/TimeslicePickerContext';
import {
  createArrayFromRange,
  getAttrbuteFromEvent,
  HOURS,
  isMoving,
} from './utils';

interface HeaderProps {
  description?: ReactNode | ReactNode[];
  onMoveEnd?: (range: number[]) => void;
}

const Header: React.FC<HeaderProps> = ({ description, onMoveEnd }) => {
  const { prefixCls, isWeek } = useContext(TimeslicePickerContext);
  const ref = useRef<HTMLUListElement>();
  const [moveRange, setMoveRange] = useState<number[]>([]);

  const onEnd = useCallback(
    (range: number[]) => {
      const currentValues = createArrayFromRange(range);
      setMoveRange(() => []);
      onMoveEnd?.(currentValues);
    },
    [onMoveEnd],
  );

  useEffect(() => {
    const mouseDown$ = fromEvent(ref.current, 'mousedown')
      .pipe(
        tap((e) => e.preventDefault()),
        switchMap((startEvent) =>
          fromEvent(document, 'mousemove').pipe(
            throttleTime(100),
            mergeMap((moveEvent) =>
              iif(
                () =>
                  (moveEvent.target as Element).parentElement === ref.current,
                of([startEvent, moveEvent]).pipe(
                  map((events) =>
                    events.map((e) => Number(getAttrbuteFromEvent(e))),
                  ),
                ),
                of([]),
              ),
            ),
            takeUntil(
              fromEvent(document, 'mouseup').pipe(
                map((endEvent) =>
                  [startEvent, endEvent].map((e) =>
                    Number(getAttrbuteFromEvent(e)),
                  ),
                ),
                tap(onEnd),
              ),
            ),
          ),
        ),
      )
      .subscribe(
        (values) => {
          // console.log('ret: ', values);
          setMoveRange(() => values);
        },
        (err) => {
          console.log('err', err);
        },
      );

    return () => {
      mouseDown$.unsubscribe();
    };
  }, [onEnd]);

  const descriptionNode = description || (
    <ul>
      <li>00:00 - 12:00</li>
      <li>12:00 - 24:00</li>
    </ul>
  );

  return (
    <div className={`${prefixCls}-header`}>
      {isWeek && <div className={`${prefixCls}-header-label`}>星期/时间</div>}
      <div className={`${prefixCls}-header-content`}>
        {descriptionNode}
        <ul
          ref={ref}
          className={`${prefixCls}-header-content-hours`}
          title="拖动我，按列选中"
        >
          {HOURS.map((value) => {
            const moving = isMoving(value, moveRange);
            const classname = classnames({
              [`${prefixCls}-header-content-hours--moving`]: moving,
            });
            return (
              <li key={value} data-value={value} className={classname}>
                {value + 1}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Header;
