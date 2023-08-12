import React, { FC, useEffect, useState } from "react";
import styles from "./LikeBtn.module.scss";
import { Follower } from "../../../models/Follower";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import instance from "../../../api/AxiosInstance";
import { VacationType } from "../../../models/Vacation";
import { User } from "../../../models/User";

interface LikeBtnProps {
  likes: Follower[];
  user: User;
  vacation: VacationType;
}

const LikeBtn: FC<LikeBtnProps> = ({ likes, user, vacation }) => {
  const { vacation_id } = vacation;

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [vacationLikes, setVacationLikes] = useState<Follower[]>([]);

  const handleLikeVacation = async () => {
    const response = await instance.post(`/like/${user.user_id}`, { vacation_id });

    if (response.data.likeAdded) {
      setIsLiked(true);
      vacationLikes.push(response.data.vacation);
    } else if (response.data.likeRemoved) {
      setIsLiked(false);

      const likeIndex = vacationLikes.findIndex(
        (like) => response.data.vacation_id && user.user_id === like.user_id
      );
      vacationLikes.splice(likeIndex, 1);
    }
  };

  useEffect(() => {
    const initLikedVacations = likes.some((like: Follower) => {
      return like.user_id === user.user_id && vacation.vacation_id === like.vacation_id;});
    
      setIsLiked(initLikedVacations);
  }, []);

  useEffect(() => {
    const initLikedObj = likes.filter((like: Follower) => {
      return vacation.vacation_id === like.vacation_id;
    });
    setVacationLikes(initLikedObj);
  }, []);

  return (
    <button
      className={isLiked ? `${styles.LikeBtn} ${styles.liked}` : styles.LikeBtn}
      onClick={handleLikeVacation}
    >
      {isLiked ? <HiBookmark /> : <HiOutlineBookmark />}
      {vacationLikes.length}
    </button>
  );
};

export default LikeBtn;
