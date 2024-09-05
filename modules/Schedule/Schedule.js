"use client";
import useScheduleStore from "@/modules/Schedule/useScheduleStore";
import { colors, week } from "@/consts";
import styles from "./Schedule.module.scss";
import moment from "moment-timezone";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
        .filter(
          (item) => schedule[selectedGroup][selectedWeek][item].length > 0,
        )
        .map((item, itemIndex) => {
          return (
            <div key={item} className={styles.weekLessons}>
              <div className={styles.date}>
                {item}{" "}
                {moment("2024-09-02")
                  .add(selectedWeek - 1, "weeks")
                  .startOf("isoWeek")
                  .add(itemIndex, "days")
                  .format("DD-MM-YYYY")}
              </div>
              <div className={styles.content}>
                {schedule[selectedGroup][selectedWeek][item].map(
                  (lesson, lessonIndex) => {
                    return (
                      <div key={lessonIndex} className={styles.lesson}>
                        <div className={styles.time}>
                          {lesson.time} ({lesson.type})
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
