import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file
import ReactPaginate from 'react-paginate';
import UserForm from './Components/UserForm';
import AutohideExample from './Components/Toaster';

function App() {
  const [users, setUsers] = useState([]);
  // const [users, setUsers] = useState(db);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null)

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)

  const usersPerPage = 20;

  useEffect(() => {
    fetchUserData();
  }, [searchTerm, domainFilter, genderFilter, availabilityFilter]);

  const fetchUserData = () => {
    setIsLoading(true)
    // fetch(`http://localhost:4000/api/users?searchTerm=${searchTerm}&domain=${domainFilter}&gender=${genderFilter}&availability=${availabilityFilter}`)
    fetch(`https://us-central1-firecrud-486cd.cloudfunctions.net/api/api/users?searchTerm=${searchTerm}&domain=${domainFilter}&gender=${genderFilter}&availability=${availabilityFilter}`)
      .then(response => response.json())
      .then(data => {
        setUsers(data.users)
        setTeamMembers(data.teams)
      })
      .catch(error => console.error('Error:', error))
      .finally(() => {
        setIsLoading(false)
      })
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const displayUsers = () => {

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    if (isLoading) {
      return userDataFecthingLoader
    }

    return (
      <div className="user-grid">
        {users.length ? users.slice(startIndex, endIndex).map((user) => (
          <div className="user-card" key={user.id}>
            <div className="container" >
              <div className="shape">
                <div className="image">
                  <img srcSet={user.avatar} alt="" />
                </div>
              </div>
              <h3>{user.first_name + " " + user.last_name}</h3>
              <h3 className="title">{user.domain}</h3>
              <p>{user.email}</p>
              <p>{user.gender}</p>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                <button className='btn btn-outline-danger' onClick={() => deleteUser(user._id)}>Delete</button>
                <button className='btn btn-primary' onClick={() => addToTeam(user)} style={{ display: "none" }}>Add</button>
                <button className='btn btn-warning' onClick={() => setSelectedUser(user)}>Update</button>
              </div>
              <p>{user.available ? "Available" : "Not Available"}</p>
            </div>
          </div>
        )) : <h3>No User Found</h3>}
      </div>
    );
  };


  /* Update User */
  const updateUser = (updatedUser) => {
    fetch(`https://us-central1-firecrud-486cd.cloudfunctions.net/api/api/users/${updatedUser._id}`, {
      // fetch(`http://localhost:4000/api/users/${updatedUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then(() => fetchUserData())
      .catch(error => {
        console.error('Error updating user:', error);
      });
    setSelectedUser(null); // Clear selected user after update
  };


  const addToTeam = (user) => {
    if (!user.available) {
      alert(`User ${user.first_name} is not available and cannot be added to the team.`);
      return;
    }

    const isUnique = !selectedTeamMembers.some(
      (member) => member.domain === user.domain && member.available === user.available
    );

    if (isUnique) {
      setSelectedTeamMembers([...selectedTeamMembers, user]);
      alert(`User ${user.first_name} added to the team.`);
    } else {
      alert(`User ${user.first_name} already exists in the team with the same domain and availability.`);
    }
  };

  /* Add user in the list */
  const addUser = async (newUser) => {

    try {
      await fetch(`http://localhost:4000/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      }).then(() => fetchUserData())

      // setUsers([...users, newUser]);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  /* Delete user */
  const deleteUser = async (index) => {
    try {
      await fetch(`https://us-central1-firecrud-486cd.cloudfunctions.net/api/api/users/${index}`, {
        // await fetch(`http://localhost:4000/api/users/${index}`, {
        method: 'DELETE',
      });

      setUsers(users.filter(user => user._id !== index));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  /*  const createTeam = async () => {
     let userID = selectedTeamMembers.map(user => user._id)
     try {
       await fetch(`http://localhost:4000/api/teams`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ data: userID }),
       }).then(() => {
         fetchUserData()
         setSelectedTeamMembers([]);
         console.log(teamMembers);
       })
       // if (response.ok) {
       //   alert('Team created!');
       //   setSelectedTeamMembers([]); // Clear selected team members after successful team creation
       // } else {
       //   alert('Failed to create team. Please try again.');
       // }
     } catch (error) {
       console.error('Error creating team:', error);
     }
   }; */


  const displayUserProfile = (userId) => {
    const userData = users.find(user => user._id.valueOf() === userId)
    return userData.first_name + " " + userData.last_name
  }


  const userDataFecthingLoader = <div className='d-flex justify-content-center'><div className="lds-loader"><div></div><div></div><div></div></div></div>

  return (
    <div className="App">

      <div className='filterbox'>
        <div>
          <h5 style={{ textAlign: 'center' }}>Search User</h5>
          <label htmlFor="">
            Name
            <input className='form-control' type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name" />
          </label>
          <label>
            Domain:
            <select className='form-control' value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
              <option value="">All</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
              <option value="Business Development">Business Development</option>
              <option value="Sales">Sales</option>
              <option value="UI Designing">UI Designing</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label>
            Gender:
            <select className='form-control' value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Availability:
            <select className='form-control' value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </label>
        </div>
      </div>

      <div className="filterbox">
        <div>
          <h5 style={{ textAlign: "center" }}>{selectedUser?.id ? "Update User" : "Add User"} </h5>
        </div>
        <UserForm addUser={addUser} updateUser={updateUser} currentUser={selectedUser} />
        {/* add team in database after selecting */}
        {/* <button className='btn btn-warning py-2 my-1' onClick={createTeam}>Create Team</button> */}
      </div>


      <div id="userContainer" className="user-container">
        {/* {users.length ? displayUsers() : userDataFecthingLoader} */}
        {displayUsers()}
        {/* {users.length} */}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 20,
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
        }}
      >
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          breakLabel={'...'}
          breakClassName={'item break-me'}
          pageCount={Math.ceil(users.length / usersPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          pageClassName={'item pagination-page '}
          previousClassName={'item previous'}
          nextClassName={'item next'}
          disabledClassName={"disabled-page"}
          activeClassName={'item active'}
        />
      </div>
      {/* <div id="teamContainer" className="team-container">
        {
          selectedTeamMembers.map((member) => (
            <div key={member.id}>
              <p>Name: {member.first_name + " " + member.first_name}</p>
              <p>Domain: {member.domain}</p>
              <p>Gender: {member.gender}</p>
              <p>Availability: {member.availability ? "Avaiable" : "Not Avaiable"}</p>
              <hr />
            </div>
          ))}
      </div> */}
      {/*  <div id="teamContainer" className="team-container">
        {
          teamMembers.map((member) => (
            <div key={member._id} className='card' style={{ width: "18rem", margin: "0.5rem" }}>
              <ul className="list-group list-group-flush">
                {member.members.map(user => <li className="list-group-item" key={user}>{displayUserProfile(user)}</li>)}
              </ul>
            </div>
          ))}
      </div> */}
    </div>
  );
}

export default App;






