import React from 'react';

export const UserContext = React.createContext({
    firstname : null,
    lastname : null,
    admin : false
});