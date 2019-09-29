var fs = require("fs");

var regions = JSON.parse(fs.readFileSync("regions.json"));
var indicators = JSON.parse(fs.readFileSync("indicators.json"));
var values = JSON.parse(fs.readFileSync("values.json"));
var sites = JSON.parse(fs.readFileSync("sites.json"));

var valArr = [];
for (let v of values) {
  if (!Array.isArray(valArr[v.indicatorId])) valArr[v.indicatorId] = [];
  if (!Array.isArray(valArr[v.indicatorId][v.year]))
    valArr[v.indicatorId][v.year] = [];
  valArr[v.indicatorId][v.year][v.osmId] = v.value;
}

//Make decomposed centers-years table
var sitesAtYear = [];

for (let year = 2009; year < 2019; year++) {
  sitesAtYear[year] = [];
  for (let r of regions) {
    let say = sites.reduce(
      (cnt, s) => (cnt += s.year <= year && s.osmId == r.osmId ? 1 : 0),
      0
    );
    sitesAtYear[year][r.osmId] = say;
  }
}

var deaths7D_PerBirth = [];
var deaths1Y_PerBirth = [];
var deadborns_PerBirth = [];
var perinatal_PerBirth = [];
for (let year = 2009; year < 2019; year++) {
  deaths1Y_PerBirth[year] = [];
  deaths7D_PerBirth[year] = [];
  deadborns_PerBirth[year] = [];
  perinatal_PerBirth[year] = [];
  for (let r of regions) {
    deaths1Y_PerBirth[year][r.osmId] =
      valArr[1][year][r.osmId] / valArr[0][year][r.osmId];
    deaths7D_PerBirth[year][r.osmId] =
      valArr[4][year][r.osmId] / valArr[0][year][r.osmId];
    deadborns_PerBirth[year][r.osmId] =
      valArr[3][year][r.osmId] / valArr[0][year][r.osmId];
    perinatal_PerBirth[year][r.osmId] =
      valArr[2][year][r.osmId] / valArr[0][year][r.osmId];
  }
}

function corr(d) {
  let corr_res = [];
  for (let r of regions) {
    let d_cnt = 0;
    let d_sum = 0;
    let say_sum = 0;
    for (let year = 2009; year < 2019; year++) {
      if (d[year][r.osmId]) {
        d_sum += d[year][r.osmId];
        d_cnt++;
        say_sum += sitesAtYear[year][r.osmId];
      }
    }
    let x2_sum = 0,
      y2_sum = 0,
      xy_sum = 0;
    if (d_cnt && say_sum) {
      for (let year = 2009; year < 2019; year++) {
        let xc = d[year][r.osmId] - d_sum / d_cnt;
        let yc = sitesAtYear[year][r.osmId] - say_sum / d_cnt;
        x2_sum += xc * xc;
        y2_sum += yc * yc;
        xy_sum += xc * yc;
      }
      if (y2_sum) corr_res[r.osmId] = xy_sum / Math.sqrt(x2_sum * y2_sum);
    }
  }
  return corr_res;
}

var corr_deaths7D_say = corr(deaths7D_PerBirth);
var corr_deaths1Y_say = corr(deaths1Y_PerBirth);
var corr_deadborns_say = corr(deadborns_PerBirth);
var corr_perinatal_say = corr(perinatal_PerBirth);

console.log({
  corr_deaths7D_say,
  corr_deaths1Y_say,
  corr_deadborns_say,
  corr_perinatal_say
});
