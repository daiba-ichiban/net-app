This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), plus  **Internationalization(i18n)**.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Default locale is Japanese.

(auto redirect to [http://localhost:3000/ja](http://localhost:3000/ja)).

Or open [http://localhost:3000/en](http://localhost:3000/en) with your browser to see the US translation result.

You can start editing the page by modifying `app/[lng]/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Biz UDP Gothic/M Plus1 code, a custom Google Font.

## i18n

### how to use.

1. create locale directory on `app/[lng]/i18n/locales/`.
- For example, if you'd like to use French translation, create French locale `fr` directory.
2. create translation file, `translation.json` in locale named directory, like `fr`.
- traslation.json example:
```json
  { 
    "HELLO": "Bonjour",
    "TITLE.STRING": "ceci est une chaîne de titre."
  }
```
3. use `useTranslation` function on your server/client side code.
  - example code(server):
```tsx
import { useTranslation } from "@/app/[lng]/i18n";

const page = async ({ params }: { params: { lng: string } }) => {
  const { t } = await useTranslation(params.lng);
  return (
    <>
      <p>{t("TITLE.STRING")}</p>   
    </>
  );
};
export default page;
```
  -  example code(client):
```tsx
"use client";
import { useTranslation } from "@/app/[lng]/i18n/client";
const page = ({ params }: { params: { lng: string } }) => {
  const { t } = useTranslation(params.lng);
  return (
    <>
      <p>{t("HELLO")}</p>   
    </>
  );
};
export default page;
```

## Additional infomation.

By default, the language-specific words is obtained from the `translation.json` file, but it is also possible to define it with a different file name.

create translation file, `[YOUR_DESIGNATED_FILE_NAME].json` in locale named directory.

for example, if you have created `spacial.json` in locale directory, you call `t` function like below:

```tsx
      <p>{t("HELLO", "special")}</p>   
```

Specify the filename you have designated **as the second argument** of the `t` function, as in the above example.

***NOTE:*** If you add a new language file, please make sure that there are no undefined key-values in all same named language files in each locale directories.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
