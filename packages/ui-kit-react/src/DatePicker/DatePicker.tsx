import React, { useState, forwardRef } from 'react';
import styled from '@emotion/styled';
import ReactDatePicker, {
  CalendarContainer,
  registerLocale,
} from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css'; TODO: should import from here but test fail ("Jest failed to parse a file"). That's why moved this file to current folder

import './react-datepicker.css';
import { enGB } from 'date-fns/locale';
import { getYear, format } from 'date-fns';

import Input from '../Input';
import IconButton from '../IconButton';
import { UAngleRight, UAngleLeft, UCalendarAlt, UTimes } from 'unicons';

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

const DataPickerWrapper = styled.div<{ isFilter?: boolean }>`
  .react-datepicker__close-icon {
    display: none;
    visibility: hidden;
  }

  &:hover {
    i > div {
      color: ${({ isFilter, theme }) => isFilter && theme.colors.white};
    }
    input {
      color: ${({ isFilter, theme }) => isFilter && theme.colors.white};
      background-color: ${({ isFilter, theme }) =>
        isFilter && theme.colors.black};
    }
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey2};
  padding: 16px 24px;
  height: 48px;
  box-sizing: border-box;
`;

const HeaderDate = styled.span`
  margin-right: 8px;
  cursor: pointer;
`;

const InputIcon = styled.div<{ selected?: Date | null }>`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  margin-right: 14px;
  color: ${({ theme, selected }) =>
    selected ? theme.colors.black : theme.colors.lightGrey1};
`;

const MyContainer = ({ children }: { children: any }) => {
  return <StyledCalendarContainer>{children}</StyledCalendarContainer>;
};

type DatePickerProps = {
  placeholder?: string;
  date?: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  required?: boolean;
  error?: string;
  isInvalid?: boolean;
  isClearable?: boolean;
  isFilter?: boolean;
};

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      placeholder,
      date,
      onChange,
      className,
      minDate,
      maxDate,
      dateFormat = 'dd.MM.yyyy',
      required,
      isClearable,
      error,
      isInvalid,
      isFilter,
      ...props
    },
    ref
  ) => {
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const { startPeriod, endPeriod } = getYearsPeriod(date || new Date());

    return (
      <DataPickerWrapper isFilter={isFilter}>
        <ReactDatePicker
          className={className}
          selected={date}
          onChange={onChange}
          required={required}
          isClearable={isClearable}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          customInput={
            <Input
              required={required}
              ref={ref}
              error={error}
              isInvalid={isInvalid}
              isFilter={isFilter}
              renderAddonIcon={() => {
                if (date && isClearable)
                  return (
                    isFilter && (
                      <InputIcon selected={date}>
                        <UTimes
                          width={24}
                          height={24}
                          onClick={() => onChange(null)}
                          aria-label="Close"
                          tabIndex={-1}
                        />
                      </InputIcon>
                    )
                  );

                return (
                  <InputIcon
                    /** onMouseDown and onClick are needed for proper opening when user is clicking on icon */
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (ref !== document.activeElement) {
                        // TODO fix focus
                        // ref?.focus();
                      }
                    }}
                  >
                    <UCalendarAlt width={20} height={20} />
                  </InputIcon>
                );
              }}
              {...props}
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
              <IconButton
                onClick={
                  !showMonthYearPicker && !showYearPicker
                    ? decreaseMonth
                    : decreaseYear
                }
                color="grey"
              >
                <UAngleLeft />
              </IconButton>
              <>
                {!showMonthYearPicker && !showYearPicker && (
                  <HeaderDate
                    onClick={() => setShowMonthYearPicker((value) => !value)}
                  >
                    {format(date, 'MMMM')}
                  </HeaderDate>
                )}
                {!showYearPicker && (
                  <HeaderDate
                    onClick={() => setShowYearPicker((value) => !value)}
                  >
                    {` ${date.getFullYear()}`}
                  </HeaderDate>
                )}
                {showYearPicker ? `${startPeriod} - ${endPeriod}` : null}
              </>
              <IconButton
                onClick={
                  !showMonthYearPicker && !showYearPicker
                    ? increaseMonth
                    : increaseYear
                }
                color="grey"
              >
                <UAngleRight />
              </IconButton>
            </HeaderWrapper>
          )}
        />
      </DataPickerWrapper>
    );
  }
);

export default DatePicker;
