import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm/AuthForm";

export const metadata: Metadata = {
  title: "Вхід | Природні Мандри",
  description: "Увійдіть до спільноти свідомих мандрівників",
};

export default function LoginPage() {
  return <AuthForm type="login" />;
}
