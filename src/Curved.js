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

function Curved({ osmId, gql, indicatorId }) {
  const [data, setData] = useState({ values: [] });
  // console.log(data);

  useEffect(() => {
    gql(query, { osmId, indicatorId }, response => {
      setData({
        ...response.data,
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
          type="interval"
          position="year*targetCount"
          color={"targetCountTitle"}
          max={10}
          shape={"smooth"}
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
      </Chart>
    </div>
  );
}

export default Curved;
