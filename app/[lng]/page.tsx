import React from "react";
import Link from "next/link";
import { useTranslation } from "./i18n";

const HomePage = async ({ params }: { params: { lng: string } }) => {
  const { t } = await useTranslation(params.lng);
  return (
    <>
      <h1>{t("home.title")}</h1>
      <Link href={`/${params.lng}/about`}>{t("home.link.about")}</Link>
    </>
  );
};
export default HomePage;
