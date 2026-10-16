import React from "react";
import Svg, {
  Circle,
  Path,
  Line,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { C } from "./ui";
export default function DrillDiagram({ skill }: { skill: string }) {
  return (
    <Svg
      width="100%"
      height={130}
      viewBox="0 0 320 130"
      accessibilityLabel={`${skill} drill setup illustration`}
    >
      <Rect width="320" height="130" rx="16" fill="#EDF2EC" />
      <Path
        d="M160 112 L50 32 L270 32 Z"
        fill="none"
        stroke="#CBD8CE"
        strokeWidth="1"
      />
      {skill === "Hitting" ? (
        <>
          <Line
            x1="90"
            y1="95"
            x2="90"
            y2="52"
            stroke={C.navy}
            strokeWidth="5"
          />
          <Line
            x1="72"
            y1="96"
            x2="108"
            y2="96"
            stroke={C.navy}
            strokeWidth="4"
          />
          <Circle
            cx="90"
            cy="45"
            r="8"
            fill="white"
            stroke={C.red}
            strokeWidth="2"
          />
          <Path
            d="M110 45 Q175 0 232 48"
            stroke={C.red}
            strokeWidth="2"
            strokeDasharray="5 5"
            fill="none"
          />
          <Rect
            x="239"
            y="25"
            width="30"
            height="72"
            fill="none"
            stroke={C.navy}
            strokeWidth="2"
          />
          <SvgText
            x="165"
            y="116"
            textAnchor="middle"
            fill={C.muted}
            fontSize="11"
          >
            Balanced contact toward a safe net
          </SvgText>
        </>
      ) : skill === "Speed" ? (
        <>
          {[65, 125, 185, 245].map((x, i) => (
            <Path key={x} d={`M${x} 65 l-9 18 h18 Z`} fill={C.red} />
          ))}
          <Path
            d="M55 51 Q95 22 125 51 T245 51"
            fill="none"
            stroke={C.navy}
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <SvgText
            x="160"
            y="113"
            textAnchor="middle"
            fill={C.muted}
            fontSize="11"
          >
            Controlled steps · rest between rounds
          </SvgText>
        </>
      ) : (
        <>
          <Circle cx="82" cy="65" r="17" fill={C.navy} />
          <Circle
            cx="239"
            cy="65"
            r="25"
            fill="none"
            stroke={C.green}
            strokeWidth="2"
          />
          <Circle
            cx="239"
            cy="65"
            r="10"
            fill="none"
            stroke={C.green}
            strokeWidth="2"
          />
          <Path
            d="M112 65 H207"
            fill="none"
            stroke={C.red}
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <Path
            d="M199 59 l8 6 -8 6"
            fill="none"
            stroke={C.red}
            strokeWidth="2"
          />
          <SvgText
            x="160"
            y="113"
            textAnchor="middle"
            fill={C.muted}
            fontSize="11"
          >
            Comfortable distance · controlled movement
          </SvgText>
        </>
      )}
    </Svg>
  );
}
