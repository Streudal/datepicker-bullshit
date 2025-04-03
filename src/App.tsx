import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { ChangeEvent, useState } from 'react';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Load the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const timezoneMap: Record<string, string> = {
  'EST': 'America/New_York',
  'CST': 'America/Chicago',
  'MDT': 'America/Denver',
  'PDT': 'America/Los_Angeles',
}

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
            {Object.entries(timezoneMap).map(([timezoneCode, timeZoneName]) => (
              <option key={timeZoneName} value={timeZoneName}>
                {timezoneCode}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex flex-col gap-4 py-8'>
        <p><span className='font-bold'>Native JS selected datetime (UTC):</span> {date.toISOString()}</p>
        <p><span className='font-bold'>Moment selected datetime (UTC):</span> {moment(date).utc().format()}</p>
        <p><span className='font-bold'>Dayjs selected datetime (UTC):</span>{dayjs(date).utc().format()}</p>
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
