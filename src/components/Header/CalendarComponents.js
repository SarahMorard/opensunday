import React, { useState } from 'react'
import 'react-nice-dates/build/style.css'
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class MyCalendar extends React.Component  {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            //State for the selected day
            selectedDay: undefined,
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
                {this.state.selectedDay ? (
                    <p>You selected {this.state.selectedDay.toLocaleDateString()}</p>
                ) : (
                    <p>Please select a day.</p>
                )}
                <DayPicker
                    onDayClick={this.handleDayClick}
                    selectedDays={this.state.selectedDay}

                />
            </div>
        );
    }
}

export default MyCalendar;