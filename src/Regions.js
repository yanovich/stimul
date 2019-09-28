import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";

const columns = [
  { title: "Название", key: "statName", dataIndex: "statName" },
  { title: "Идентификатор", key: "osmId", dataIndex: "osmId" }
];

function Regions({ gql }) {
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    const query = `
    {
      regions {
        statName
        osmId
      }
    }
  `;
    gql(query, null, response => {
      setRegions(response.data.regions);
    });
  }, [gql]);
  return (
    <>
      <Table dataSource={regions} columns={columns}></Table>
    </>
  );
}

export const regionsScreen = {
  render: props => <Regions {...props}></Regions>
};
