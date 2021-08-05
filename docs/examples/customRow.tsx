/**
 * title: 自定义使用 Row
 * desc: dataSource 传入 字符串数组 类型
 */

import React from 'react';
import { Row } from 'r-timeslice-picker';

import '../../assets/row.less';

const dataSource = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

export default () => (
  <Row
    label={<div style={{ padding: '1em' }}>自定义使用</div>}
    dataSource={dataSource}
    showData
    beforeClear={(done) => {
      const yes = confirm('是否清除当前所有已选中？');
      if (yes) {
        done();
      }
    }}
  />
);
