import React from 'react';
import User from './User';
import styles from "./styles.module.css";

const Users = ({ users }) => {
    return (
        <div className={styles.usersContainer} >
            {users.map((user) => (
                <User key={user._id} user={user} />
            ))}
        </div>
    );
};

export default Users;
