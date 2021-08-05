import * as React from 'react';
import classnames from 'classnames';

interface CellProps extends React.HtmlHTMLAttributes<HTMLLIElement> {
  moving: boolean;
  actived: boolean;
  prefixCls?: string;
}

const Cell: React.FC<CellProps> = (props) => {
  const { moving, actived, prefixCls, children, ...restProps } = props;

  const classname = classnames(`${prefixCls}__cell`, {
    [`${prefixCls}__cell--moving`]: moving,
    [`${prefixCls}__cell--actived`]: actived,
  });
  return (
    <li className={classname} {...restProps}>
      {children}
    </li>
  );
};

export default Cell;
