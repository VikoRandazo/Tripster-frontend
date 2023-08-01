import React, { FC, useEffect, useState } from "react";
import styles from "./Pagination.module.scss";
import { VacationType } from "../../../models/Vacation";
import { current } from "@reduxjs/toolkit";

interface PaginationProps {
  perPage: number;
  data: any[];
  setData: (newDataArray: any[][]) => void;
}

const Pagination: FC<PaginationProps> = ({ data, perPage, setData }) => {
  const [array, setArray] = useState<any[][]>([]);
  const [pages, setPages] = useState<number[]>([]);

  const [lastPage, setLastPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [page, setPage] = useState<number>(currentPage);

  // lastPage
  useEffect(() => {
    setLastPage(pages.length);
    if (array) {
      console.log(array);
    }
  }, [array, pages]);

  // prevPage
  const goToPrevPage = () => {
    if (page > 1) {
      setPage((prevstate) => prevstate - 1);
    } else {
      return;
    }
  };

  const setCustomPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { innerText } = e.currentTarget;
    setPage(Number(innerText));
  };

  const goToNextPage = () => {
    setPage((prevstate) => prevstate + 1);
  };

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, data.length);
    const dataInPage = data.slice(startIndex, endIndex);
    setArray(dataInPage);
    setData(dataInPage);
  }, [page, perPage]);

  const fillPagesArray = () => {
    if (array.length > 0) {
      const totalPages = Math.ceil(data.length / perPage);
      setPages(new Array(totalPages).fill(0).map((_, index) => index + 1));
    }
  };

  useEffect(() => {
    if (array.length > 0) {
      fillPagesArray();
    }
  }, [data, perPage]);

  return (
    <div className={styles.Pagination}>
      <div className={styles.page}>
        <button onClick={goToPrevPage} disabled={page === 1}>
          Previous
        </button>
        {pages.map((page, index) => (
          <button key={index + 1} onClick={setCustomPage} className={index + 1 === page ? styles.active : ""}>
            {page}
          </button>
        ))}
        <button onClick={goToNextPage} disabled={page === lastPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
