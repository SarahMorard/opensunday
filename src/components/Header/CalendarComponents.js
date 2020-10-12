import React, { useState } from 'react'
import 'react-nice-dates/build/style.css'
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class MyCalendar extends React.Component  {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            selectedDay: undefined, //State for the selected day
            local: 'en', //state for the language of the calendar
        };
    }

    //Handle the day that was click
    handleDayClick(day, { selected }) {
        if (selected) {
            // Unselect the day if already selected
            this.setState({ selectedDay: undefined });
            return;
        }
        //Set the new selected day
        this.setState({ selectedDay: day });
    }

    //Render the calendar using React Day Picker
    render() {
        return (
            <div className="calendar">

                <DayPicker
                    onDayClick={this.handleDayClick}
                    selectedDays={this.state.selectedDay}
                    //All days are disabled except sunday and holiday
                    disabledDays={{ daysOfWeek: [1,2,3,4,5,6] }}
                />
                {this.state.selectedDay ? (
                    <p>You clicked {this.state.selectedDay.toLocaleDateString()}</p>
                ) : (
                    <p>Please select a day.</p>
                )}
            </div>
        );
    }
}

export default MyCalendar;