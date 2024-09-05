import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.min.css";
import "./globals.scss";
import CustomBody from "@/modules/CustomBody/CustomBody";

export const metadata = {
  title: "UProSchedule",
  description: "Расписание программной инженерии",
  openGraph: {
    title: "UProSchedule",
    description: "Расписание программной инженерии",
    siteName: "OB1LAB",
    locale: "ru_RU",
    type: "website",
    url: "https://uproschedule.ob1lab.ru/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ff00ff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <CustomBody>{children}</CustomBody>
    </html>
  );
}
