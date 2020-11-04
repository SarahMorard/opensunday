import React from 'react';

//the context for save the date selected by the user in the toolbox
export const DateContext = React.createContext({
    date: null,
    setDate: () => {}
});