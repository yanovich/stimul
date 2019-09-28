import React, { useEffect, useState } from "react";
import { Table } from "antd";

const columns = [
  { title: "Название", key: "statName", dataIndex: "statName" },
  { title: "Идентификатор", key: "osmId", dataIndex: "osmId" },
  { title: "Уровень", key: "level", dataIndex: "level" }
];

function Regions({ gql }) {
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    const query = `
    {
      regions {
        statName
        osmId
        level
      }
    }
  `;
    gql(query, null, response => {
      setRegions(response.data.regions);
    });
  }, [gql]);
  return (
    <>
      <Table dataSource={regions} columns={columns} rowKey="osmId"></Table>
    </>
  );
}

export const regionsScreen = {
  render: props => <Regions {...props}></Regions>
};
