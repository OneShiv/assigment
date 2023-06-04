import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "../../../../src/components/common/Card";

describe("[Component Card]", () => {
  it("should render passed component", () => {
    render(<Card>TEST</Card>);
    expect(screen.getByText("TEST")).toBeInTheDocument();
  });
});
