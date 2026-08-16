import type { Units } from "../context/AppContext";

type MetricMeasurement = { weight: string; length: string };

const METRIC_BY_WEEK: Record<number, MetricMeasurement> = {
  4: { weight: "< 1 g", length: "0.2 cm" },
  5: { weight: "< 1 g", length: "0.3 cm" },
  6: { weight: "< 1 g", length: "0.4 cm" },
  7: { weight: "< 1 g", length: "1.0 cm" },
  8: { weight: "1 g", length: "1.6 cm" },
  9: { weight: "2 g", length: "2.3 cm" },
  10: { weight: "4 g", length: "3.1 cm" },
  11: { weight: "7 g", length: "4.1 cm" },
  12: { weight: "14 g", length: "5.4 cm" },
  13: { weight: "23 g", length: "7.4 cm" },
  14: { weight: "43 g", length: "8.7 cm" },
  15: { weight: "70 g", length: "10.1 cm" },
  16: { weight: "100 g", length: "11.6 cm" },
  17: { weight: "140 g", length: "13.0 cm" },
  18: { weight: "190 g", length: "14.2 cm" },
  19: { weight: "240 g", length: "15.3 cm" },
  20: { weight: "300 g", length: "25.6 cm" },
  21: { weight: "360 g", length: "26.7 cm" },
  22: { weight: "430 g", length: "27.8 cm" },
  23: { weight: "500 g", length: "28.9 cm" },
  24: { weight: "600 g", length: "30.0 cm" },
  25: { weight: "660 g", length: "34.6 cm" },
  26: { weight: "760 g", length: "35.6 cm" },
  27: { weight: "875 g", length: "36.6 cm" },
  28: { weight: "1.0 kg", length: "37.6 cm" },
  29: { weight: "1.15 kg", length: "38.6 cm" },
  30: { weight: "1.3 kg", length: "39.9 cm" },
  31: { weight: "1.5 kg", length: "41.1 cm" },
  32: { weight: "1.7 kg", length: "42.4 cm" },
  33: { weight: "1.9 kg", length: "43.7 cm" },
  34: { weight: "2.1 kg", length: "45.0 cm" },
  35: { weight: "2.4 kg", length: "46.2 cm" },
  36: { weight: "2.6 kg", length: "47.4 cm" },
  37: { weight: "2.9 kg", length: "48.6 cm" },
  38: { weight: "3.1 kg", length: "49.8 cm" },
  39: { weight: "3.3 kg", length: "50.7 cm" },
  40: { weight: "3.5 kg", length: "51.2 cm" },
};

function numberFrom(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function convertWeight(metric: string) {
  const value = numberFrom(metric);
  if (value === null) return metric;
  if (metric.includes("kg")) {
    const lb = value * 2.20462;
    return `${lb.toFixed(lb >= 10 ? 1 : 2)} lb`;
  }
  const oz = value * 0.035274;
  if (metric.trim().startsWith("<") || oz < 0.1) return "< 0.1 oz";
  return `${oz < 1 ? oz.toFixed(2) : oz.toFixed(1)} oz`;
}

function convertLength(metric: string) {
  const value = numberFrom(metric);
  if (value === null) return metric;
  const inches = value * 0.393701;
  return `${inches.toFixed(inches >= 10 ? 1 : 2)} in`;
}

export function getDisplayMeasurements(
  week: number,
  babyWeight: string | undefined,
  babyLength: string | undefined,
  units: Units,
) {
  const fallback = METRIC_BY_WEEK[week] ?? METRIC_BY_WEEK[12];
  const metric = {
    weight: babyWeight ?? fallback.weight,
    length: babyLength ?? fallback.length,
  };

  if (units === "imperial") {
    return {
      weight: convertWeight(metric.weight),
      length: convertLength(metric.length),
    };
  }

  return metric;
}
