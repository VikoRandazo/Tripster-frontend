import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Vacation.module.scss";
import { FaHeart, FaRegCalendarAlt, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { VacationType } from "../../models/Vacation";
import { User } from "../../models/User";
import Modal from "../Modal/Modal";
import EditVacationContent from "./EditVacationContent/EditVacationContent";
import Prompt from "../CustomElements/Prompt/Prompt";
import Alert from "../CustomElements/Alert/Alert";
import instance from "../../api/AxiosInstance";
import { useDispatch } from "react-redux";
import { vacationsActions } from "../../slices/vacationsSlice";
import { Follower } from "../../models/Follower";

interface VacationProps {
  vacation: VacationType;
  user: User;
}

const Vacation: FC<VacationProps> = ({ vacation, user }) => {
  let { vacation_id, destination, description, start_date, end_date, price, image_path } = vacation;
  const [like, setLike] = useState<boolean>(false);
  const [likes, setLikes] = useState<[]>([]);
  const [isOpenEditVacation, setIsOpenEditVacation] = useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const dispatch = useDispatch();

  const getLikes = async () => {
    try {
      const response = await instance.get(`/like/${vacation_id}`);
      const likedByUser = response.data.some((like: Follower) => like.vacation_id === vacation_id);

      if (response.data) {
        setLikes(response.data);

        if (likedByUser) {
          likeBtn.current?.classList.add(styles.liked);
        } else {
          likeBtn.current?.classList.remove(styles.liked);
        }
      }
    } catch (error: any) {
      setAlertMessage(error.message);
      setIsActiveAlertModal(true);
    }
  };

  const likeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    getLikes();
  }, [like]);

  const handleLikeVacation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      const response = await instance.post(`/like/${user.user_id}`, { vacation_id });
      if (response.data.likeAdded) {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (error: any) {
      setAlertMessage(error.message);
      setIsActiveAlertModal(true);
    }
  };
  const [isActiveAlertModal, setIsActiveAlertModal] = useState<boolean>(false);

  const DeleteVacation = async () => {
    setIsOpenConfirmDelete(true);
  };

  useEffect(() => {
    const handleDeleteVacation = async () => {
      try {
        if (isConfirmed && vacation_id) {
          const response = await instance.delete(`/vacations/${vacation_id}`);
          dispatch(vacationsActions.deleteVacation(vacation_id));
        } else {
          setIsConfirmed(false);
        }
      } catch (error: any) {
        setAlertMessage(error.message);
        setIsActiveAlertModal(true);
      }
    };
    handleDeleteVacation();
  }, [isConfirmed]);

  const openEditVacationModal = () => {
    setIsOpenEditVacation(true);
  };

  const onClose = () => {
    if (isOpenEditVacation) {
      setIsOpenEditVacation(false);
    } else if (isOpenConfirmDelete) {
      setIsOpenConfirmDelete(false);
    } else if (isActiveAlertModal) {
      setIsActiveAlertModal(false);
    }
    setIsConfirmed(false);
  };

  const handleConfirmation = (confirmation: boolean) => {
    setIsConfirmed(confirmation);
  };

  useEffect(() => {}, []);
  return (
    <div className={styles.Vacation}>
      {isOpenEditVacation && (
        <Modal isActive={isOpenEditVacation} onClose={onClose} title={"Edit vacation"}>
          <EditVacationContent vacation={vacation} onClose={onClose} />
        </Modal>
      )}

      {isOpenConfirmDelete && (
        <Modal
          isActive={isOpenConfirmDelete}
          onClose={onClose}
          title={`Are you sure you want to delete ${destination}`}
        >
          <Prompt
            message={`Are you sure you want to delete ${destination}?`}
            onClose={onClose}
            data={destination}
            onConfirm={handleConfirmation}
          />
        </Modal>
      )}

      <Modal isActive={isActiveAlertModal} onClose={onClose} title={alertMessage}>
        <Alert onClose={onClose} alertMessage={alertMessage} />
      </Modal>

      <div
        className={styles.image}
        style={{
          background: `url(${image_path})`,
          backgroundSize: `cover`,
          backgroundPosition: `bottom`,
        }}
      >
        <div className={styles.title}>
          <h3>{destination}</h3>
        </div>
      </div>
      <div className={styles.header}>
        <FaRegCalendarAlt />
        <span>
          {start_date.split(`-`).reverse().join(`/`)} - {end_date.split(`-`).reverse().join(`/`)}
        </span>
      </div>
      <div className={styles.main}>
        <p>{description}</p>
      </div>
      <div className={styles.footer}>
        {user.isAdmin ? (
          <div className={styles.actions}>
            <button onClick={DeleteVacation} className={styles.secondary}>
              <FaTrashAlt />
            </button>
            <button onClick={openEditVacationModal} className={styles.primary}>
              <FaPencilAlt />
            </button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button ref={likeBtn} onClick={handleLikeVacation} className={styles.secondary}>
              <FaHeart />
              {likes.length}
            </button>
            <button className={styles.primary}>{price}$</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vacation;
