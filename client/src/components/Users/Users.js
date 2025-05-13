import React, { useState } from "react";
import User from "./User";
import styles from "./styles.module.css";

const Users = ({ users }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <div>
      <div className={styles.usersContainer}>
        {users.slice(0, visibleCount).map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
      {users.length > visibleCount && (
        <button onClick={handleLoadMore} className={styles.loadMoreButton}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Users;
