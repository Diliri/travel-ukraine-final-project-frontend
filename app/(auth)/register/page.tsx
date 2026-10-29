import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm/AuthForm";

export const metadata: Metadata = {
  title: "Реєстрація | Природні Мандри",
  description: "Створіть акаунт у спільноті свідомих мандрівників",
};

export default function RegisterPage() {
  return <AuthForm />;
}
