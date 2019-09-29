import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import React, { useState, useEffect } from "react";

const query = `
query ($osmId: String!, $indicatorId: [String]!) {
  region(osmId: $osmId) {
    statName
    osmId
  }
  values: valuesByOsmId(indicatorId: $indicatorId, osmId: $osmId) {
    targetCount
    indicatorId
    indicator{
      id
      name
    }
    year
    value
  }
}
`;

function correlation(values) {
  const l = values.length;
  const { sumX, sumY } = values.reduce(
    (acc, cur, index) => {
      return {
        sumX: acc.sumX + cur.targetCount,
        sumY: acc.sumY + cur.value
      };
    },
    { sumX: 0, sumY: 0 }
  );
  const avgX = sumX / l;
  const avgY = sumY / l;
  const { dxdy, dx2, dy2 } = values.reduce(
    (acc, cur, index) => {
      return {
        dxdy: acc.dxdy + (cur.targetCount - avgX) * (cur.value - avgY),
        dx2: acc.dx2 + (cur.targetCount - avgX) ** 2,
        dy2: acc.dy2 + (cur.value - avgY) ** 2
      };
    },
    { dxdy: 0, dx2: 0, dy2: 0 }
  );
  const r = dxdy / Math.sqrt(dx2 * dy2);
  const m = (1 - r * r) / (l > 30 ? Math.sqrt(l) : Math.sqrt(l - 1));

  return { r, m };
}

function Curved({ osmId, gql, indicatorId }) {
  const [data, setData] = useState({ values: [] });

  useEffect(() => {
    gql(query, { osmId, indicatorId }, response => {
      setData({
        ...response.data,
        correlation: correlation(response.data.values),
        values: response.data.values.map(v => ({
          ...v,
          indicatorName: v.indicator.name,
          targetCountTitle: "Действующие ПЦ"
        }))
      });
    });
  }, [osmId, gql, indicatorId]);

  const scale = {
    year: {},
    value: {},
    targetCount: {
      max: 10
    }
  };
  // return null;
  return (
    <div style={{ flex: 1 }}>
      <h2>{data.region && data.region.statName}</h2>
      {data.correlation &&
        !isNaN(data.correlation.r) &&
        !isNaN(data.correlation.m) &&
        `Корреляция: ${data.correlation.r}, средняя ошибка: ${data.correlation.m}`}
      <Chart height={400} data={data.values} scale={scale} forceFit>
        <Legend />
        <Axis name="year" />
        <Axis name="value" />
        <Axis name="targetCount" grid={null} />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />

        <Geom
          type="line"
          position="year*value"
          size={2}
          color={"indicatorName"}
          shape={"smooth"}
        />
        <Geom
          type="point"
          position="year*value"
          size={4}
          shape={"circle"}
          color={"indicatorName"}
        />
        <Geom
          type="interval"
          position="year*targetCount"
          color={"targetCountTitle"}
          max={10}
          shape={"smooth"}
        />
      </Chart>
    </div>
  );
}

export default Curved;
