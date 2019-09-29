import { Radio } from "antd";
import "antd/dist/antd.css";
import React from "react";
import "./index.css";

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};

export default function RadioIndicator({ indicators, onChange, value }) {
  return (
    <Radio.Group onChange={e => onChange(e.target.value)} value={value}>
      {indicators.map(indicator => (
        <Radio style={radioStyle} key={indicator.id} value={indicator.id}>
          {indicator.name}
        </Radio>
      ))}
    </Radio.Group>
  );
}
