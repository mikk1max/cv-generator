import defaultManImage from "../Main/img/user-man.png";
import defaultWomanImage from "../Main/img/user-woman.png";
import React from "react";
import styles from "./styles.module.css";

const formatDate = (date) => {
  if (!date || date === "-") {
    return "No data available";
  }
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const checkIfNoDataAvailable = (array) => {
  return (
    array === null ||
    array.length === 0 ||
    (array.length === 1 && (!array[0].from || array[0].from === "-"))
  );
};

const UserData = ({ user }) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    jobPosition,
    dateOfBirth,
    workExperience,
    skills,
    languages,
    interests,
    education,
  } = user;

  let profileImage;
  if (gender === "female") {
    profileImage = user.profileImage || defaultWomanImage;
  } else {
    profileImage = user.profileImage || defaultManImage;
  }

  return (
    <div className={styles.cvContainer} id="cvContainer">
      <div className={styles.header}>
        <div className={styles.profileImageContainer}>
          <img
            src={profileImage}
            alt="Profile"
            className={styles.profileImageInCV}
          />
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.fullName}>
            {firstName} {lastName}
          </h2>
          <p className={styles.jobPosition}>{jobPosition}</p>
          <p className={styles.email}>
            <a href={`mailto:${email}`} style={{ textDecoration: "none" }}>
              {email}
            </a>
          </p>
          <p className={styles.gender} style={{textTransform: "capitalize"}}>{gender}</p>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Date of Birth</h2>
        <p>{dateOfBirth ? formatDate(dateOfBirth) : "-"}</p>
      </div>
      {checkIfNoDataAvailable(workExperience) ? (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <p>-</p>
        </div>
      ) : (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          {workExperience.map((experience, index) => (
            <div key={index}>
              <p>
                {formatDate(experience.from)} - {formatDate(experience.to)}
              </p>
              <p>
                {experience.position} at {experience.place}
              </p>
            </div>
          ))}
        </div>
      )}
      {checkIfNoDataAvailable(education) ? (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <p>-</p>
        </div>
      ) : (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {education.map((edu, index) => (
            <div key={index}>
              <p>
                {formatDate(edu.from)} - {formatDate(edu.to)}
              </p>
              <p>
                {edu.fieldOfStudy} at {edu.place}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        {skills && skills.length > 0 ? (
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>-</p>
        )}
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Languages</h2>
        {languages && languages.length > 0 ? (
          <ul>
            {languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
        ) : (
          <p>-</p>
        )}
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Interests</h2>
        <p>{interests || "No interests available"}</p>
      </div>
    </div>
  );
};

export default UserData;
