/**
 * World map geometry for the regional meals globe.
 *
 * Direct port of phaserev/src/lib/world-map.ts:
 *   - Natural Earth countries (110m) from `world-atlas`, decoded with `topojson-client`
 *   - Orthographic projection + SVG paths from `d3-geo`
 *   - A region highlights every country whose centroid is near its coverage points
 */
import { geoCentroid, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

/** Decoded once at module load (~180 country shapes). */
const countries = feature(world, world.objects.countries).features;

/** Pre-computed centroids so highlighting doesn't redo the math per region. */
const centroids = countries.map((country) => geoCentroid(country));

const graticule = geoGraticule10();

function geoDistanceDegrees(lat1, lng1, lat2, lng2) {
  const latMid = ((lat1 + lat2) / 2) * (Math.PI / 180);
  const x = (lng2 - lng1) * Math.cos(latMid);
  const y = lat2 - lat1;
  return Math.sqrt(x * x + y * y);
}

const highlightCache = new Map();

/**
 * Country indexes to highlight for a region (same margins as the web).
 * @param {string} regionId
 * @param {{lat:number,lng:number}[]} coverage
 * @returns {Set<number>}
 */
export function getHighlightedCountries(regionId, coverage) {
  if (highlightCache.has(regionId)) return highlightCache.get(regionId);

  const margin = 9;
  const maxPointDistance = 17;
  const lats = coverage.map((p) => p.lat);
  const lngs = coverage.map((p) => p.lng);
  const minLat = Math.min(...lats) - margin;
  const maxLat = Math.max(...lats) + margin;
  const minLng = Math.min(...lngs) - margin;
  const maxLng = Math.max(...lngs) + margin;

  const ids = new Set();
  centroids.forEach(([lng, lat], index) => {
    const inBox = lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    const nearPoint = coverage.some(
      (p) => geoDistanceDegrees(lat, lng, p.lat, p.lng) <= maxPointDistance,
    );
    if (inBox || nearPoint) ids.add(index);
  });

  highlightCache.set(regionId, ids);
  return ids;
}

/**
 * SVG path strings for the current view.
 * @param {{lat:number,lng:number}} center  point facing the viewer
 * @param {number} radius
 * @returns {{ countries: {index:number, d:string}[], graticule: string }}
 */
export function projectGlobe(center, radius) {
  const projection = geoOrthographic()
    .rotate([-center.lng, -center.lat])
    .translate([radius, radius])
    .scale(radius)
    .clipAngle(90);
  const path = geoPath(projection);

  const shapes = [];
  countries.forEach((country, index) => {
    const d = path(country);
    if (d) shapes.push({ index, d });
  });

  return { countries: shapes, graticule: path(graticule) ?? "" };
}
