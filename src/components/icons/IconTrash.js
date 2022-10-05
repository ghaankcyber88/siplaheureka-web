import React from "react";
const IconTrash = (props) => (
    <>
        <img
            {...props}
            src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAyMjYgMjI2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwyMjZ2LTIyNmgyMjZ2MjI2eiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNlNzRjM2MiPjxwYXRoIGQ9Ik0xMTMsMTguODMzMzNjLTE2LjUxODMyLDAgLTMwLjI3MjcyLDEyLjM0MjU4IC0zMi41ODEzLDI4LjI1aC0zMi4yMTM0NmMtMC40MDA5NSwtMC4wNjg2MSAtMC44MDcwOSwtMC4xMDI0NSAtMS4yMTM4NywtMC4xMDExNmMtMC4zNTE0OCwwLjAwNzU4IC0wLjcwMTksMC4wNDEzOSAtMS4wNDgzNCwwLjEwMTE2aC0xNS4zMzg4N2MtMi41NDY5OSwtMC4wMzYwMiAtNC45MTYwNywxLjMwMjE1IC02LjIwMDA4LDMuNTAyMWMtMS4yODQwMSwyLjE5OTk1IC0xLjI4NDAxLDQuOTIwODQgMCw3LjEyMDhjMS4yODQwMSwyLjE5OTk1IDMuNjUzMDksMy41MzgxMiA2LjIwMDA4LDMuNTAyMWgxMC4wNjk1OGwxMS44NTM2LDEyMi41NTQ2MWMxLjI3NjMzLDEzLjIxNDU0IDEyLjUwMzEzLDIzLjQwMzczIDI1Ljc3NjI4LDIzLjQwMzczaDY5LjM4MzU1YzEzLjI3Mzg0LDAgMjQuNTAwNDYsLTEwLjE4ODA0IDI1Ljc3NjI4LC0yMy40MDM3M2wxMS44NjI3OSwtMTIyLjU1NDYxaDEwLjA2OTU4YzIuNTQ2OTksMC4wMzYwMiA0LjkxNjA3LC0xLjMwMjE1IDYuMjAwMDgsLTMuNTAyMWMxLjI4NDAxLC0yLjE5OTk1IDEuMjg0MDEsLTQuOTIwODQgMCwtNy4xMjA4Yy0xLjI4NDAxLC0yLjE5OTk1IC0zLjY1MzA5LC0zLjUzODEyIC02LjIwMDA4LC0zLjUwMjFoLTE1LjMyOTY3Yy0wLjc0OTE3LC0wLjEyMTU0IC0xLjUxMzA0LC0wLjEyMTU0IC0yLjI2MjIxLDBoLTMyLjIyMjY2Yy0yLjMwODU4LC0xNS45MDc0MiAtMTYuMDYyOTgsLTI4LjI1IC0zMi41ODEzLC0yOC4yNXpNMTEzLDMyLjk1ODMzYzguODQ3NjksMCAxNi4xMDYxMSw1Ljk3MDkyIDE4LjE4MDQyLDE0LjEyNWgtMzYuMzYwODRjMi4wNzQzMSwtOC4xNTQwOCA5LjMzMjczLC0xNC4xMjUgMTguMTgwNDIsLTE0LjEyNXpNNTQuODUzOTIsNjEuMjA4MzNoMTE2LjI4Mjk2bC0xMS43MzQwNSwxMjEuMTkzNmMtMC41ODg2OCw2LjA5NzkgLTUuNTkxMTcsMTAuNjM5NzMgLTExLjcxNTY2LDEwLjYzOTczaC02OS4zODM1NWMtNi4xMTU3NiwwIC0xMS4xMjc0OSwtNC41NTAxMSAtMTEuNzE1NjYsLTEwLjYzOTczek05Ni40MTA0OCw4NC42NDg4NWMtMy44OTY5LDAuMDYwODggLTcuMDA4MDUsMy4yNjY2OCAtNi45NTIxNSw3LjE2MzY1djcwLjYyNWMtMC4wMzYwMiwyLjU0Njk5IDEuMzAyMTUsNC45MTYwNyAzLjUwMjEsNi4yMDAwOGMyLjE5OTk1LDEuMjg0MDEgNC45MjA4NCwxLjI4NDAxIDcuMTIwOCwwYzIuMTk5OTUsLTEuMjg0MDEgMy41MzgxMiwtMy42NTMwOSAzLjUwMjEsLTYuMjAwMDh2LTcwLjYyNWMwLjAyNzQsLTEuOTA5NzkgLTAuNzE5ODIsLTMuNzQ5MjYgLTIuMDcxMjQsLTUuMDk4OTZjLTEuMzUxNDMsLTEuMzQ5NyAtMy4xOTE4NiwtMi4wOTQ1NSAtNS4xMDE2MSwtMi4wNjQ3ek0xMjkuMzY4ODEsODQuNjQ4ODVjLTMuODk2OSwwLjA2MDg4IC03LjAwODA1LDMuMjY2NjggLTYuOTUyMTUsNy4xNjM2NXY3MC42MjVjLTAuMDM2MDIsMi41NDY5OSAxLjMwMjE1LDQuOTE2MDcgMy41MDIxLDYuMjAwMDhjMi4xOTk5NSwxLjI4NDAxIDQuOTIwODQsMS4yODQwMSA3LjEyMDgsMGMyLjE5OTk1LC0xLjI4NDAxIDMuNTM4MTIsLTMuNjUzMDkgMy41MDIxLC02LjIwMDA4di03MC42MjVjMC4wMjc0LC0xLjkwOTc5IC0wLjcxOTgyLC0zLjc0OTI2IC0yLjA3MTI0LC01LjA5ODk2Yy0xLjM1MTQzLC0xLjM0OTcgLTMuMTkxODYsLTIuMDk0NTUgLTUuMTAxNjEsLTIuMDY0N3oiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="
            alt=""
        />
    </>
);

export default IconTrash;
