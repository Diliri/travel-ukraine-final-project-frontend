import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm/LoginForm";

export const metadata: Metadata = {
  title: "Вхід | Природні Мандри",
  description: "Увійдіть до спільноти свідомих мандрівників",
};

export default function LoginPage() {
  return <LoginForm />;
}
