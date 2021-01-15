import React from 'react';

interface TimeslicePickerContextProps {
    prefixCls?: string;
    isWeek?: boolean;
}

const TimeslicePickerContext = React.createContext<TimeslicePickerContextProps>({} as TimeslicePickerContextProps);

export default TimeslicePickerContext;