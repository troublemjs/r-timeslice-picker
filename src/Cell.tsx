import * as React from 'react'
import classnames from 'classnames';
import { useContext } from 'react';
import TimeslicePickerContext from './context/TimeslicePickerContext';

interface CellProps extends React.HtmlHTMLAttributes<HTMLLIElement> {
  moving: boolean;
  actived: boolean;
  value: number;
}

const Cell: React.FC<CellProps> = (props) => {
  const { moving, actived, value } = props;
  const { prefixCls } = useContext(TimeslicePickerContext);

  const classname = classnames(`${prefixCls}__cell`, {
    [`${prefixCls}__cell--moving`]: moving,
    [`${prefixCls}__cell--actived`]: actived,
  });
  return <li data-value={value} className={classname} />;
};

export default Cell;
