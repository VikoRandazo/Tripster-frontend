import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "./Pagination.module.scss";
import { useDispatch } from "react-redux";

interface PaginationProps<T> {
  perPage: number;
  data: T[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const Pagination = <T extends any>(props: PaginationProps<T>) => {
  const { perPage, data, currentPage, setCurrentPage } = props;
  const [pages, setPages] = useState<number[]>([]);
  const [lastPage, setLastPage] = useState<number>(0);

  useEffect(() => {
    setLastPage(pages.length);
  }, [pages]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevstate) => prevstate - 1);
    }
  };

  const setCustomPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentPage(Number(e.currentTarget.innerText));
  };

  const goToNextPage = () => {
    setCurrentPage((prevstate) => prevstate + 1);
  };

  useEffect(() => {
    const totalPages = Math.ceil(data.length / perPage);
    setPages(new Array(totalPages).fill(0).map((_, index) => index + 1));
  }, [data, perPage]);

  return (
    <div className={styles.Pagination}>
      <div className={styles.page}>
        <button
          className={styles.paginationBtn}
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {pages.map((pageNumber, index) => (
          <button
            key={index}
            onClick={setCustomPage}
            className={
              pageNumber === currentPage
                ? `${styles.paginationBtn} ${styles.selected}`
                : `${styles.paginationBtn}`
            }
          >
            {pageNumber}
          </button>
        ))}
        <button
          className={styles.paginationBtn}
          onClick={goToNextPage}
          disabled={currentPage === lastPage}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
