/**
 * title: 基础 Row
 * desc: 演示 Row 组件的基础示例 <br /> 已选中再选则为反选 <br /> 拖动选择，右键取消整行选中
 */

import React from 'react';
import { Row } from 'r-timeslice-picker';

import '../../assets/row.less';

export default () => <Row label={<div>24小时</div>} showData />;
