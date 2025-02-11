"use client";
import useScheduleStore from "@/modules/Schedule/useScheduleStore";
import { colors, timesLessons, week } from "@/consts";
import styles from "./Schedule.module.scss";
import moment from "moment-timezone";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Tooltip, Whisper } from "rsuite";

const getLeftLessons = (lessons, weekLesson, lesson, weekName) => {
  let count = 0;
  const maxWeek = Math.max(
    ...Object.keys(lessons).map((weekNum) => Number(weekNum)),
  );
  for (let i = weekLesson; i < maxWeek; i++) {
    if (Object.keys(lessons).includes(i.toString())) {
      const weeksName = Object.keys(lessons[i]).filter(
        (itemWeek) =>
          (i === weekLesson &&
            week.findIndex((item) => item === itemWeek) >=
              week.findIndex((item) => item === weekName)) ||
          i > weekLesson,
      );
      weeksName.forEach((item) => {
        lessons[i][item].map((currentLesson) => {
          if (
            ((i === weekLesson &&
              item === weekName &&
              Number(currentLesson.number) > Number(lesson.number)) ||
              (i === weekLesson &&
                week.findIndex((listWeek) => listWeek === item) >
                  week.findIndex((listWeek) => listWeek === weekName)) ||
              i > weekLesson) &&
            currentLesson.name === lesson.name &&
            currentLesson.type === lesson.type &&
            currentLesson.teacher === lesson.teacher
          )
            count++;
        });
      });
    }
  }
  if (lesson.type === "Лабораторная работа") {
    return parseInt((count / 2).toString());
  }
  return count;
};

