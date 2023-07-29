import React, { FC, useEffect, useState } from "react";
import styles from "./Pagination.module.scss";
import { VacationType } from "../../../models/Vacation";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  pages: number;
  data: any[];
  setData:any[]
  currentPageData?:VacationType[];

  setCurrentPage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ data, currentPage, lastPage, perPage, setCurrentPage, pages }) => {
  const [array, setArray] = useState<any[][]>([]);

  useEffect(() => {
    // Create an array with the number of cells as the maxLength prop
    const newPages = Array.from({ length: pages }, (_, index) => index + 1);
    setArray(newPages.map(page => data.slice((page - 1) * perPage, page * perPage)));
    
  }, [data, pages, perPage]);

  useEffect(() => {
console.log(array);

  },[array])

  return (
    <div className={styles.Pagination}>
      <div className={styles.page}>
        {/* Render the Previous button */}
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {/* Render the pages */}
        {array.map((pageNumber, index) => (
          <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={index + 1 === currentPage ? styles.active : ""}>
            {index + 1}
          </button>
        ))}
        {/* Render the Next button */}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === lastPage}>
          Next
        </button>
      </div>
      {/* Render the paged data */}
      <div>
        {array[currentPage - 1]?.map((vacation, index) => (
          <div key={index}>{/* Render your vacation data here */}</div>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
