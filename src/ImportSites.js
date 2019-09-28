import React, { useState, useEffect } from "react";
import TextArea from "antd/lib/input/TextArea";
import { Table } from "antd";
import { yandex } from "./geocoder";

const tmpInput = `
osmId	name	year	address
72193	ГУЗ "КЛИНИЧЕСКИЙ ПЕРИНАТАЛЬНЫЙ ЦЕНТР САРАТОВСКОЙ ОБЛАСТИ"	2011	410047, САРАТОВСКАЯ ОБЛАСТЬ, ГОРОД САРАТОВ, УЛИЦА ЗЕРНОВАЯ,33
108083	БУ РК "ПЕРИНАТАЛЬНЫЙ ЦЕНТР ИМ. О.А. ШУНГАЕВОЙ"	2012	358000, КАЛМЫКИЯ РЕСПУБЛИКА, ГОРОД ЭЛИСТА, УЛИЦА В.И.ЛЕНИНА,227
`;

function useCsv(source = "") {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    const lines = source.split("\n").filter(Boolean);
    // console.log(lines);
    let titles = [];
    let arr = [];
    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      let cells = line.split("\t");
      //   console.log(cells);
      if (l === 0) {
        titles = [...cells];
        if (titles.includes("address"))
          titles.push("lat", "lng", "real_address");
        setColumns(titles.map(t => ({ title: t, key: t, dataIndex: t })));
      } else {
        let obj = {};
        for (let i = 0; i < titles.length; i++) {
          obj[titles[i]] = cells[i];
        }
        obj.key = cells.join("");

        arr.push(obj);
      }
    }
    setData(arr);
    if (titles.includes("address")) {
      async function load() {
        let dataWithCoordinates = await Promise.all(
          arr.map(async row => {
            const d = await yandex(row.address);
            // console.log(d);

            let coordinates = d.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
              " "
            );
            let label =
              d.response.GeoObjectCollection.featureMember[0].GeoObject
                .metaDataProperty.GeocoderMetaData.text;
            return {
              ...row,
              lat: coordinates[0],
              lng: coordinates[1],
              real_address: label
            };
          })
        );
        console.log({ dataWithCoordinates });

        setData(dataWithCoordinates);
      }
      load();
    }
  }, [source]);
  return { data, columns };
}

export default function ImportSites(props) {
  const [source, setSource] = useState(tmpInput);

  const { data, columns } = useCsv(source);
  //   console.log({ data, columns });

  return (
    <main>
      <h1>Импорт объектов Excel</h1>
      <TextArea value={source} onChange={e => setSource(e.target.value)} />
      <Table dataSource={data} columns={columns} />
    </main>
  );
}
