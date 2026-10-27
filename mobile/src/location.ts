import React from "react";
import * as Location from "expo-location";
import type { Result } from "./api";

export type Coordinate = { latitude: number; longitude: number };

const EARTH_RADIUS_METRES = 6_371_000;

// Great-circle distance (haversine), the same sum the server checks claims with.
export function distanceMetres(a: Coordinate, b: Coordinate): number {
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METRES * Math.asin(Math.sqrt(h));
}

// "40 m", "950 m", "1.4 km", "12 km". The cut-offs sit where rounding would
// otherwise give "1000 m" or "10.0 km".
export function formatDistance(metres: number): string {
  if (metres < 995) return `${Math.round(metres / 10) * 10} m`;
  const km = metres / 1000;
  return km < 9.95 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

// Where the phone is now, asking for permission if needed.
export async function currentPosition(): Promise<Result<Coordinate>> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return { ok: false, message: "Explorie needs your location to check you're at the drop." };
  try {
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { ok: true, value: { latitude: coords.latitude, longitude: coords.longitude } };
  } catch {
    return { ok: false, message: "Couldn't find your location." };
  }
}

// The phone's position as it moves, or undefined until it's known or if
// location access is refused.
export function usePosition(): Coordinate | undefined {
  const [position, setPosition] = React.useState<Coordinate>();
  React.useEffect(() => {
    let cancelled = false;
    let subscription: Location.LocationSubscription | undefined;
    Location.requestForegroundPermissionsAsync()
      .then(async ({ granted }) => {
        if (!granted || cancelled) return;
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 20 },
          ({ coords }) => setPosition({ latitude: coords.latitude, longitude: coords.longitude }),
        );
        if (cancelled) subscription.remove();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);
  return position;
}
