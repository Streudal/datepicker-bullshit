import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';

const nativeJsISOFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
const timezoneMap: Record<string, any> = {
  'America/New_York': {
    timeZoneShortCode: 'EST',
    timeZoneString: 'America/New_York',
    utcOffset: 4
  },
  'America/Chicago': {
    timeZoneShortCode: 'CST',
    timeZoneString: 'America/Chicago',
    utcOffset: 5
  },
  'America/Denver': {
    timeZoneShortCode: 'MDT',
    timeZoneString: 'America/Denver',
    utcOffset: 6
  },
  'America/Los_Angeles': {
    timeZoneShortCode: 'PDT',
    timeZoneString: 'America/Los_Angeles',
    utcOffset: 7
  },
}

const getFakeDbDate = (): Date => {
  const fakeDbDate = localStorage.getItem('fake-db-date');

  return fakeDbDate ? new Date(fakeDbDate) : new Date();
}

const getFakeDbTimezone = (): string => {
  const fakeDbTimezone = localStorage.getItem('fake-db-timezone');

  return fakeDbTimezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const clearFakeDb = () => {
  localStorage.removeItem('fake-db-date');
  localStorage.removeItem('fake-db-timezone');
}

export default function Datefns() {
  const [date, setDate] = useState<Date>(getFakeDbDate());
  const [timeZone, setTimeZone] = useState<string>(getFakeDbTimezone());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const selectedDatetimeInSelectedTimezone = new TZDate(date, timeZone);
      const utcDatetimeString = format(new TZDate(selectedDatetimeInSelectedTimezone, 'UTC'), nativeJsISOFormat);

      setDate(selectedDatetimeInSelectedTimezone);
      localStorage.setItem('fake-db-date', utcDatetimeString);
    }
  }

  const handleTimeZoneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTimeZone = e.currentTarget.value;

    const newDate = date;
    const oldUtcOffset = timezoneMap[timeZone].utcOffset
    const newUtcOffset = timezoneMap[selectedTimeZone].utcOffset
    const utcOffset = newUtcOffset - oldUtcOffset;

    newDate.setHours(newDate.getHours() + utcOffset);

    const adjustedDate = new TZDate(newDate, selectedTimeZone);
    const utcDatetimeString = format(new TZDate(adjustedDate, 'UTC'), nativeJsISOFormat);

    setDate(adjustedDate);
    setTimeZone(selectedTimeZone);
    localStorage.setItem('fake-db-date', utcDatetimeString);
    localStorage.setItem('fake-db-timezone', selectedTimeZone);
  }

  // Translated Native Date object using moment to display in selected date/timezone selection.
  const selectedDate = new TZDate(date, timeZone);

  // Selected date in Moment UTC Date object. Translated to correct UTC based on selected date/timezone instead of current locale. Can't use above because moment is mutable by design and must clone before doing more on it.
  const utcSelectedDate = new TZDate(selectedDate, 'UTC');

  return (
    <>
      <button className='mb-8' onClick={clearFakeDb}>Clear Fake DB</button>
      <div className='flex flex-row gap-8 justify-center'>
        <div>
          <h2 className='text-lg' title='Pulled from local storage, if exists. Otherwise, gets current date.'>DatetimePicker</h2>
          <DatePicker
            id="enddateTime"
            title='Pulled from local storage, if exists. Otherwise, gets current date.'
            selected={selectedDate}
            popperClassName="calendarPopper"
            aria-labelledby="enddateTimeLabel"
            dateFormat="MM/dd/yyyy HH:mm"
            timeFormat="HH:mm"
            timeIntervals={15}
            todayButton="Today"
            showMonthDropdown
            showYearDropdown
            showTimeSelect
            dropdownMode="select"
            // minDate={new Date(noticeDetails.startDate)}
            // showIcon
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          // customInput={<CalendarEndInput />}
          />
        </div>
        <div>
          <h2 className='text-lg' title='Pulled from local storage, if exists. Otherwise, gets current timezone.'>Timezone</h2>
          <select
            title='Pulled from local storage, if exists. Otherwise, gets current timezone.'
            value={timeZone}
            onChange={handleTimeZoneChange}
          >
            {Object.entries(timezoneMap).map(([timeZoneString, timeZoneDetails]) => (
              <option key={timeZoneDetails.timeZoneString} value={timeZoneDetails.timeZoneString}>
                {timeZoneDetails.timeZoneShortCode}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex flex-col gap-4 py-8 items-center justify-center'>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>Selected Datetime</span>
            {selectedDate.toISOString()}
          </p>
        </div>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>UTC Datetime (date-fns)</span>
            {utcSelectedDate.toISOString()}
          </p>
        </div>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>UTC Datetime (Native)</span>
            {utcSelectedDate.toISOString()}
          </p>
        </div>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>UTC Datetime (Native) back into Selected Datetime</span>
            {selectedDate.toISOString()}
          </p>
        </div>
      </div>
    </>
  )
}
