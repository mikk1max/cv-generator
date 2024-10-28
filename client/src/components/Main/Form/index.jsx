import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const CVForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    jobPosition: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    postalCode: "",
    city: "",
    country: "",
    educationFrom: "",
    educationTo: "",
    educationPlace: "",
    educationField: "",
    workFrom: "",
    workTo: "",
    workPlace: "",
    skills: [""],
    languages: [""],
    interests: "",
  });

  useEffect(() => {
    const fetchCVData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/users/cv",
          headers: { "x-access-token": token },
        };

        const response = await axios(config);

        if (response.status === 200) {
          const cvData = response.data.data;
          setFormData({
            ...cvData,
            skills: cvData.skills || [""],
            languages: cvData.languages || [""],
          });
        } else {
          console.error("Failed to fetch CV data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };
    fetchCVData();
  }, []);

  const handleAddSkill = () => {
    setFormData((prevState) => ({
      ...prevState,
      skills: [...prevState.skills, ""],
    }));
  };

  const handleChangeSkill = (index, value) => {
    setFormData((prevState) => {
      const updatedSkills = [...prevState.skills];
      updatedSkills[index] = value;
      return { ...prevState, skills: updatedSkills };
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData((prevState) => {
      const updatedSkills = [...prevState.skills];
      updatedSkills.splice(index, 1);
      return { ...prevState, skills: updatedSkills };
    });
  };

  const handleAddLanguage = () => {
    setFormData((prevState) => ({
      ...prevState,
      languages: [...prevState.languages, ""],
    }));
  };

  const handleChangeLanguage = (index, value) => {
    setFormData((prevState) => {
      const updatedLanguages = [...prevState.languages];
      updatedLanguages[index] = value;
      return { ...prevState, languages: updatedLanguages };
    });
  };

  const handleRemoveLanguage = (index) => {
    setFormData((prevState) => {
      const updatedLanguages = [...prevState.languages];
      updatedLanguages.splice(index, 1);
      return { ...prevState, languages: updatedLanguages };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const config = {
        method: "put",
        url: "http://localhost:8080/api/users/update-cv",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        data: formData,
      };

      const response = await axios(config);
      console.log("CV updated successfully:", response.data);
      onSubmit(true);
    } catch (error) {
      console.error("There was an error updating the CV:", error);
      onSubmit(false);
    }
  };

  const fillWithRandomData = () => {
    const randomData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      jobPosition: "Software Developer",
      street: "123 Main St",
      buildingNumber: "45",
      apartmentNumber: "301",
      postalCode: "12-345",
      city: "New York",
      country: "USA",
      educationFrom: "2010-09-01",
      educationTo: "2014-06-01",
      educationPlace: "University of Example",
      educationField: "Computer Science",
      workFrom: "2015-07-01",
      workTo: "2020-12-31",
      workPlace: "Tech Company",
      skills: ["JavaScript", "React", "Node.js"],
      languages: ["English", "Spanish"],
      interests: "Reading, Traveling",
    };

    setFormData(randomData);
  };

  return (
    <div className={styles.cv_form}>
      <h3>CV Form</h3>
      <button onClick={fillWithRandomData} className={styles.add_button}>
        Fill with Draft Data (John Doe)
      </button>
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className={styles.cv_section}>
          <h4>Personal Information</h4>
          <div className={styles.form_group}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              pattern="^[a-zA-ZÀ-ÿ\- ']+$"
              title="Please enter a valid name"
              required
              className={styles.input_field}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              pattern="^[a-zA-ZÀ-ÿ\- ']+$"
              title="Please enter a valid name"
              required
              className={styles.input_field}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              min="1950-01-01"
              max="2020-01-01"
              className={styles.input_field}
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="jobPosition">Job Position</label>
            <input
              type="text"
              id="jobPosition"
              name="jobPosition"
              pattern="^[a-zA-Z0-9\s\-()&,./']+$"
              title="Please enter a valid job title"
              className={styles.input_field}
              value={formData.jobPosition}
              onChange={(e) =>
                setFormData({ ...formData, jobPosition: e.target.value })
              }
            />
          </div>
        </div>

        {/* Address Section */}
        <div className={styles.cv_section}>
          <h4>Address</h4>
          <div className={styles.form_group}>
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              pattern="^[a-zA-Z\s\-',./()&]+$"
              title="Please enter a valid street name"
              required
              className={styles.input_field}
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="buildingNumber">Building Number</label>
            <input
              type="text"
              id="buildingNumber"
              name="buildingNumber"
              pattern="^\d+(?:\/\d+)?$"
              title="Please enter a valid building number (e.g., 68 or 67/3)"
              required
              className={styles.input_field}
              value={formData.buildingNumber}
              onChange={(e) =>
                setFormData({ ...formData, buildingNumber: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="apartmentNumber">Apartment Number</label>
            <input
              type="text"
              id="apartmentNumber"
              name="apartmentNumber"
              pattern="^\d+$"
              title="Please enter a valid apartment number with digits only"
              className={styles.input_field}
              value={formData.apartmentNumber}
              onChange={(e) =>
                setFormData({ ...formData, apartmentNumber: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              pattern="^\d{2}-\d{3}$"
              title="Please enter a valid postal code in the format XX-XXX"
              required
              className={styles.input_field}
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              pattern="^[a-zA-Z\s\-']+$"
              title="Please enter a valid city name"
              required
              className={styles.input_field}
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              pattern="^[a-zA-Z\s\-']+$"
              title="Please enter a valid city name"
              required
              className={styles.input_field}
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
        </div>

        {/* Education Section */}
        <div className={styles.cv_section}>
          <h4>Education</h4>
          <div className={styles.date_fields}>
            <div className={styles.form_group}>
              <label htmlFor="educationFrom">From</label>
              <input
                type="date"
                id="educationFrom"
                name="educationFrom"
                min="1950-01-01"
                max="2024-12-31"
                className={styles.input_field}
                value={formData.educationFrom}
                onChange={(e) =>
                  setFormData({ ...formData, educationFrom: e.target.value })
                }
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="educationTo">To</label>
              <input
                type="date"
                id="educationTo"
                name="educationTo"
                min="1950-01-01"
                max="2024-12-31"
                className={styles.input_field}
                value={formData.educationTo}
                onChange={(e) =>
                  setFormData({ ...formData, educationTo: e.target.value })
                }
              />
            </div>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="educationPlace">Place</label>
            <input
              type="text"
              id="educationPlace"
              name="educationPlace"
              pattern="^[a-zA-Z\s\-']+$"
              className={styles.input_field}
              value={formData.educationPlace}
              onChange={(e) =>
                setFormData({ ...formData, educationPlace: e.target.value })
              }
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="educationField">Field</label>
            <input
              type="text"
              id="educationField"
              name="educationField"
              pattern="^[a-zA-Z\s\-']+$"
              className={styles.input_field}
              value={formData.educationField}
              onChange={(e) =>
                setFormData({ ...formData, educationField: e.target.value })
              }
            />
          </div>
        </div>

        {/* Work Experience Section */}
        <div className={styles.cv_section}>
          <h4>Work Experience</h4>
          <div className={styles.date_fields}>
            <div className={styles.form_group}>
              <label htmlFor="workFrom">From</label>
              <input
                type="date"
                id="workFrom"
                name="workFrom"
                min="1950-01-01"
                max="2024-12-31"
                className={styles.input_field}
                value={formData.workFrom}
                onChange={(e) =>
                  setFormData({ ...formData, workFrom: e.target.value })
                }
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="workTo">To</label>
              <input
                type="date"
                id="workTo"
                name="workTo"
                min="1950-01-01"
                max="2024-12-31"
                className={styles.input_field}
                value={formData.workTo}
                onChange={(e) =>
                  setFormData({ ...formData, workTo: e.target.value })
                }
              />
            </div>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="workPlace">Place</label>
            <input
              type="text"
              id="workPlace"
              name="workPlace"
              pattern="^[a-zA-Z\s\-']+$"
              className={styles.input_field}
              value={formData.workPlace}
              onChange={(e) =>
                setFormData({ ...formData, workPlace: e.target.value })
              }
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className={styles.cv_section}>
          <h4>Skills</h4>
          {formData.skills.map((skill, index) => (
            <div key={index} className={styles.form_group}>
              <input
                type="text"
                className={styles.input_field}
                value={skill}
                onChange={(e) => handleChangeSkill(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className={styles.remove_button}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSkill}
            className={styles.add_button}
          >
            Add Skill
          </button>
        </div>

        {/* Languages Section */}
        <div className={styles.cv_section}>
          <h4>Languages</h4>
          {formData.languages.map((language, index) => (
            <div key={index} className={styles.form_group}>
              <input
                type="text"
                className={styles.input_field}
                value={language}
                onChange={(e) => handleChangeLanguage(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveLanguage(index)}
                className={styles.remove_button}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLanguage}
            className={styles.add_button}
          >
            Add Language
          </button>
        </div>

        {/* Interests Section */}
        <div className={styles.cv_section}>
          <h4>Interests</h4>
          <textarea
            className={styles.input_field}
            value={formData.interests}
            maxlength="500"
            onChange={(e) =>
              setFormData({ ...formData, interests: e.target.value })
            }
          />
        </div>

        <button type="submit" className={styles.submit_button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CVForm;
