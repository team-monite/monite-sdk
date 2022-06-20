import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ReactDatePicker, {
  CalendarContainer,
  registerLocale,
} from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css'; TODO: should import from here but test fail ("Jest failed to parse a file"). That's why moved this file to current folder

import './react-datepicker.css';
import { enGB } from 'date-fns/locale';
import { getYear, format } from 'date-fns';

import Input from '../Input';
import Button from '../Button';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '../Icons';

const DEFAULT_YEAR_ITEM_NUMBER = 12;

function getYearsPeriod(date: Date, yearItemNumber = DEFAULT_YEAR_ITEM_NUMBER) {
  const endPeriod = Math.ceil(getYear(date) / yearItemNumber) * yearItemNumber;
  const startPeriod = endPeriod - (yearItemNumber - 1);
  return { startPeriod, endPeriod };
}

registerLocale('en-GB', enGB);

const StyledCalendarContainer = styled(CalendarContainer)`
  font-family: 'Faktum', system-ui;

  > div {
    box-shadow: 0 6px 16px rgba(15, 15, 15, 0.12);
    border-radius: 12px;
    width: 280px;
    max-width: 280px;
    min-height: 276px;
    background: white;
  }

  .react-datepicker__header {
    background: white;
    border: none;
    padding: 0;
    height: 48px;
  }

  .react-datepicker__month {
    margin: 40px 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .react-datepicker__monthPicker {
    margin: 16px 0 0 10px;
  }

  .react-datepicker__year {
    margin: 0;
  }

  .react-datepicker__year-wrapper {
    max-width: 280px;
    margin-top: 16px;
    margin-left: 10px;
  }

  .react-datepicker__current-month {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    padding: 12px 0;
  }

  .react-datepicker__day-name {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #a6abb7;
    margin: 4px 4px 0 0;

    &:not(:last-child) {
      margin-right: 4px;
    }
  }

  .react-datepicker__month-text,
  .react-datepicker__year-text {
    width: 72px;
    height: 36px;
    line-height: 36px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 16px;
    border-radius: 8px;
    margin-right: 16px
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__year-text--selected {
    background: ${({ theme }) => theme.colors.primary};
  }

  .react-datepicker__day--today,
  .react-datepicker__month-text--today,
  .react-datepicker__year-text--today,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background: none;
    color: #000;
    font-weight: normal
  }
}

.day {
  border-radius: 50%;
  margin: 0 4px 4px 0;
  width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;

  &:not(:last-child) {
    margin-right: 4px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey2};
  padding: 16px 24px;
  height: 48px;
`;

const HeaderDate = styled.span`
  margin-right: 8px;
  cursor: pointer;
`;

const InputIcon = styled.div`
  margin-top: 16px;
  margin-right: 16px;
`;

const MyContainer = ({ children }: { children: any }) => {
  return <StyledCalendarContainer>{children}</StyledCalendarContainer>;
};

type DatePickerProps = {
  date?: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
};

const DatePicker = ({
  date,
  onChange,
  className,
  minDate,
  maxDate,
  dateFormat = 'dd.MM.yyyy',
}: DatePickerProps) => {
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const { startPeriod, endPeriod } = getYearsPeriod(date || new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <ReactDatePicker
      className={className}
      selected={date}
      onChange={(date) => date && onChange(date)}
      required
      minDate={minDate}
      maxDate={maxDate}
      customInput={
        <Input
          inputRef={inputRef}
          renderAddonIcon={() => (
            <InputIcon
              /** onMouseDown and onClick are needed for proper opening when user is clicking on icon */
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (inputRef.current !== document.activeElement) {
                  inputRef.current?.focus();
                }
              }}
            >
              <CalendarIcon color="#B8B8B8" width={16} height={16} />
            </InputIcon>
          )}
        />
      }
      calendarContainer={MyContainer}
      dayClassName={() => 'day'}
      locale={'en-GB'}
      dateFormat={dateFormat}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      shouldCloseOnSelect={!(showMonthYearPicker || showYearPicker)}
      onCalendarClose={() => {
        setShowMonthYearPicker(false);
        setShowYearPicker(false);
      }}
      onSelect={() => {
        if (showMonthYearPicker) {
          setShowMonthYearPicker(false);
        }

        if (showYearPicker) {
          setShowYearPicker(false);
        }
      }}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        decreaseYear,
        increaseYear,
      }) => (
        <HeaderWrapper>
          <Button
            onClick={
              !showMonthYearPicker && !showYearPicker
                ? decreaseMonth
                : decreaseYear
            }
            icon={<ArrowLeftIcon />}
            type="button"
            noPadding
            color="grey"
          />
          <>
            {!showMonthYearPicker && !showYearPicker && (
              <HeaderDate
                onClick={() => setShowMonthYearPicker((value) => !value)}
              >
                {format(date, 'MMMM')}
              </HeaderDate>
            )}
            {!showYearPicker && (
              <HeaderDate onClick={() => setShowYearPicker((value) => !value)}>
                {` ${date.getFullYear()}`}
              </HeaderDate>
            )}
            {showYearPicker ? `${startPeriod} - ${endPeriod}` : null}
          </>
          <Button
            onClick={
              !showMonthYearPicker && !showYearPicker
                ? increaseMonth
                : increaseYear
            }
            icon={<ArrowRightIcon />}
            type="button"
            noPadding
            color="grey"
          />
        </HeaderWrapper>
      )}
    />
  );
};

export default DatePicker;
