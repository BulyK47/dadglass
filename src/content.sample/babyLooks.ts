import type { BabyLook, BabyLookLanguage } from "../app/data/babyLooks";

const makeBabyLook = (
  week: number,
  concept: Record<BabyLookLanguage, string>,
  visualFocus: Record<BabyLookLanguage, string>,
): BabyLook => ({
  week,
  imagePath: `/assets/baby/aw${week}.webp`,
  concept,
  visualFocus,
});

/** PLACEHOLDER content — see CONTENT_LICENSE.md. */
export const babyLooks: Record<number, BabyLook> = {
  4: makeBabyLook(
    4,
    { en: "Sample baby illustration note for week 4.", ro: "Notă exemplu despre ilustrație, săptămâna 4." },
    { en: "Sample visual focus (week 4).", ro: "Reper vizual exemplu (săptămâna 4)." },
  ),
  5: makeBabyLook(
    5,
    { en: "Sample baby illustration note for week 5.", ro: "Notă exemplu despre ilustrație, săptămâna 5." },
    { en: "Sample visual focus (week 5).", ro: "Reper vizual exemplu (săptămâna 5)." },
  ),
  6: makeBabyLook(
    6,
    { en: "Sample baby illustration note for week 6.", ro: "Notă exemplu despre ilustrație, săptămâna 6." },
    { en: "Sample visual focus (week 6).", ro: "Reper vizual exemplu (săptămâna 6)." },
  ),
  7: makeBabyLook(
    7,
    { en: "Sample baby illustration note for week 7.", ro: "Notă exemplu despre ilustrație, săptămâna 7." },
    { en: "Sample visual focus (week 7).", ro: "Reper vizual exemplu (săptămâna 7)." },
  ),
  8: makeBabyLook(
    8,
    { en: "Sample baby illustration note for week 8.", ro: "Notă exemplu despre ilustrație, săptămâna 8." },
    { en: "Sample visual focus (week 8).", ro: "Reper vizual exemplu (săptămâna 8)." },
  ),
  9: makeBabyLook(
    9,
    { en: "Sample baby illustration note for week 9.", ro: "Notă exemplu despre ilustrație, săptămâna 9." },
    { en: "Sample visual focus (week 9).", ro: "Reper vizual exemplu (săptămâna 9)." },
  ),
  10: makeBabyLook(
    10,
    { en: "Sample baby illustration note for week 10.", ro: "Notă exemplu despre ilustrație, săptămâna 10." },
    { en: "Sample visual focus (week 10).", ro: "Reper vizual exemplu (săptămâna 10)." },
  ),
  11: makeBabyLook(
    11,
    { en: "Sample baby illustration note for week 11.", ro: "Notă exemplu despre ilustrație, săptămâna 11." },
    { en: "Sample visual focus (week 11).", ro: "Reper vizual exemplu (săptămâna 11)." },
  ),
  12: makeBabyLook(
    12,
    { en: "Sample baby illustration note for week 12.", ro: "Notă exemplu despre ilustrație, săptămâna 12." },
    { en: "Sample visual focus (week 12).", ro: "Reper vizual exemplu (săptămâna 12)." },
  ),
  13: makeBabyLook(
    13,
    { en: "Sample baby illustration note for week 13.", ro: "Notă exemplu despre ilustrație, săptămâna 13." },
    { en: "Sample visual focus (week 13).", ro: "Reper vizual exemplu (săptămâna 13)." },
  ),
  14: makeBabyLook(
    14,
    { en: "Sample baby illustration note for week 14.", ro: "Notă exemplu despre ilustrație, săptămâna 14." },
    { en: "Sample visual focus (week 14).", ro: "Reper vizual exemplu (săptămâna 14)." },
  ),
  15: makeBabyLook(
    15,
    { en: "Sample baby illustration note for week 15.", ro: "Notă exemplu despre ilustrație, săptămâna 15." },
    { en: "Sample visual focus (week 15).", ro: "Reper vizual exemplu (săptămâna 15)." },
  ),
  16: makeBabyLook(
    16,
    { en: "Sample baby illustration note for week 16.", ro: "Notă exemplu despre ilustrație, săptămâna 16." },
    { en: "Sample visual focus (week 16).", ro: "Reper vizual exemplu (săptămâna 16)." },
  ),
  17: makeBabyLook(
    17,
    { en: "Sample baby illustration note for week 17.", ro: "Notă exemplu despre ilustrație, săptămâna 17." },
    { en: "Sample visual focus (week 17).", ro: "Reper vizual exemplu (săptămâna 17)." },
  ),
  18: makeBabyLook(
    18,
    { en: "Sample baby illustration note for week 18.", ro: "Notă exemplu despre ilustrație, săptămâna 18." },
    { en: "Sample visual focus (week 18).", ro: "Reper vizual exemplu (săptămâna 18)." },
  ),
  19: makeBabyLook(
    19,
    { en: "Sample baby illustration note for week 19.", ro: "Notă exemplu despre ilustrație, săptămâna 19." },
    { en: "Sample visual focus (week 19).", ro: "Reper vizual exemplu (săptămâna 19)." },
  ),
  20: makeBabyLook(
    20,
    { en: "Sample baby illustration note for week 20.", ro: "Notă exemplu despre ilustrație, săptămâna 20." },
    { en: "Sample visual focus (week 20).", ro: "Reper vizual exemplu (săptămâna 20)." },
  ),
  21: makeBabyLook(
    21,
    { en: "Sample baby illustration note for week 21.", ro: "Notă exemplu despre ilustrație, săptămâna 21." },
    { en: "Sample visual focus (week 21).", ro: "Reper vizual exemplu (săptămâna 21)." },
  ),
  22: makeBabyLook(
    22,
    { en: "Sample baby illustration note for week 22.", ro: "Notă exemplu despre ilustrație, săptămâna 22." },
    { en: "Sample visual focus (week 22).", ro: "Reper vizual exemplu (săptămâna 22)." },
  ),
  23: makeBabyLook(
    23,
    { en: "Sample baby illustration note for week 23.", ro: "Notă exemplu despre ilustrație, săptămâna 23." },
    { en: "Sample visual focus (week 23).", ro: "Reper vizual exemplu (săptămâna 23)." },
  ),
  24: makeBabyLook(
    24,
    { en: "Sample baby illustration note for week 24.", ro: "Notă exemplu despre ilustrație, săptămâna 24." },
    { en: "Sample visual focus (week 24).", ro: "Reper vizual exemplu (săptămâna 24)." },
  ),
  25: makeBabyLook(
    25,
    { en: "Sample baby illustration note for week 25.", ro: "Notă exemplu despre ilustrație, săptămâna 25." },
    { en: "Sample visual focus (week 25).", ro: "Reper vizual exemplu (săptămâna 25)." },
  ),
  26: makeBabyLook(
    26,
    { en: "Sample baby illustration note for week 26.", ro: "Notă exemplu despre ilustrație, săptămâna 26." },
    { en: "Sample visual focus (week 26).", ro: "Reper vizual exemplu (săptămâna 26)." },
  ),
  27: makeBabyLook(
    27,
    { en: "Sample baby illustration note for week 27.", ro: "Notă exemplu despre ilustrație, săptămâna 27." },
    { en: "Sample visual focus (week 27).", ro: "Reper vizual exemplu (săptămâna 27)." },
  ),
  28: makeBabyLook(
    28,
    { en: "Sample baby illustration note for week 28.", ro: "Notă exemplu despre ilustrație, săptămâna 28." },
    { en: "Sample visual focus (week 28).", ro: "Reper vizual exemplu (săptămâna 28)." },
  ),
  29: makeBabyLook(
    29,
    { en: "Sample baby illustration note for week 29.", ro: "Notă exemplu despre ilustrație, săptămâna 29." },
    { en: "Sample visual focus (week 29).", ro: "Reper vizual exemplu (săptămâna 29)." },
  ),
  30: makeBabyLook(
    30,
    { en: "Sample baby illustration note for week 30.", ro: "Notă exemplu despre ilustrație, săptămâna 30." },
    { en: "Sample visual focus (week 30).", ro: "Reper vizual exemplu (săptămâna 30)." },
  ),
  31: makeBabyLook(
    31,
    { en: "Sample baby illustration note for week 31.", ro: "Notă exemplu despre ilustrație, săptămâna 31." },
    { en: "Sample visual focus (week 31).", ro: "Reper vizual exemplu (săptămâna 31)." },
  ),
  32: makeBabyLook(
    32,
    { en: "Sample baby illustration note for week 32.", ro: "Notă exemplu despre ilustrație, săptămâna 32." },
    { en: "Sample visual focus (week 32).", ro: "Reper vizual exemplu (săptămâna 32)." },
  ),
  33: makeBabyLook(
    33,
    { en: "Sample baby illustration note for week 33.", ro: "Notă exemplu despre ilustrație, săptămâna 33." },
    { en: "Sample visual focus (week 33).", ro: "Reper vizual exemplu (săptămâna 33)." },
  ),
  34: makeBabyLook(
    34,
    { en: "Sample baby illustration note for week 34.", ro: "Notă exemplu despre ilustrație, săptămâna 34." },
    { en: "Sample visual focus (week 34).", ro: "Reper vizual exemplu (săptămâna 34)." },
  ),
  35: makeBabyLook(
    35,
    { en: "Sample baby illustration note for week 35.", ro: "Notă exemplu despre ilustrație, săptămâna 35." },
    { en: "Sample visual focus (week 35).", ro: "Reper vizual exemplu (săptămâna 35)." },
  ),
  36: makeBabyLook(
    36,
    { en: "Sample baby illustration note for week 36.", ro: "Notă exemplu despre ilustrație, săptămâna 36." },
    { en: "Sample visual focus (week 36).", ro: "Reper vizual exemplu (săptămâna 36)." },
  ),
  37: makeBabyLook(
    37,
    { en: "Sample baby illustration note for week 37.", ro: "Notă exemplu despre ilustrație, săptămâna 37." },
    { en: "Sample visual focus (week 37).", ro: "Reper vizual exemplu (săptămâna 37)." },
  ),
  38: makeBabyLook(
    38,
    { en: "Sample baby illustration note for week 38.", ro: "Notă exemplu despre ilustrație, săptămâna 38." },
    { en: "Sample visual focus (week 38).", ro: "Reper vizual exemplu (săptămâna 38)." },
  ),
  39: makeBabyLook(
    39,
    { en: "Sample baby illustration note for week 39.", ro: "Notă exemplu despre ilustrație, săptămâna 39." },
    { en: "Sample visual focus (week 39).", ro: "Reper vizual exemplu (săptămâna 39)." },
  ),
  40: makeBabyLook(
    40,
    { en: "Sample baby illustration note for week 40.", ro: "Notă exemplu despre ilustrație, săptămâna 40." },
    { en: "Sample visual focus (week 40).", ro: "Reper vizual exemplu (săptămâna 40)." },
  ),
};
