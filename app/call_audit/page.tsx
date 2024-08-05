"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { CgCloseO } from "react-icons/cg";
import { SlCallOut, SlCallIn } from "react-icons/sl";
import { useGetsalesrecordsQuery } from "@/services/callAuditServices";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

interface Metadata {
  Call_DateTime_IST: string;
  Call_Duration: string;
  Agent_Name: string;
  Agent_Email: string;
  Call_Type: string;
  S3_Rec_URL: string;
  Transcription_URL: string;
  Transcript_Model: string;
  Agent_Number: string;
  Caller_Number: string;
  LS_Lead_ID: string;
  Vendor: string;
  Trans_DateTime_IST: string;
  QA_DateTime_IST: string;
  QA_URL: string;
  QA_Model: string;
  LS_Agent_Name: string;
  LS_Agent_Email: string;
  Agent_ID: string;
}

interface Record {
  METADATA: Partial<Metadata>;
  CALL_ID: string;
}

const parseVTT = async (url: string): Promise<{ start: number; end: number; text: string }[]> => {
  try {
    const response = await axios.get(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const text = response.data;
    const cues: { start: number; end: number; text: string }[] = [];

    const lines = text.split("\n");
    let startTime = 0;
    let endTime = 0;
    let cueText = "";

    lines.forEach((line: any) => {
      if (line.includes("-->")) {
        const [start, end] = line.split(" --> ").map((time: any) => {
          const [hours, minutes, seconds] = time.split(":");
          const [secs, millis] = (seconds || "0").split(".");
          return (
            parseInt(hours) * 3600 +
            parseInt(minutes) * 60 +
            parseInt(secs) +
            (parseInt(millis) || 0) / 1000
          );
        });
        startTime = start;
        endTime = end;
      } else if (line.trim() === "") {
        if (cueText) {
          cues.push({ start: startTime, end: endTime, text: cueText.trim() });
          cueText = "";
        }
      } else {
        cueText += line + " ";
      }
    });

    if (cueText) {
      cues.push({ start: startTime, end: endTime, text: cueText.trim() });
    }

    return cues;
  } catch (error) {
    console.error("Error fetching VTT file:", error);
    return [];
  }
};

const Page = () => {
  const [data, setData] = useState<Record[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<Partial<Metadata> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [cues, setCues] = useState<{ start: number; end: number; text: string }[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const recordsPerPage = 100;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const { data: sales_records, error: fetchError, isFetching } = useGetsalesrecordsQuery("");

  useEffect(() => {
    if (sales_records) {
      setData(sales_records.data);
    }
  }, [sales_records]);

  useEffect(() => {
    if (selectedRow) {
      const fetchCues = async () => {
        setLoadingTranscript(true);
        if (selectedRow.Transcription_URL !== "") {
          const parsedCues = await parseVTT(selectedRow.Transcription_URL ?? "");
          setCues(parsedCues);
        } else {
          setCues([]);
        }
        setLoadingTranscript(false);
      };
      fetchCues();
    }
  }, [selectedRow]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateHighlight = () => {
      if (!audio) return;
      const currentTime = audio.currentTime;
      console.log("currentTime", currentTime);
      const index = cues.findIndex(cue => (currentTime * 60) >= cue.start && (currentTime * 60) <= cue.end);
      console.log("currentTimeindex", index);
      setHighlightedIndex(index);
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateHighlight);
      return () => {
        audio.removeEventListener("timeupdate", updateHighlight);
      };
    }
  }, [cues]);

  useEffect(() => {
    if (highlightedIndex !== null && transcriptRef.current) {
      const highlightedElement = transcriptRef.current.children[highlightedIndex];
      if (highlightedElement) {
        const { offsetTop, offsetHeight } = highlightedElement as HTMLElement;
        const { scrollTop, clientHeight } = transcriptRef.current;
        const scrollPosition = offsetTop - clientHeight / 0.85 + offsetHeight / 0.85;
        transcriptRef.current.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleRowClick = (row: Record, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedRow(row.METADATA);
    setSidebarOpen(true);
    if (audioRef.current && row.METADATA.S3_Rec_URL) {
      audioRef.current.src = row.METADATA.S3_Rec_URL ?? "";
      audioRef.current.load();
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedRow(null);
  };

  const filteredData = data.filter((item) => {
    return (
      item.METADATA.Call_DateTime_IST?.toLowerCase().includes(search) ||
      item.METADATA.Agent_Email?.toLowerCase().includes(search) ||
      item.METADATA.Agent_Name?.toLowerCase().includes(search) ||
      item.METADATA.Agent_Number?.toLowerCase().includes(search) ||
      item.METADATA.Caller_Number?.toLowerCase().includes(search) ||
      item.METADATA.Call_Duration?.toLowerCase().includes(search) ||
      item.METADATA.Call_Type?.toLowerCase().includes(search) ||
      item.METADATA.LS_Agent_Name?.toLowerCase().includes(search) ||
      item.METADATA.LS_Agent_Email?.toLowerCase().includes(search)
    );
  });

  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.METADATA.Call_DateTime_IST ?? "").getTime();
    const dateB = new Date(b.METADATA.Call_DateTime_IST ?? "").getTime();
    if (dateA !== dateB) {
      return dateB - dateA; // Sort by DateTime (latest to oldest)
    }
    const durationA = a.METADATA.Call_Duration ? parseInt(a.METADATA.Call_Duration.replace(/:/g, "")) : 0;
    const durationB = b.METADATA.Call_Duration ? parseInt(b.METADATA.Call_Duration.replace(/:/g, "")) : 0;
    return durationB - durationA; // Sort by Duration (highest to lowest)
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfMaxPagesToShow);

    if (currentPage <= halfMaxPagesToShow) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + halfMaxPagesToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <button
          key="start-ellipsis"
          className={styles.pageButton}
          disabled
        >
          ...
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <button
          key="end-ellipsis"
          className={styles.pageButton}
          disabled
        >
          ...
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <main className={styles.tableContainer}>
        <section className={`${styles.tableHeader} ${isScrolled ? styles.blurred : ""}`}>
          <h3>Call Logs</h3>
          <div className={styles.inputGroup}>
            <input type="search" placeholder="Search Data..." onChange={handleSearch} />
            <IoSearchOutline fontSize={"1.3rem"}/>
          </div>
        </section>
        <section id="table_container" className={styles.tableBody}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>DateTime</th>
                <th>Agent Name</th>
                <th>Agent Email</th>
                <th>Call Type</th>
                <th>Duration</th>
                <th>Lead URL</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "" : styles.alternateRow} ${
                    selectedRow === item.METADATA ? styles.selected : ""
                  }`}
                  onClick={(event) => handleRowClick(item, event)}
                >
                  <td>{item.METADATA.Call_DateTime_IST ?? "---"}</td>
                  <td>{item.METADATA.LS_Agent_Name ?? item.METADATA.Agent_Name ?? "---"}</td>
                  <td>{item.METADATA.LS_Agent_Email ?? item.METADATA.Agent_Email ?? "---"}</td>
                  <td>
                    {item.METADATA.Call_Type === "Outgoing" ? <SlCallOut fontSize={"0.9rem"} color={"#138dff"} className={styles.call_icon}/> : <SlCallIn fontSize={"0.9rem"} color={"#73A862"} className={styles.call_icon}/>}
                    {item.METADATA.Call_Type ?? "---"}
                  </td>
                  <td>{item.METADATA.Call_Duration ?? "---"}</td>
                  <td>
                    {item.METADATA.LS_Lead_ID ? (
                      <input
                        type="text"
                        value={`https://in21.leadsquared.com/LeadManagement/LeadDetails?LeadID=${item.METADATA.LS_Lead_ID}`}
                        readOnly
                        className={styles.readOnlyInput}
                      />
                    ) : (
                      "---"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            <FaArrowLeft />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            <FaArrowRight />
          </button>
        </div>
      </main>
      {sidebarOpen && (
        <>
          <div className={`${styles.sidebar_overlay} ${sidebarOpen ? styles.open : ""}`}></div>
          <div ref={sidebarRef} className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
            <div className={`${styles.tableHeading} ${isScrolled ? styles.blurred : ""}`}>
              <button className={styles.closeButton} onClick={closeSidebar}>
                <CgCloseO />
              </button>
              <h3>Call Details</h3>
            </div>
            {selectedRow && (
              <>
                <div className={styles.detailsContainer}>
                  <table className={styles.detailsTable}>
                    <tbody>
                      {Object.entries(selectedRow).map(([key, value]) => (
                        <tr key={key}>
                          <td><strong>{key}:</strong></td>
                          <td>{value ?? "---"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <hr />
                  <audio id="audio" ref={audioRef} controls className={styles.audioPlayer}>
                    <source src={selectedRow.S3_Rec_URL ?? ""} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  <hr />
                  <div ref={transcriptRef} className={styles.transcriptContainer}>
                    {loadingTranscript ? (
                      <div className="loader"></div>
                    ) : cues.length === 0 ? (
                      <p>No transcript available.</p>
                    ) : (
                      cues.map((cue, index) => (
                        <p key={index} className={`${styles.cue} ${index === highlightedIndex ? styles.highlighted : ""}`}>
                          {cue.text}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Page;
