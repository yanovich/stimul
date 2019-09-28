import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import React, { useState, useEffect } from "react";

const query = `
query ($osmId: String) {
  region(osmId: $osmId) {
    statName
    osmId
  }
  values(indicatorId: "0", osmId: [$osmId]) {
    indicatorId
    year
    value
  }
}
`;

function Curved({ osmId, gql }) {
  const [data, setData] = useState([]);
  // console.log(data);

  useEffect(() => {
    gql(query, { osmId }, response => {
      setData(response.data.values);
    });
  }, [osmId, gql]);

  const cols = {
    year: {}
  };
  // return null;
  return (
    <div>
      <Chart height={400} data={data} scale={cols} forceFit>
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
          color={"indicatorId"}
          shape={"smooth"}
        />
        <Geom
          type="point"
          position="year*value"
          size={4}
          shape={"circle"}
          color={"indicatorId"}
        />
      </Chart>
    </div>
  );
}

export default Curved;