const Schedule = () => {
  const searchParams = useSearchParams();
  const schedule = useScheduleStore((store) => store.schedule);
  const [selectedGroup, setSelectedGroup] = useScheduleStore((store) => [
    store.selectedGroup,
    store.setSelectedGroup,
  ]);
  const [selectedWeek, setSelectedWeek] = useScheduleStore((store) => [
    store.selectedWeek,
    store.setSelectedWeek,
  ]);
  const searchSelectedGroup = searchParams.get("selectedGroup");
  const searchSelectedWeek = searchParams.get("selectedWeek");
  const getTimeToLesson = (date, time) => {
    const lessonDatetime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm");
    const nowDatetime = moment();
    let diffHours = lessonDatetime.diff(nowDatetime, "hours");
    let diffMinutes = Math.abs(
      lessonDatetime.diff(nowDatetime, "minutes") % 60,
    );
    let diffSeconds = Math.abs(
      lessonDatetime.diff(nowDatetime, "seconds") % 60,
    );
    if (String(Math.abs(diffHours)).length === 1) {
      if (diffHours >= 0) {
        diffHours = `0${String(Math.abs(diffHours))}`;
      } else {
        diffHours = `-0${String(Math.abs(diffHours))}`;
      }
    }
    if (String(Math.abs(diffMinutes)).length === 1) {
      diffMinutes = `0${diffMinutes}`;
    }
    if (String(Math.abs(diffSeconds)).length === 1) {
      diffSeconds = `0${diffSeconds}`;
    }
    return `${diffHours}:${diffMinutes}:${diffSeconds}`;
  };
  useEffect(() => {
    if (searchSelectedWeek && searchSelectedGroup) {
      setSelectedGroup(searchSelectedGroup);
      setSelectedWeek(searchSelectedWeek);
    }
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSelectedWeek(selectedWeek);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);
  if (!Object.keys(schedule[selectedGroup]).includes(selectedWeek)) {
    return <div>Расписание за указанную неделю не найдено</div>;
  }
  return (
    <div
      className={`${styles.schedule} ${searchSelectedWeek && searchSelectedGroup ? styles.bot : ""}`}
    >
      {week
        .filter(
          (item) =>
            !(
              week.findIndex((itemWeek) => itemWeek === item) === 5 &&
              (!schedule[selectedGroup][selectedWeek][item] ||
                schedule[selectedGroup][selectedWeek][item].length === 0)
            ),
        )
        .map((item) => {
          if (
            !schedule[selectedGroup][selectedWeek][item] ||
            schedule[selectedGroup][selectedWeek][item].length === 0
          ) {
            return (
              <div key={item} className={styles.weekLessons}>
                <div className={styles.date}>
                  {item}{" "}
                  {moment("2024-09-02")
                    .add(selectedWeek - 1, "weeks")
                    .startOf("isoWeek")
                    .add(
                      week.findIndex((itemWeek) => itemWeek === item),
                      "days",
                    )
                    .format("DD-MM-YYYY")}
                </div>
                <div className={styles.content}>
                  <div className={styles.lesson}>
                    <div
                      className={styles.time}
                      style={{ textAlign: "center", padding: "15px 0 0 0" }}
                    >
                      Пар нет
                    </div>
                    <div className={styles.lessonContent}>
                      <div
                        className={styles.border}
                        style={{ background: "yellow" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          const lessonsNumber = [];
          const maxLessonNumber = Math.max(
            ...schedule[selectedGroup][selectedWeek][item].map((itemLesson) => {
              return Number(itemLesson.number);
            }),
          );
          for (
            let lessonNumber = 1;
            lessonNumber <= maxLessonNumber;
            lessonNumber++
          ) {
            lessonsNumber.push(lessonNumber);
          }
          const stringDate = moment("2024-09-02")
            .add(selectedWeek - 1, "weeks")
            .startOf("isoWeek")
            .add(
              week.findIndex((itemWeek) => itemWeek === item),
              "days",
            )
            .format("DD-MM-YYYY");
          return (
            <div key={item} className={styles.weekLessons}>
              <div className={styles.date}>
                {item} {stringDate}
              </div>
              <div className={styles.content}>
                {lessonsNumber.map((itemFind, itemIndex) => {
                  const foundedLesson = schedule[selectedGroup][selectedWeek][
                    item
                  ].find((item) => Number(item.number) === itemFind);
                  if (foundedLesson) {
                    const [time1, time2] = foundedLesson.time.split("-");
                    return (
                      <div key={itemIndex} className={styles.lesson}>
                        <div className={styles.time}>
                          <Whisper
                            followCursor
                            speaker={
                              <Tooltip>
                                {getTimeToLesson(stringDate, time1)}
                              </Tooltip>
                            }
                            trigger={"click"}
                            placement="top"
                          >
                            {time1}
                          </Whisper>
                          -
                          <Whisper
                            followCursor
                            speaker={
                              <Tooltip>
                                {getTimeToLesson(stringDate, time2)}
                              </Tooltip>
                            }
                            trigger={"click"}
                            placement="top"
                          >
                            {time2}
                          </Whisper>{" "}
                          ({foundedLesson.type}. Осталось:{" "}
                          {getLeftLessons(
                            schedule[selectedGroup],
                            selectedWeek,
                            foundedLesson,
                            item,
                          )}
                          )
                        </div>
                        <div className={styles.lessonContent}>
                          <div
                            className={styles.border}
                            style={{ background: colors[foundedLesson.type] }}
                          />
                          <div>
                            <div>
                              {foundedLesson.number}. {foundedLesson.name}
                            </div>
                            <div>{foundedLesson.pos}</div>
                            <div>
                              {foundedLesson.teacher === ""
                                ? "Преподаватель не найден"
                                : foundedLesson.teacher}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const [time1, time2] = timesLessons[itemFind].split("-");
                  return (
                    <div key={itemIndex} className={styles.lesson}>
                      <div className={styles.time}>
                        <Whisper
                          followCursor
                          speaker={
                            <Tooltip>
                              {getTimeToLesson(stringDate, time1)}
                            </Tooltip>
                          }
                          trigger={"click"}
                          placement="top"
                        >
                          {time1}
                        </Whisper>
                        -
                        <Whisper
                          followCursor
                          speaker={
                            <Tooltip>
                              {getTimeToLesson(stringDate, time2)}
                            </Tooltip>
                          }
                          trigger={"click"}
                          placement="top"
                        >
                          {time2}
                        </Whisper>{" "}
                      </div>
                      <div className={styles.lessonContent}>
                        <div
                          className={styles.border}
                          style={{ background: colors.window }}
                        />
                        <div>
                          <div>{itemFind}. Окно</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Schedule;
