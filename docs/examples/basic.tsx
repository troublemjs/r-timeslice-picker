/**
 * title: 基础 TimeslicePicker
 * desc: 演示 TimeslicePicker 组件的基础示例
 */

import React, { useState } from 'react';
import TimeslicePicker from 'r-timeslice-picker';

import '../../assets/index.less';
import './basic.less';

const dayList = ['周1', '周2', '周3', '周4', '周5', '周6', '周7'];

export default () => {
  const [customHeader, tglCustomHeader] = useState<boolean>(false);
  const [customDays, tglCustomDays] = useState<boolean>(false);
  return (
    <>
      <input
        id="header"
        type="checkbox"
        onChange={(e) => tglCustomHeader(e.target.checked)}
      />
      <label htmlFor="header">是否使用自定义头部</label>
      <br />
      <input
        id="dayList"
        type="checkbox"
        onChange={(e) => tglCustomDays(e.target.checked)}
      />
      <label htmlFor="dayList">是否使用自定义天集合</label>
      <br />
      <TimeslicePicker
        className="demo-picker"
        header={
          customHeader ? <div className="demo-header">自定义头部</div> : null
        }
        dayList={customDays ? dayList : undefined}
        footerClassName="demo-footer"
        footer="tips：鼠标拖动选择、已选中再选则为反选、右击取消整行"
        onChange={(v) => {
          console.log(v);
        }}
      />
    </>
  );
};
