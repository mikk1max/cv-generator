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
    educationFrom: [""],
    educationTo: [""],
    educationPlace: [""],
    educationField: [""],
    workFrom: [""],
    workTo: [""],
    workPlace: [""],
    skills: [""],
    languages: [""],
    interests: "",
  });

  const formatDate = (isoString) => (isoString ? isoString.split("T")[0] : "");

  useEffect(() => {
    const fetchCVData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.BACKEND_URL || "http://localhost:8080"}/api/users/cv`,
          {
            headers: { "x-access-token": token },
          }
        );

        if (response.status === 200) {
          const cvData = response.data.data;

          setFormData({
            firstName: cvData.firstName || "",
            lastName: cvData.lastName || "",
            dateOfBirth: formatDate(cvData.dateOfBirth) || "",
            jobPosition: cvData.jobPosition || "",
            street: cvData.street || "",
            buildingNumber: cvData.buildingNumber || "",
            apartmentNumber: cvData.apartmentNumber || "",
            postalCode: cvData.postalCode || "",
            city: cvData.city || "",
            country: cvData.country || "",
            interests: cvData.interests || "",
            skills: cvData.skills || [""],
            languages: cvData.languages || [""],
            educationFrom: cvData.education?.map((edu) =>
              formatDate(edu.from)
            ) || [""],
            educationTo: cvData.education?.map((edu) => formatDate(edu.to)) || [
              "",
            ],
            educationPlace: cvData.education?.map((edu) => edu.place) || [""],
            educationField: cvData.education?.map(
              (edu) => edu.fieldOfStudy
            ) || [""],
            workFrom: cvData.workExperience?.map((work) =>
              formatDate(work.from)
            ) || [""],
            workTo: cvData.workExperience?.map((work) =>
              formatDate(work.to)
            ) || [""],
            workPlace: cvData.workExperience?.map((work) => work.place) || [""],
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

    // Reformat dates and arrays before sending
    const convertToISO = (timestamp) => new Date(timestamp).toISOString();

    // Ensure arrays are not undefined or null
    const ensureArray = (field) => (Array.isArray(field) ? field : [field]);

    // Map the data for Education
    const educationData = ensureArray(formData.educationFrom).map(
      (from, index) => ({
        from: convertToISO(formData.educationFrom[index]),
        to: convertToISO(formData.educationTo[index]),
        place: formData.educationPlace[index] || "",
        fieldOfStudy: formData.educationField[index] || "",
      })
    );

    // Map the data for Work Experience
    const workExperienceData = ensureArray(formData.workFrom).map(
      (from, index) => ({
        from: convertToISO(formData.workFrom[index]),
        to: convertToISO(formData.workTo[index]),
        place: formData.workPlace[index] || "",
        position: formData.jobPosition || "",
      })
    );

    const updatedFormData = {
      ...formData,
      dateOfBirth: convertToISO(formData.dateOfBirth), // Convert dateOfBirth to ISO string
      education: educationData,
      workExperience: workExperienceData,
    };

    console.log("Form data being sent:", updatedFormData);

    try {
      const config = {
        method: "put",
        url: `${
          process.env.BACKEND_URL || "http://localhost:8080"
        }/api/users/update-cv`,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        data: updatedFormData,
      };

      const response = await axios(config);
      console.log("CV updated successfully:", response.data);
      onSubmit(true);
    } catch (error) {
      console.error(
        "There was an error updating the CV:",
        error.response?.data || error
      );
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
        <div
          className={styles.cv_section}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* <h4>Personal Information</h4> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            <span style={{ padding: "0 10px", color: "#888" }}>
              Personal information
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          </div>
          <div className={styles.form_group_inline}>
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
              value={formData.dateOfBirth || ""}
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
        <div
          className={styles.cv_section}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* <h4>Address</h4> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            <span style={{ padding: "0 10px", color: "#888" }}>Address</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          </div>
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
          <div className={styles.form_group_inline}>
            <div className={styles.form_group}>
              <label htmlFor="buildingNumber">Building No.</label>
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
              <label htmlFor="apartmentNumber">Apartment No.</label>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            <span style={{ padding: "0 10px", color: "#888" }}>Education</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          </div>

          {formData.educationFrom.map((_, index) => (
            <div key={index} className={styles.date_fields} style={{ gap: 20 }}>
              <div className={styles.form_group}>
                <label htmlFor={`educationFrom-${index}`}>From</label>
                <input
                  type="date"
                  id={`educationFrom-${index}`}
                  name="educationFrom"
                  min="1950-01-01"
                  max="2024-12-31"
                  className={styles.input_field}
                  value={formData.educationFrom[index]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationFrom: formData.educationFrom.map((date, i) =>
                        i === index ? e.target.value : date
                      ),
                    })
                  }
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor={`educationTo-${index}`}>To</label>
                <input
                  type="date"
                  id={`educationTo-${index}`}
                  name="educationTo"
                  min="1950-01-01"
                  max="2024-12-31"
                  className={styles.input_field}
                  value={formData.educationTo[index]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationTo: formData.educationTo.map((date, i) =>
                        i === index ? e.target.value : date
                      ),
                    })
                  }
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor={`educationPlace-${index}`}>Place</label>
                <input
                  type="text"
                  id={`educationPlace-${index}`}
                  name="educationPlace"
                  pattern="^[a-zA-Z\s\-']+$"
                  className={styles.input_field}
                  value={formData.educationPlace[index]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationPlace: formData.educationPlace.map((place, i) =>
                        i === index ? e.target.value : place
                      ),
                    })
                  }
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor={`educationField-${index}`}>Field</label>
                <input
                  type="text"
                  id={`educationField-${index}`}
                  name="educationField"
                  pattern="^[a-zA-Z\s\-']+$"
                  className={styles.input_field}
                  value={formData.educationField[index]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationField: formData.educationField.map((field, i) =>
                        i === index ? e.target.value : field
                      ),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Work Experience Section */}
        <div className={styles.cv_section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            <span style={{ padding: "0 10px", color: "#888" }}>
              Work experience
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginBottom: 20,
            }}
          >
            {formData.workFrom.map((_, index) => (
              <div
                key={index}
                className={styles.date_fields}
                style={{ gap: "20px" }}
              >
                <div className={styles.form_group}>
                  <label htmlFor={`workFrom-${index}`}>From</label>
                  <input
                    type="date"
                    id={`workFrom-${index}`}
                    name="workFrom"
                    min="1950-01-01"
                    max="2024-12-31"
                    className={styles.input_field}
                    value={formData.workFrom[index]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workFrom: formData.workFrom.map((date, i) =>
                          i === index ? e.target.value : date
                        ),
                      })
                    }
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor={`workTo-${index}`}>To</label>
                  <input
                    type="date"
                    id={`workTo-${index}`}
                    name="workTo"
                    min="1950-01-01"
                    max="2024-12-31"
                    className={styles.input_field}
                    value={formData.workTo[index]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workTo: formData.workTo.map((date, i) =>
                          i === index ? e.target.value : date
                        ),
                      })
                    }
                  />
                </div>
                <div className={styles.form_group}>
                  <label htmlFor={`workPlace-${index}`}>Place</label>
                  <input
                    type="text"
                    id={`workPlace-${index}`}
                    name="workPlace"
                    pattern="^[a-zA-Z\s\-']+$"
                    className={styles.input_field}
                    value={formData.workPlace[index]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workPlace: formData.workPlace.map((place, i) =>
                          i === index ? e.target.value : place
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  workFrom: [...formData.workFrom, ""],
                  workTo: [...formData.workTo, ""],
                  workPlace: [...formData.workPlace, ""],
                });
              }}
              className={styles.add_button}
            >
              Add Another
            </button>

            {/* Remove Last Work Experience */}
            <button
              type="button"
              onClick={() => {
                if (formData.workFrom.length > 1) {
                  setFormData({
                    ...formData,
                    workFrom: formData.workFrom.slice(0, -1),
                    workTo: formData.workTo.slice(0, -1),
                    workPlace: formData.workPlace.slice(0, -1),
                  });
                }
              }}
              className={styles.remove_button}
            >
              Remove Last
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className={styles.cv_section}>
          <h4>Skills</h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginBottom: 20,
            }}
          >
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className={styles.form_group}
                style={{ display: "flex", justifyContent: "center" }}
              >
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
          </div>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginBottom: 20,
            }}
          >
            {formData.languages.map((language, index) => (
              <div
                key={index}
                className={styles.form_group}
                style={{ display: "flex", justifyContent: "center" }}
              >
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
          </div>
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
            maxLength="500"
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
