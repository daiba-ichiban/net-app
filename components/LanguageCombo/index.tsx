"use client";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

import { languages } from "@/app/[lng]/i18n/settings";
import Link from "next/link";
import { useTranslation } from "@/app/[lng]/i18n/client";
import { useSearchParams, usePathname } from "next/navigation";

const langSet = new Set(languages);
const langs = [
  { label: "日本語", value: "ja" },
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
  { label: "Deutsch", value: "de" },
  { label: "Español", value: "es" },
  { label: "Português", value: "pt" },
  { label: "Русский", value: "ru" },
  { label: "한국어", value: "ko" },
  { label: "中文", value: "zh" },
] as const;

const getLabel = (value: string): string | undefined =>
  langs.find((lang) => lang.value === value)?.label;

const LanguageCombo = ({ params }: { params: { lng: string } }) => {
  const path = usePathname();
  const search = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation(params.lng);
  const exceptLangPath = path.split("/").slice(2).join("/");
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>{`${t("language.selected")} ${getLabel(
          params.lng
        )}`}</PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandGroup>
              {langs.map((lang) => {
                return (
                  langSet.has(lang.value) && (
                    <CommandItem key={lang.value} value={lang.value}>
                      <Link href={`/${lang.value}/${exceptLangPath}?${search}`}>
                        {lang.label}
                      </Link>
                    </CommandItem>
                  )
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default LanguageCombo;
