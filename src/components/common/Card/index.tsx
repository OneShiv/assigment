import { ReactNode } from "react";

function Card(props: { children: ReactNode }) {
  return <div className="card">{props.children}</div>;
}

export default Card;
