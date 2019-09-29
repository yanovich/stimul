import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import React, { useState, useEffect } from "react";

const query = `
query ($osmId: String!, $indicatorId: [String]!) {
  region(osmId: $osmId) {
    statName
    osmId
  }
  values: valuesByOsmId(indicatorId: $indicatorId, osmId: $osmId) {
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
          indicatorName: v.indicator.name
        }))
      });
    });
  }, [osmId, gql, indicatorId]);

  const cols = {
    year: {}
  };
  // return null;
  return (
    <div style={{ flex: 1 }}>
      <h2>{data.region && data.region.statName}</h2>
      <Chart height={400} data={data.values} scale={cols} forceFit>
        <Legend />
        <Axis name="year" />
        <Axis name="value" />
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
      </Chart>
    </div>
  );
}

export default Curved;
