"use client";
import useScheduleStore from "@/modules/Schedule/useScheduleStore";
import { colors, week } from "@/consts";
import styles from "./Schedule.module.scss";
import moment from "moment-timezone";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
    return parseInt((count / 2 + 0.5).toString());
  }
  return count - 1;
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
  useEffect(() => {
    if (searchSelectedWeek && searchSelectedGroup) {
      setSelectedGroup(searchSelectedGroup);
      setSelectedWeek(searchSelectedWeek);
    }
  }, []);
  if (!Object.keys(schedule[selectedGroup]).includes(selectedWeek)) {
    return <div>Расписание за указанную неделю не найдено</div>;
  }
  return (
    <div
      className={`${styles.schedule} ${searchSelectedWeek && searchSelectedGroup ? styles.bot : ""}`}
    >
      {week
        .filter((item) =>
          schedule[selectedGroup][selectedWeek][item]
            ? schedule[selectedGroup][selectedWeek][item].length > 0
            : false,
        )
        .map((item) => {
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
                {schedule[selectedGroup][selectedWeek][item].map(
                  (lesson, lessonIndex) => {
                    return (
                      <div key={lessonIndex} className={styles.lesson}>
                        <div className={styles.time}>
                          {lesson.time} ({lesson.type}. Осталось:{" "}
                          {getLeftLessons(
                            schedule[selectedGroup],
                            selectedWeek,
                            lesson,
                            item,
                          )}
                          )
                        </div>
                        <div className={styles.lessonContent}>
                          <div
                            className={styles.border}
                            style={{ background: colors[lesson.type] }}
                          />
                          <div>
                            <div>
                              {lesson.number}. {lesson.name}
                            </div>
                            <div>{lesson.pos}</div>
                            <div>
                              {lesson.teacher === ""
                                ? "Преподаватель не найден"
                                : lesson.teacher}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Schedule;
