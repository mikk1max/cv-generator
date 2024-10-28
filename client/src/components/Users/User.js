import React from 'react';
import defaultManImage from "../Main/img/user-man.png";
import defaultWomanImage from "../Main/img/user-woman.png";
import styles from "./styles.module.css";

const User = ({ user }) => {
    const { firstName, lastName, email, gender, jobPosition } = user;

    // Determine profile image based on gender or use default
    let profileImage;
    if (gender === "female") {
        profileImage = user.profileImage || defaultWomanImage;
    } else {
        profileImage = user.profileImage || defaultManImage;
    }

    // Display job position or default text if not specified
    const displayJobPosition = jobPosition || "-";

    return (
        <div className={styles.userContainer}>
            <img src={profileImage} alt="Profile" className={styles.profileImage} />
            <div className={styles.userInfo}>
                <h3>{firstName} {lastName}</h3>
                <p>{displayJobPosition}</p>
                <p><a href={`mailto:${email}`}>{email}</a></p>
            </div>
        </div>
    );
};

export default User;
