import React, { FC, useEffect, useState } from "react";
import styles from "./CreateVacationContent.module.scss";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { VacationType, vacationInitState } from "../../../models/Vacation";
import validation from "../../../validations/VacationValidation";
import { useFormik } from "formik";
import Loader from "../../Loader/Loader";

interface CreateVacationContentProps {
  onClose: () => void;
}

const CreateVacationContent: FC<CreateVacationContentProps> = ({ onClose }) => {
  const [inputValue, setinputValue] = useState<string>();
  const [changeImgState, setChangeImgState] = useState<boolean>(false);
  const [newVacation, setNewVacation] = useState<VacationType>({
    destination: "",
    description: "",
    start_date: "",
    end_date: "",
    price: 0,
    image_path: "",
  });

  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const { name, value } = e.currentTarget;

  //   setNewVacation((prevstate) => ({
  //     ...prevstate,
  //     [name]: value,
  //   }));
  // };

  const setChangeImgMode = () => {
    setChangeImgState(!changeImgState);
  };

  // const postNewVacation = async (values:VacationType) => {
  // if (isValidForm) {
  //   try {
  //     const response = await axios.post(`http://localhost:5000/api/vacations/new`, values);
  //     // const response = await axios.post(`http://localhost:5000/api/vacations/new`, newVacation);
  //     console.log(response);
  //     setTimeout(() => {

  //       onClose();
  //     }, 3000);
  //   } catch (error) {
  //     console.error("Error posting new vacation:", error);
  //   }
  // } else {
  //   return;
  // }
  // };

  useEffect(() => {
    const validateForm = async () => {
      const isValid = await validation.isValid(newVacation);
      setIsValidForm(isValid);
    };
    validateForm();
  }, [newVacation]);

  const { handleChange, values, handleSubmit, errors, touched, handleBlur, isSubmitting } = useFormik({
    initialValues: vacationInitState,
    validationSchema: validation,
    onSubmit: async (values, actions) => {
      setSubmitting(true);
      try {
        const response = await axios.post(`http://localhost:5000/api/vacations/new`, values);
        console.log(response);
      } catch (error) {
        console.error("Error posting new vacation:", error);
      } finally {
        setTimeout(() => {
          setSubmitting(false);
          onClose();
        }, 3000);
      }
    },
  });
  useEffect(() => {
    console.log(`isSubmitting:`, isSubmitting);
  }, [isSubmitting]);

  return (
    <form onSubmit={handleSubmit} className={styles.CreateVacationContent}>
      <div className={styles.data}>
        <div className={styles.img}>
          <img
            className={values.image_path === "" ? styles.empty : ""}
            src={
              values.image_path === ""
                ? "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?w=740&t=st=1689870088~exp=1689870688~hmac=6f06b47561978e23ad12e74f93120b6847862e94f48344d0e1c44cb3f32ae62e"
                : values.image_path
            }
            alt={"placeholder"}
          />
          <span onClick={setChangeImgMode} className={styles.action}>
            <FaPlus />
          </span>
        </div>
        <div className={styles.wrappers}>
          {changeImgState ? (
            <div className={styles.urlWrapper}>
              <label htmlFor="">Enter your image URL :</label>
              <input
                onBlur={handleBlur}
                required
                onChange={handleChange}
                type="url"
                name="image_path"
                id="vacationImage_pathURL"
                value={values.image_path}
                className={errors.image_path && touched.image_path ? styles.inputError : ""}
              />
              {errors.image_path && touched.image_path && <p className={styles.error}>{errors.image_path}</p>}
              <div className={styles.instructions}>
                <h2>Instructions</h2>
                <ul>
                  <li>
                    <p>
                      Step 1: Find a suitable image on{" "}
                      <Link to={`https://www.freepik.com/`} target="_blank">
                        Freepic
                      </Link>
                    </p>
                  </li>
                  <li>
                    <p>Step 2: Copy the URL of the photo</p>
                  </li>
                  <li>
                    <p>Step 3: Click "Create Vacation" and you'r done!</p>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.wrapper}>
                <label htmlFor="">Destination</label>
                <input
                  onBlur={handleBlur}
                  type="text"
                  name="destination"
                  id="vacationDestination"
                  onChange={handleChange}
                  value={values.destination}
                  className={errors.destination && touched.destination ? styles.inputError : ""}
                />
                {errors.destination && touched.destination && <p className={styles.error}>{errors.destination}</p>}
              </div>
              <div className={styles.dateAndPriceWrapper}>
                <div className={styles.wrapper}>
                  <label htmlFor="">Starts on</label>
                  <input
                    onBlur={handleBlur}
                    className={errors.start_date && touched.start_date ? styles.inputError : ""}
                    required
                    type="date"
                    name="start_date"
                    id="vecationStartDate"
                    onChange={handleChange}
                    value={values.start_date}
                  />
                  {errors.start_date && touched.start_date && <p className={styles.error}>{errors.start_date}</p>}
                </div>

                <div className={styles.wrapper}>
                  <label htmlFor="">Ends on</label>
                  <input
                    required
                    type="date"
                    name="end_date"
                    id="vacationEndDate"
                    value={values.end_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.end_date && touched.end_date ? styles.inputError : ""}
                  />
                  {errors.end_date && touched.end_date && <p className={styles.error}>{errors.end_date}</p>}
                </div>

                <div className={styles.wrapper}>
                  <label htmlFor="">Price</label>
                  <input
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    required
                    type="text"
                    name="price"
                    id="vacationPrice"
                    className={errors.price && touched.price ? styles.inputError : ""}
                  />
                  {errors.price && touched.price && <p className={styles.error}>{errors.price}$</p>}
                </div>
              </div>

              <div className={styles.wrapper}>
                <label htmlFor="">Description</label>
                <textarea
                  onBlur={handleBlur}
                  required
                  name="description"
                  id="vacationDescription"
                  maxLength={255}
                  placeholder="Your description here..."
                  onChange={handleChange}
                  value={values.description}
                  className={errors.description && touched.description ? styles.inputError : ""}
                ></textarea>
                {errors.description && touched.description && <p className={styles.error}>{errors.description}</p>}
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={onClose} className={styles.secondary}>
          Cancel
        </button>
        <button type={"submit"} disabled={submitting} className={submitting ? styles.submittingBtn : styles.primary}>
          {submitting ? <Loader /> : `Create Vacation`}
        </button>
      </div>
    </form>
  );
};

export default CreateVacationContent;
