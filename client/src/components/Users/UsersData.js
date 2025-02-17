import React from "react";
import UserData from "./UserData";

const UsersData = ({ userDetails }) => {
  // Filtrujemy userDetails, aby wyłapać tylko zalogowanego użytkownika
  const loggedInUserDetails = userDetails;

  return (
    <div>
      <div>
        {loggedInUserDetails && (
          <UserData key={loggedInUserDetails._id} user={loggedInUserDetails} />
        )}
      </div>
    </div>
  );
};

export default UsersData;
