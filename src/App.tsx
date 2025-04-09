import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { ChangeEvent, useState } from 'react';
import moment from 'moment-timezone'; // If using moment-timezone, only use this import instead of the regular 'moment' import.
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Load the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const timezoneMap: Record<string, any> = {
  'America/New_York': {
    timeZoneShortCode: 'EST',
    timeZoneString: 'America/New_York',
    offset: 4
  },
  'America/Chicago': {
    timeZoneShortCode: 'CST',
    timeZoneString: 'America/Chicago',
    offset: 5
  },
  'America/Denver': {
    timeZoneShortCode: 'MDT',
    timeZoneString: 'America/Denver',
    offset: 6
  },
  'America/Los_Angeles': {
    timeZoneShortCode: 'PDT',
    timeZoneString: 'America/Los_Angeles',
    offset: 7
  },
  // 'UTC': {
  // timeZoneShortCode: 'UTC',
  // timeZoneString: 'Etc/UTC',
  // offset: 0
  // }
}

// 'YYYY-MM-DDTHH:mm:ss.SSSZ'

function getTimezoneCodeByValue(value: string) {
  return Object.keys(timezoneMap).find((key) => timezoneMap[key] === value);
}

export default function App() {
  const [date, setDate] = useState<Date>(new Date()); // Don't use the moment/dayjs here. Should use the built in Date object from JS. This is local date.
  const [timeZone, setTimeZone] = useState<string>(dayjs.tz.guess() ?? 'America/New_York'); // Default can be whatever. Set to users current timezone, otherwise to specified default.

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDate(date);
    }
  }

  const handleTimeZoneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimeZone(e.currentTarget.value);
  }

  // Translated Native Date object using moment to display in selected date/timezone selection.
  const selectedDate = moment(date).tz(timeZone, true);

  // Selected date in Moment UTC Date object. Translated to correct UTC based on selected date/timezone instead of current locale. Can't use above because moment is mutable by design and must clone before doing more on it.
  const utcSelectedDate = selectedDate.clone().utc();

  // Correct Native JS Date object from the Moment UTC Date object. Save this one to DB.
  const nativeUTCDate = utcSelectedDate.clone().toDate();

  // From DB back into translated date in Moment
  const dbTranslated = moment(nativeUTCDate).tz(timeZone, false);
  // const dbTranslated = moment(nativeUTCDate).tz(timeZone, false).toDate().toISOString();

  return (
    <>
      <div className='flex flex-row gap-8 justify-center'>
        <div>
          <h2 className='text-lg'>DatetimePicker</h2>
          <DatePicker
            id="enddateTime"
            selected={date}
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
          <h2 className='text-lg'>Timezone</h2>
          <select
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
            {selectedDate.format() + ' ' + timeZone + `(${timezoneMap[timeZone].timeZoneShortCode})`}
          </p>
        </div>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>UTC Datetime</span>
            {utcSelectedDate.format()}
          </p>
        </div>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>UTC Datetime (Native)</span>
            {nativeUTCDate.toISOString()}
          </p>
        </div>
        <div>
          <p className='flex flex-col gap-2'>
            <span className='font-bold'>UTC Datetime (Native) back into Selected Datetime</span>
            {dbTranslated.format()}
          </p>
        </div>
      </div>
      <div className='flex flex-row justify-between pt-10 px-10'>
        <div>
          <h1 className='font-bold text-lg'>Native JS</h1>
          <h2 className='font-bold'>EST</h2>
          <p>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' }).format(date)}</p>
          <h2 className='font-bold'>CST</h2>
          <p>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Chicago' }).format(date)}</p>
          <h2 className='font-bold'>MDT</h2>
          <p>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Denver' }).format(date)}</p>
          <h2 className='font-bold'>PDT</h2>
          <p>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' }).format(date)}</p>
        </div>
        <div>
          <h1 className='font-bold text-lg'>Moment</h1>

          <h2 className='font-bold'>EST</h2>
          <p>{moment(date).tz('America/New_York').format('MM/DD/YYYY hh:mm A')}</p>

          <h2 className='font-bold'>CST</h2>
          <p>{moment(date).tz('America/Chicago').format('MM/DD/YYYY hh:mm A')}</p>

          <h2 className='font-bold'>MDT</h2>
          <p>{moment(date).tz('America/Denver').format('MM/DD/YYYY hh:mm A')}</p>

          <h2 className='font-bold'>PDT</h2>
          <p>{moment(date).tz('America/Los_Angeles').format('MM/DD/YYYY hh:mm A')}</p>
        </div>
        <div>
          <h1 className='font-bold text-lg'>Dayjs</h1>

          <h2 className='font-bold'>EST</h2>
          <p>{dayjs(date).tz('America/New_York').format('MM/DD/YYYY hh:mm A')}</p>

          <h2 className='font-bold'>CST</h2>
          <p>{dayjs(date).tz('America/Chicago').format('MM/DD/YYYY hh:mm A')}</p>

          <h2 className='font-bold'>MDT</h2>
          <p>{dayjs(date).tz('America/Denver').format('MM/DD/YYYY hh:mm A')}</p>

          <h2 className='font-bold'>PDT</h2>
          <p>{dayjs(date).tz('America/Los_Angeles').format('MM/DD/YYYY hh:mm A')}</p>
        </div>
      </div>
    </>
  )
}
