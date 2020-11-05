import React from 'react'
import 'react-nice-dates/build/style.css'
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import {DateContext} from "../../Context/DateContext";

//The class which render the calendar
class MyCalendar extends React.Component  {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
    }

    //Handle the day that was click
    handleDayClick(day, { selected }) {
        if (selected) {
            // Unselect the day if already selected
            this.setState({ selectedDay: undefined });
            return;
        }
        //Set the new selected day
        this.context.setDate(day);
        //When we select a day we go to location which will display the markers for the establishments
        this.props.history.push("/location");
    }

    //Render the calendar using React Day Picker
    render() {
        return (
            <div className="calendar">
                {this.context.date ? (
                    <p>You selected {this.context.date.toLocaleDateString()}</p>
                ) : (
                    <p>Please select a day.</p>
                )}
                <DayPicker
                    onDayClick={this.handleDayClick}
                    selectedDays={this.context.date}

                />
            </div>
        );
    }
}

MyCalendar.contextType = DateContext;

export default MyCalendar;