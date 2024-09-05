import { create } from "zustand";
import { persist } from "zustand/middleware";
import ScheduleService from "@/services/ScheduleService";
import moment from "moment-timezone";
import { toast } from "react-toastify";

const useScheduleStore = create(
  persist(
    (set, get) => ({
      selectedGroup: "201",
      selectedWeek: (
        moment().diff(moment("2024-09-02"), "weeks") + 1
      ).toString(),
      schedule: {},
      setSelectedGroup: (selectedGroup) => {
        set({ selectedGroup });
      },
      setSelectedWeek: (selectedWeek) => {
        set({ selectedWeek });
      },
      getSchedule: async () => {
        try {
          const res = await ScheduleService.get();
          set({ schedule: res.data });
        } catch (e) {
          console.log(e);
          return toast("Ошибка", {
            render: "Ошибка",
            type: "error",
            autoClose: 3000,
          });
        }
      },
    }),
    {
      name: "user-data",
      partialize: (store) => ({
        selectedGroup: store.selectedGroup,
      }),
    },
  ),
);

export default useScheduleStore;
