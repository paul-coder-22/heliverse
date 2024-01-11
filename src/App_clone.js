// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import UserSearch from './UserSearch';
import UserFilters from './UserFilters';
import UserList from './UserList';
import Pagination from './Pagination';
import TeamContainer from './TeamContainer';

function App() {
    const [users, setUsers] = useState([]);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [domainFilter, setDomainFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 6;

    useEffect(() => {
        fetchUserData();
    }, [searchTerm, domainFilter, genderFilter, availabilityFilter]);

    const fetchUserData = () => {
        fetch(`http://localhost:4000/api/users?domain=${domainFilter}&gender=${genderFilter}&availability=${availabilityFilter}`)
            .then(response => response.json())
            .then(data => setUsers(data.users))
            .catch(error => console.error('Error:', error));
    };

    const addToTeam = (user) => {
        const isUnique = !selectedTeamMembers.some(
            (member) => member.domain === user.domain && member.availability === user.availability
        );

        if (isUnique) {
            setSelectedTeamMembers([...selectedTeamMembers, user]);
            alert(`User ${user.name} added to the team.`);
        } else {
            alert(`User ${user.name} already exists in the team with the same domain and availability.`);
        }
    };

    const createTeam = () => {
        alert('Team created!');
        // Add logic for creating a team
    };

    return (
        <div className="App">
            <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <UserFilters
                domainFilter={domainFilter}
                setDomainFilter={setDomainFilter}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                availabilityFilter={availabilityFilter}
                setAvailabilityFilter={setAvailabilityFilter}
            />
            <UserList users={users} currentPage={currentPage} usersPerPage={usersPerPage} addToTeam={addToTeam} />
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={Math.ceil(users.length / usersPerPage)}
            />
            {/* <button onClick={createTeam} >Create Team</button> */}
            <TeamContainer selectedTeamMembers={selectedTeamMembers} />
        </div>
    );
}

export default App;
