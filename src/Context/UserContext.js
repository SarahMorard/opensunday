import React from 'react';

export const UserContext = React.createContext({
    token: null,
    firstname : null,
    lastname : null,
    admin : false
});