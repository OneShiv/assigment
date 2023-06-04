import React from "react";
import { render, screen } from "@testing-library/react";
import LabelValue from "../../../../src/components/common/LabelValue";

describe("[Component : LabelValue]", () => {
  it("should render label and value", () => {
    render(<LabelValue label="TEST-LABEL" value="TEST-VALUE" />);
    expect(screen.getByText("TEST-LABEL")).toBeInTheDocument();
    expect(screen.getByText("TEST-VALUE")).toBeInTheDocument();
  });
});
