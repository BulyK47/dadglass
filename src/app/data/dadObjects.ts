export type DadObjectType =
  | "watch"
  | "button"
  | "key"
  | "pen"
  | "tape-measure"
  | "lock"
  | "wallet"
  | "smartphone"
  | "cable"
  | "coffee"
  | "notebook"
  | "tie"
  | "belt"
  | "newspaper"
  | "sunglasses"
  | "umbrella"
  | "charger"
  | "tool"
  | "power-bank"
  | "water-bottle"
  | "toolbox"
  | "lamp"
  | "backpack";

export type DadObjectAssetId =
  | "watch-crown"
  | "watch-face"
  | "shirt-button"
  | "small-keyring"
  | "mailbox-key"
  | "ballpoint-pen"
  | "tape-measure-hook"
  | "short-tape-measure-pull"
  | "front-door-lock-cylinder"
  | "wallet-corner"
  | "card-sleeve"
  | "folded-wallet"
  | "phone-camera-bar"
  | "charging-cable-coil"
  | "smartphone"
  | "espresso-cup"
  | "coffee-mug"
  | "travel-mug"
  | "pocket-notebook"
  | "notebook-spine"
  | "desk-notebook"
  | "folded-tie"
  | "rolled-belt"
  | "folded-newspaper"
  | "sunglasses"
  | "compact-umbrella"
  | "laptop-charger-with-cable"
  | "multitool"
  | "full-screwdriver"
  | "socket-wrench"
  | "flashlight"
  | "power-bank"
  | "gym-water-bottle"
  | "small-toolbox"
  | "toolbox-handle"
  | "desk-lamp-head"
  | "dad-backpack";

export interface DadObjectInfo {
  week: number;
  assetId: DadObjectAssetId;
  imageFile: string;
  type: DadObjectType;
  name: string;
  description: string;
  variant?: number;
  nameRo?: string;
  descriptionRo?: string;
}

export type RawDadObjectInfo = Omit<DadObjectInfo, "imageFile" | "variant">;

export function dadObjectImageFile(week: number) {
  return `/assets/dad-objects/w${week}.webp`;
}

import { weekObjects } from "@content/dadObjects";

const WEEK_OBJECTS: RawDadObjectInfo[] = weekObjects;


export const DAD_OBJECT_ASSET_IDS: DadObjectAssetId[] = WEEK_OBJECTS.map((object) => object.assetId);

export const DAD_OBJECTS_BY_WEEK: Record<number, DadObjectInfo> = Object.fromEntries(
  WEEK_OBJECTS.map((object, index) => [
    object.week,
    { ...object, variant: index, imageFile: dadObjectImageFile(object.week) },
  ]),
) as Record<number, DadObjectInfo>;

export function getDadObjectForWeek(week: number, language: "en" | "ro" = "en"): DadObjectInfo {
  const object = DAD_OBJECTS_BY_WEEK[week] ?? DAD_OBJECTS_BY_WEEK[40];
  if (language === "ro") {
    return {
      ...object,
      name: object.nameRo ?? object.name,
      description: object.descriptionRo ?? object.description,
    };
  }
  return object;
}

export const DAD_OBJECTS: Record<string, DadObjectInfo> = {
  "Shot Glass": DAD_OBJECTS_BY_WEEK[5],
  "Cordial Glass": DAD_OBJECTS_BY_WEEK[12],
  "Nick & Nora Glass": DAD_OBJECTS_BY_WEEK[18],
  "Rocks Glass": DAD_OBJECTS_BY_WEEK[15],
  "Wine Glass": DAD_OBJECTS_BY_WEEK[22],
  "Highball Glass": DAD_OBJECTS_BY_WEEK[28],
  "Collins Glass": DAD_OBJECTS_BY_WEEK[31],
  "Goblet": DAD_OBJECTS_BY_WEEK[25],
  "Hurricane Glass": DAD_OBJECTS_BY_WEEK[34],
  "Pint Glass": DAD_OBJECTS_BY_WEEK[40],
};
