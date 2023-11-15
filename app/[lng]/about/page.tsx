import Link from "next/link";
import { useTranslation } from "../i18n";
const AboutPage = async ({ params }: { params: { lng: string } }) => {
  const { t: tdef } = await useTranslation(params.lng);
  const { t: tsp } = await useTranslation(params.lng, "special");

  return (
    <>
      <h1>{tdef("about.title")}</h1>
      <Link href={`/${params.lng}/`}>{tdef("back.home")}</Link>
      <p>{tsp("special.description")}</p>
    </>
  );
};

export default AboutPage;
