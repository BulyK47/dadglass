import { RO_TEXT } from "@content/localized";

export function localizeWeekText(text: string, language: string) {
  return language === "ro" ? RO_TEXT[text] ?? text : text;
}

export function localizeWeekList(items: string[], language: string) {
  return items.map(item => localizeWeekText(item, language));
}
