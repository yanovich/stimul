import { Radio } from "antd";
import "antd/dist/antd.css";
import React from "react";
import "./index.css";

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};

export default function RadioIndicator({
  indicators,
  onChange,
  value,
  dataType,
  onChangeDataType
}) {
  return (
    <>
      <h2>Показатели</h2>
      <Radio.Group
        value={dataType}
        buttonStyle="solid"
        onChange={e => onChangeDataType(e.target.value)}
      >
        <Radio.Button value="absolute">Абсолютные</Radio.Button>
        <Radio.Button value="relative">Относительные</Radio.Button>
        <Radio.Button disabled value="correlation">
          Корреляция
        </Radio.Button>
      </Radio.Group>
      <Radio.Group onChange={e => onChange(e.target.value)} value={value}>
        {indicators.map(indicator => (
          <Radio style={radioStyle} key={indicator.id} value={indicator.id}>
            {indicator.name}
          </Radio>
        ))}
      </Radio.Group>
    </>
  );
}
