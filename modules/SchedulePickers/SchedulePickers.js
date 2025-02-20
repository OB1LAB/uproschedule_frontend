"use client";
import styles from "./SchedulePickers.module.scss";
import { Button, SelectPicker } from "rsuite";
import useScheduleStore from "@/modules/Schedule/useScheduleStore";
import moment from "moment-timezone";
import ArrowRightLine from "@rsuite/icons/legacy/ArrowRightLine";
import ArrowLeftLine from "@rsuite/icons/legacy/ArrowLeftLine";
import { groups } from "@/consts";

const SchedulePickers = () => {
  const schedule = useScheduleStore((store) => store.schedule);
  const [selectedGroup, setSelectedGroup] = useScheduleStore((store) => [
    store.selectedGroup,
    store.setSelectedGroup,
  ]);
  const [selectedWeek, setSelectedWeek] = useScheduleStore((store) => [
    store.selectedWeek,
    store.setSelectedWeek,
  ]);
  const nextWeek = () => {
    const selectedWeekIndex = Object.keys(schedule[selectedGroup]).indexOf(
      selectedWeek,
    );
    if (selectedWeekIndex < Object.keys(schedule[selectedGroup]).length - 1) {
      setSelectedWeek(
        Object.keys(schedule[selectedGroup])[selectedWeekIndex + 1],
      );
    }
  };
  const preventWeek = () => {
    const selectedWeekIndex = Object.keys(schedule[selectedGroup]).indexOf(
      selectedWeek,
    );
    if (selectedWeekIndex > 0) {
      setSelectedWeek(
        Object.keys(schedule[selectedGroup])[selectedWeekIndex - 1],
      );
    }
  };
  return (
    <div className={styles.pickers}>
      <div className={styles.desktop}>
        <Button
          style={{ marginRight: "-10px", height: "100%" }}
          appearance="primary"
          onClick={preventWeek}
          disabled={
            Object.keys(schedule[selectedGroup]).indexOf(selectedWeek) === 0
          }
        >
          <ArrowLeftLine />
        </Button>
      </div>
      <SelectPicker
        className={styles.picker}
        cleanable={false}
        searchable={false}
        data={groups.map((item) => {
          return {
            label: `${item}Б`,
            value: item,
          };
        })}
        value={selectedGroup}
        onChange={(value) => {
          if (!Object.keys(schedule[value]).includes(selectedWeek)) {
            setSelectedWeek(
              (moment().diff(moment("2024-09-02"), "weeks") + 1).toString(),
            );
          }
          setSelectedGroup(value);
        }}
      />
      <SelectPicker
        className={styles.picker}
        cleanable={false}
        searchable={false}
        data={Object.keys(schedule[selectedGroup]).map((item) => {
          const monday = moment("2024-09-02")
            .add(item - 1, "weeks")
            .startOf("isoWeek");
          return {
            label: `${item} (${monday.format("DD-MM-YYYY")})`,
            value: item,
          };
        })}
        value={selectedWeek}
        onChange={setSelectedWeek}
      />
      <div className={styles.desktop}>
        <Button
          style={{ marginLeft: "-10px", height: "100%" }}
          onClick={nextWeek}
          appearance="primary"
          disabled={
            Object.keys(schedule[selectedGroup]).indexOf(selectedWeek) ===
            Object.keys(schedule[selectedGroup]).length - 1
          }
        >
          <ArrowRightLine />
        </Button>
      </div>
      <div className={styles.mobile}>
        <Button
          appearance="primary"
          onClick={preventWeek}
          disabled={
            Object.keys(schedule[selectedGroup]).indexOf(selectedWeek) === 0
          }
        >
          Предыдущая неделя
        </Button>
        <Button
          style={{ marginLeft: "-10px" }}
          onClick={nextWeek}
          appearance="primary"
          disabled={
            Object.keys(schedule[selectedGroup]).indexOf(selectedWeek) ===
            Object.keys(schedule[selectedGroup]).length - 1
          }
        >
          Следующая неделя
        </Button>
      </div>
    </div>
  );
};

export default SchedulePickers;
