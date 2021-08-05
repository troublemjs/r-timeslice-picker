import * as React from 'react';
import classnames from 'classnames';
import { ReactNode } from 'react';

import Row from './Row';

interface HeaderProps {
  className?: string;
  label?: ReactNode;
  title?: ReactNode;
  prefixCls?: string;
  onMoveEnd?: (selected: React.ReactText[]) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { className, label, title, prefixCls, onMoveEnd } = props;
  // const [moveVals, setMoveVals] = useState<React.ReactText[]>([]);

  return (
    <div className={classnames(className, `${prefixCls}-header`)}>
      {label && <div className={`${prefixCls}-header-label`}>{label}</div>}
      <div className={`${prefixCls}-header-content`}>
        {title}
        <Row
          showData
          value={[]}
          title="拖动我，按列选中"
          onChange={onMoveEnd}
          className={classnames({
            [`${prefixCls}-row--border-t-0`]: !title,
          })}
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        />
      </div>
    </div>
  );
};

Header.defaultProps = {
  prefixCls: 'timeslice',
  label: '星期/时间',
  title: (
    <ul className="timeslice-header-content-title">
      <li>00:00 - 12:00</li>
      <li>12:00 - 24:00</li>
    </ul>
  ),
};

export default Header;
