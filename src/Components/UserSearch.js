// UserSearch.js
import React from 'react';

const UserSearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
            />
        </div>
    );
};

export default UserSearch;
